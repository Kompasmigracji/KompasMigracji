import { getAllAgents, setAgentStatus, dispatchTask } from './agents';
import { sendEmail } from './notify';
import { getSupabase } from './supabase';

// Email to notify the Grand Architect
const NOTIFY_EMAIL = 'iphoenixgsm@gmail.com';

/**
 * Run a monitoring cycle:
 *  - Check agents for missing heartbeat (>2 minutes).
 *  - For each stale agent, create a "restart" task and send a motivational email.
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
    // mark as error
    await setAgentStatus(agent.id, 'error');
    // create restart task
    await dispatchTask(agent.id, 'restart', {});
    // send motivation email
    const subject = `Agent ${agent.name} needs attention`;
    const html = `<p>Привет, Гранд Архитектор!</p><p>Агент <strong>${agent.name}</strong> (${agent.role}) не отправлял heartbeat более 2 минут. Мы поставили статус <em>error</em> и создали задачу перезапуска.</p><p>Мотивация: Вы делаете отличную работу! 🚀</p>`;
    await sendEmail(NOTIFY_EMAIL, subject, html);
  }
}
