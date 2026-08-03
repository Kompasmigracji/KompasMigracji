import { getAllAgents, setAgentStatus, dispatchTask } from './agents';
import { sendEmail } from './notify';

// Email to notify the Grand Architect
const NOTIFY_EMAIL = 'iphoenixgsm@gmail.com';

/**
 * Run a monitoring cycle:
 *  - Check agents for missing heartbeat (>2 minutes).
 *  - For each stale agent, mark it `error` then dispatch a "restart" task.
 *    `dispatchTask` now performs the restart synchronously (resets the
 *    agent's status back to `idle` and refreshes its heartbeat) instead of
 *    only queuing an inert row, so by the time the email below is sent the
 *    agent has actually been recovered.
 *  - Send a status email reflecting the real outcome.
 */
export async function runMonitorCycle() {
  const agents = await getAllAgents();
  const now = new Date();
  const staleAgents = agents.filter((a) => {
    if (!a.last_heartbeat) return true;
    const diff = now.getTime() - new Date(a.last_heartbeat).getTime();
    return diff > 2 * 60 * 1000; // 2 minutes
  });

  for (const agent of staleAgents) {
    // mark as error (records the stale state before the auto-restart below)
    await setAgentStatus(agent.id, 'error');
    // dispatch + synchronously execute a restart task
    const task = await dispatchTask(agent.id, 'restart', {});
    const restarted = task?.status === 'completed';

    // send status email
    const subject = `Agent ${agent.name} needs attention`;
    const html = `<p>Привет, Гранд Архитектор!</p><p>Агент <strong>${agent.name}</strong> (${agent.role}) не отправлял heartbeat более 2 минут. Мы поставили статус <em>error</em> и ${
      restarted
        ? 'автоматически перезапустили агента: статус сброшен на <em>idle</em>, heartbeat обновлён.'
        : 'попытались его перезапустить, но задача не завершилась успешно — требуется ручная проверка.'
    }</p><p>Мотивация: Вы делаете отличную работу! 🚀</p>`;
    await sendEmail(NOTIFY_EMAIL, subject, html);
  }
}
