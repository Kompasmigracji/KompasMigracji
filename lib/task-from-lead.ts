/* Автоматично створює справу в Канбан-дошці (/admin/tasks) для кожного нового ліда. */
import { q } from "@/lib/db";

interface LeadInfo {
  name:       string | null;
  contact?:   string | null;
  source?:    string | null;
  service?:   string | null;
  situation?: string | null;
}

export async function createTaskFromLead(lead: LeadInfo): Promise<void> {
  try {
    const name     = lead.name?.trim() || "Невідомий";
    const srcLabel = lead.source ? `[${lead.source}]` : "";
    const title    = `${srcLabel} ${name}`.trim();

    const lines: string[] = [];
    if (lead.contact)   lines.push(`📞 ${lead.contact}`);
    if (lead.service)   lines.push(`📋 ${lead.service}`);
    if (lead.situation) lines.push(`💬 ${lead.situation.slice(0, 400)}`);
    const description = lines.join("\n") || null;

    await q(
      `INSERT INTO tasks (title, description, category, stage, priority)
       VALUES ($1, $2, 'general', 'todo', 'normal')`,
      [title, description],
    );
  } catch (err) {
    console.error("task-from-lead: failed to create task", err);
  }
}
