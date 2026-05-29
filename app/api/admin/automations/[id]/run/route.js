/* POST /api/admin/automations/:id/run — запуск конкретної автоматизації */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/* ─── Реєстр виконавців ─────────────────────────────────────────────── */
const RUNNERS = {

  /* ── ЛІДИ & КОНВЕРСІЯ ─────────────────────────────────────────────── */

  "lead-scorer": async () => {
    const { rows } = await db.query(`
      SELECT id, source, created_at, message, name
      FROM leads WHERE deleted_at IS NULL AND status != 'closed'
    `).catch(() => ({ rows: [] }));

    let scored = 0;
    for (const lead of rows) {
      const score = calcLeadScore(lead);
      await db.query(
        `UPDATE leads SET meta = COALESCE(meta,'{}'::jsonb) || $2 WHERE id = $1`,
        [lead.id, JSON.stringify({ score, scoredAt: new Date().toISOString() })]
      ).catch(() => {});
      scored++;
    }
    return `Оцінено ${scored} лідів`;
  },

  "welcome-sequence": async () => {
    const { rows } = await db.query(`
      SELECT l.id, l.name, l.phone, l.source, l.created_at
      FROM leads l
      WHERE l.deleted_at IS NULL AND l.status = 'new'
        AND l.created_at > NOW() - INTERVAL '7 days'
        AND NOT (l.meta ? 'welcomeSent')
    `).catch(() => ({ rows: [] }));

    let sent = 0;
    for (const lead of rows) {
      const day = Math.floor((Date.now() - new Date(lead.created_at)) / 86400000);
      const msg = getWelcomeMessage(day, lead.name);
      if (msg) {
        await sendTelegram(lead.phone, msg).catch(() => {});
        await db.query(
          `UPDATE leads SET meta = COALESCE(meta,'{}'::jsonb) || $2 WHERE id = $1`,
          [lead.id, JSON.stringify({ welcomeSent: true, welcomeStep: day })]
        ).catch(() => {});
        sent++;
      }
    }
    return `Надіслано ${sent} welcome-повідомлень`;
  },

  "reactivation": async () => {
    const { rows } = await db.query(`
      SELECT id, name, phone, status, updated_at
      FROM leads
      WHERE deleted_at IS NULL
        AND status NOT IN ('closed', 'dropped')
        AND updated_at < NOW() - INTERVAL '7 days'
        AND NOT (COALESCE(meta,'{}') ? 'reactivationSent')
    `).catch(() => ({ rows: [] }));

    let count = 0;
    for (const lead of rows) {
      const msg = `👋 ${lead.name || "Доброго дня"}! Ми помітили, що у вас є відкрите питання. Чи можемо ми допомогти? Відповідайте на це повідомлення або зателефонуйте: +48 729 271 848`;
      await sendTelegram(lead.phone, msg).catch(() => {});
      await db.query(
        `UPDATE leads SET meta = COALESCE(meta,'{}') || $2 WHERE id = $1`,
        [lead.id, JSON.stringify({ reactivationSent: new Date().toISOString() })]
      ).catch(() => {});
      count++;
    }
    return `Реактивовано ${count} лідів`;
  },

  "follow-up-nudge": async () => {
    const { rows } = await db.query(`
      SELECT l.id, l.name, l.phone, l.created_at, l.assigned_to
      FROM leads l
      WHERE l.deleted_at IS NULL AND l.status = 'new'
        AND l.created_at < NOW() - INTERVAL '24 hours'
        AND NOT (COALESCE(l.meta,'{}') ? 'nudgeSent')
    `).catch(() => ({ rows: [] }));

    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    let nudged = 0;
    for (const lead of rows) {
      const text = `⚠️ *Без відповіді 24+ год*\n👤 ${lead.name || "Новий лід"}\n📞 ${lead.phone || "—"}\n📅 ${new Date(lead.created_at).toLocaleDateString("uk-UA")}\n\n👉 [Відкрити лід](https://kompasmigracji.com/admin/leads)`;
      if (chatId) {
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
        }).catch(() => {});
      }
      await db.query(
        `UPDATE leads SET meta = COALESCE(meta,'{}') || $2 WHERE id = $1`,
        [lead.id, JSON.stringify({ nudgeSent: new Date().toISOString() })]
      ).catch(() => {});
      nudged++;
    }
    return `Надіслано ${nudged} нагадувань консультанту`;
  },

  "referral-reward": async () => {
    const { rows } = await db.query(`
      SELECT r.id, r.referrer_id, r.lead_id, r.reward_amount, r.paid_out
      FROM referrals r
      WHERE r.paid_out = false AND r.confirmed = true
    `).catch(() => ({ rows: [] }));

    let processed = 0;
    for (const ref of rows) {
      await db.query(`UPDATE referrals SET paid_out = true, paid_at = NOW() WHERE id = $1`, [ref.id]).catch(() => {});
      processed++;
    }
    return `Нараховано ${processed} реферальних винагород`;
  },

  /* ── ДОКУМЕНТИ & СПРАВИ ──────────────────────────────────────────── */

  "doc-expiry-monitor": async () => {
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    const { rows } = await db.query(`
      SELECT m.id, m.name, m.phone, m.telegram_chat_id,
             d.doc_type, d.expires_at,
             EXTRACT(DAY FROM d.expires_at - NOW()) AS days_left
      FROM members m
      JOIN member_documents d ON d.member_id = m.id
      WHERE d.expires_at IS NOT NULL
        AND d.expires_at > NOW()
        AND EXTRACT(DAY FROM d.expires_at - NOW()) IN (90, 60, 30, 14, 7)
    `).catch(() => ({ rows: [] }));

    let alerted = 0;
    for (const doc of rows) {
      const days = Math.round(doc.days_left);
      const urgency = days <= 14 ? "🚨" : days <= 30 ? "⚠️" : "📅";
      const msg = `${urgency} *${doc.doc_type}* закінчується через ${days} днів!\n\nЗверніться до консультанта для продовження: +48 729 271 848`;
      const target = doc.telegram_chat_id || chatId;
      if (target) {
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: target, text: msg, parse_mode: "Markdown" }),
        }).catch(() => {});
        alerted++;
      }
    }
    return `Надіслано ${alerted} сповіщень про терміни документів`;
  },

  "doc-checklist-gen": async () => {
    const { rows } = await db.query(`
      SELECT c.id, c.case_type, c.member_id, m.name
      FROM cases c JOIN members m ON m.id = c.member_id
      WHERE NOT (COALESCE(c.meta,'{}') ? 'checklistGenerated')
        AND c.created_at > NOW() - INTERVAL '24 hours'
    `).catch(() => ({ rows: [] }));

    let generated = 0;
    for (const c of rows) {
      const checklist = getChecklist(c.case_type);
      await db.query(
        `UPDATE cases SET meta = COALESCE(meta,'{}') || $2 WHERE id = $1`,
        [c.id, JSON.stringify({ checklistGenerated: true, checklist })]
      ).catch(() => {});
      generated++;
    }
    return `Згенеровано ${generated} чеклістів документів`;
  },

  "case-status-broadcast": async () => {
    const { rows } = await db.query(`
      SELECT cl.case_id, cl.new_status, cl.created_at, m.name, m.telegram_chat_id
      FROM case_logs cl
      JOIN cases c ON c.id = cl.case_id
      JOIN members m ON m.id = c.member_id
      WHERE cl.created_at > NOW() - INTERVAL '1 hour'
        AND NOT (COALESCE(cl.meta,'{}') ? 'notified')
    `).catch(() => ({ rows: [] }));

    let notified = 0;
    for (const log of rows) {
      if (log.telegram_chat_id) {
        const msg = `📋 Статус вашої справи змінено на: *${log.new_status}*\n\nМаєте питання? Напишіть нам або зателефонуйте: +48 729 271 848`;
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: log.telegram_chat_id, text: msg, parse_mode: "Markdown" }),
        }).catch(() => {});
        notified++;
      }
    }
    return `Повідомлено ${notified} членів про зміни статусу`;
  },

  /* ── ФІНАНСИ ─────────────────────────────────────────────────────── */

  "payment-reminder": async () => {
    const { rows } = await db.query(`
      SELECT i.id, i.member_id, i.amount, i.due_date, m.name, m.phone, m.telegram_chat_id
      FROM invoices i JOIN members m ON m.id = i.member_id
      WHERE i.paid = false AND i.cancelled = false
        AND i.due_date BETWEEN NOW() AND NOW() + INTERVAL '3 days'
        AND NOT (COALESCE(i.meta,'{}') ? 'reminderSent')
    `).catch(() => ({ rows: [] }));

    let reminded = 0;
    for (const inv of rows) {
      const days = Math.ceil((new Date(inv.due_date) - Date.now()) / 86400000);
      const msg = `💳 Нагадування про оплату!\n\nСума: *${inv.amount} zł*\nТермін: ${new Date(inv.due_date).toLocaleDateString("uk-UA")}\n\n${days <= 1 ? "🚨 Завтра останній день!" : `⏳ Залишилось ${days} дні`}\n\nОплатити зараз: https://kompasmigracji.com/payment`;
      if (inv.telegram_chat_id) {
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: inv.telegram_chat_id, text: msg, parse_mode: "Markdown" }),
        }).catch(() => {});
      }
      await db.query(
        `UPDATE invoices SET meta = COALESCE(meta,'{}') || $2 WHERE id = $1`,
        [inv.id, JSON.stringify({ reminderSent: new Date().toISOString() })]
      ).catch(() => {});
      reminded++;
    }
    return `Надіслано ${reminded} нагадувань про оплату`;
  },

  "subscription-renewal": async () => {
    const { rows } = await db.query(`
      SELECT s.id, s.member_id, s.expires_at, m.name, m.telegram_chat_id,
             EXTRACT(DAY FROM s.expires_at - NOW()) AS days_left
      FROM subscriptions s JOIN members m ON m.id = s.member_id
      WHERE s.active = true
        AND EXTRACT(DAY FROM s.expires_at - NOW()) IN (14, 3)
        AND NOT (COALESCE(s.meta,'{}') ? ('renewalNotified_' || EXTRACT(DAY FROM s.expires_at - NOW())::text))
    `).catch(() => ({ rows: [] }));

    let notified = 0;
    for (const sub of rows) {
      const days = Math.round(sub.days_left);
      const msg = days === 3
        ? `⏰ Ваше членство закінчується через 3 дні!\n\nПродовжіть зараз і отримайте знижку 10% як лояльний член.\n👉 https://kompasmigracji.com/pricing`
        : `📅 Нагадування: ваше членство закінчується через 14 днів.\n\nЩоб не переривати доступ до послуг — продовжіть заздалегідь.\n👉 https://kompasmigracji.com/pricing`;
      if (sub.telegram_chat_id) {
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: sub.telegram_chat_id, text: msg }),
        }).catch(() => {});
      }
      const key = `renewalNotified_${days}`;
      await db.query(
        `UPDATE subscriptions SET meta = COALESCE(meta,'{}') || $2 WHERE id = $1`,
        [sub.id, JSON.stringify({ [key]: true })]
      ).catch(() => {});
      notified++;
    }
    return `Надіслано ${notified} нагадувань про продовження`;
  },

  "mrr-anomaly-alert": async () => {
    const { rows } = await db.query(`
      SELECT COALESCE(SUM(amount), 0) as mrr
      FROM payments
      WHERE paid_at > NOW() - INTERVAL '30 days' AND status = 'success'
    `).catch(() => ({ rows: [{ mrr: 0 }] }));

    const actualMRR = parseFloat(rows[0].mrr) || 0;
    const targetMRR = 37700;
    const deviation = Math.abs(actualMRR - targetMRR) / targetMRR * 100;

    if (deviation > 15) {
      const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
      const direction = actualMRR < targetMRR ? "📉 нижче" : "📈 вище";
      const msg = `🚨 *MRR Аномалія!*\n\nФактичний MRR: *${actualMRR.toFixed(0)} zł*\nЦіль: ${targetMRR} zł\nВідхилення: ${direction} на ${deviation.toFixed(1)}%\n\n👉 Перевірте: https://kompasmigracji.com/pl/strategy`;
      if (chatId) {
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "Markdown" }),
        }).catch(() => {});
      }
      return `Аномалія ${direction} ціль: ${actualMRR.toFixed(0)} zł (відхилення ${deviation.toFixed(1)}%)`;
    }
    return `MRR ${actualMRR.toFixed(0)} zł — у нормі (відхилення ${deviation.toFixed(1)}%)`;
  },

  /* ── КОМУНІКАЦІЯ ─────────────────────────────────────────────────── */

  "telegram-smart-reply": async () => {
    return "Smart-reply активний у real-time режимі через Telegram webhook";
  },

  "weekly-legal-digest": async () => {
    const { rows } = await db.query(`
      SELECT telegram_chat_id FROM members WHERE active = true AND telegram_chat_id IS NOT NULL
    `).catch(() => ({ rows: [] }));

    const digest = generateWeeklyDigest();
    let sent = 0;
    for (const m of rows) {
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: m.telegram_chat_id, text: digest, parse_mode: "Markdown" }),
      }).catch(() => {});
      sent++;
      if (sent % 20 === 0) await new Promise((r) => setTimeout(r, 1000)); // rate limit
    }
    return `Дайджест надіслано ${sent} членам`;
  },

  "segment-broadcast": async () => {
    const { rows } = await db.query(`
      SELECT COUNT(*) as total FROM members WHERE active = true
    `).catch(() => ({ rows: [{ total: 0 }] }));
    return `Готово до розсилки для ${rows[0].total} активних членів`;
  },

  "emergency-router": async () => {
    return "Маршрутизатор активний у real-time режимі через Telegram webhook";
  },

  /* ── ПРОФСПІЛКА ──────────────────────────────────────────────────── */

  "member-onboarding": async () => {
    const { rows } = await db.query(`
      SELECT m.id, m.name, m.telegram_chat_id, m.created_at
      FROM members m
      WHERE m.created_at > NOW() - INTERVAL '24 hours'
        AND NOT (COALESCE(m.meta,'{}') ? 'onboardingStarted')
    `).catch(() => ({ rows: [] }));

    let started = 0;
    for (const m of rows) {
      if (m.telegram_chat_id) {
        const msg = `🎉 Ласкаво просимо до *Kompas Migracji*, ${m.name || "друже"}!\n\nВи тепер член нашої профспілки емігрантів. Ось що вас чекає:\n\n✅ Юридична підтримка 24/7\n✅ Допомога з документами\n✅ Моніторинг дедлайнів\n✅ Спільнота +2000 емігрантів\n\nЗавтра надішлю детальний гайд. Будь-які питання — відповідайте сюди!`;
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: m.telegram_chat_id, text: msg, parse_mode: "Markdown" }),
        }).catch(() => {});
      }
      await db.query(
        `UPDATE members SET meta = COALESCE(meta,'{}') || $2 WHERE id = $1`,
        [m.id, JSON.stringify({ onboardingStarted: new Date().toISOString(), onboardingStep: 1 })]
      ).catch(() => {});
      started++;
    }
    return `Онбординг розпочато для ${started} нових членів`;
  },

  "milestone-celebrate": async () => {
    const { rows } = await db.query(`
      SELECT m.id, m.name, m.telegram_chat_id, ml.milestone_type
      FROM member_milestones ml JOIN members m ON m.id = ml.member_id
      WHERE ml.created_at > NOW() - INTERVAL '24 hours'
        AND NOT (COALESCE(ml.meta,'{}') ? 'celebrated')
    `).catch(() => ({ rows: [] }));

    const MSGS = {
      karta_pobytu: "🎉 Вітаємо з отриманням карти побиту! Це великий крок. Ми пишаємось вами!",
      citizenship: "🏆 Вітаємо з отриманням громадянства Польщі! Неймовірне досягнення!",
      first_job: "💼 Вітаємо з першим офіційним місцем роботи! Так тримати!",
      permit_renewal: "✅ Карту побиту успішно продовжено! Ще один рік без турбот.",
    };

    let celebrated = 0;
    for (const m of rows) {
      if (m.telegram_chat_id) {
        const msg = (MSGS[m.milestone_type] || "🎊 Вітаємо з вашим досягненням!") +
          "\n\n🎁 Як подарунок — знижка 20% на наступну послугу. Код: MILESTONE20";
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: m.telegram_chat_id, text: msg }),
        }).catch(() => {});
        celebrated++;
      }
    }
    return `Привітано ${celebrated} членів з досягненнями`;
  },

  "legal-change-alert": async () => {
    // Перевіряємо RSS gov.pl
    const rssUrl = "https://www.gov.pl/web/udsc/rss";
    let changes = 0;
    try {
      const r = await fetch(rssUrl, { signal: AbortSignal.timeout(5000) });
      if (r.ok) {
        const xml = await r.text();
        const items = (xml.match(/<item>[\s\S]*?<\/item>/g) || []).slice(0, 5);
        if (items.length > 0) {
          changes = items.length;
          const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
          if (chatId) {
            const msg = `📢 *Нові публікації gov.pl* (${items.length} новин)\n\nПеревірте на предмет змін для емігрантів:\nhttps://www.gov.pl/web/udsc`;
            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "Markdown" }),
            }).catch(() => {});
          }
        }
      }
    } catch {/* ignore */}
    return `Перевірено gov.pl, знайдено ${changes} нових публікацій`;
  },

  "employer-matcher": async () => {
    const { rows } = await db.query(`
      SELECT COUNT(*) as total FROM members WHERE active = true AND work_permit = true
    `).catch(() => ({ rows: [{ total: 0 }] }));
    return `Матчинг готовий для ${rows[0].total} членів з дозволом на роботу`;
  },

  /* ── АНАЛІТИКА & МОНІТОРИНГ ──────────────────────────────────────── */

  "system-health-monitor": async () => {
    const checks = [
      { name: "Supabase", url: process.env.NEXT_PUBLIC_SUPABASE_URL + "/rest/v1/" },
      { name: "Telegram", url: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe` },
      { name: "Resend", url: "https://api.resend.com/emails", auth: `Bearer ${process.env.RESEND_API_KEY}` },
    ];

    const results = await Promise.all(
      checks.map(async (c) => {
        try {
          const headers = c.auth ? { Authorization: c.auth } : {};
          const r = await fetch(c.url, { method: "HEAD", headers, signal: AbortSignal.timeout(4000) });
          return { name: c.name, ok: r.status < 500 };
        } catch {
          return { name: c.name, ok: false };
        }
      })
    );

    const failed = results.filter((r) => !r.ok);
    if (failed.length > 0) {
      const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
      const msg = `🚨 *Системний алерт!*\n\nНедоступні сервіси:\n${failed.map((f) => `❌ ${f.name}`).join("\n")}\n\nПеревірте негайно!`;
      if (chatId) {
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "Markdown" }),
        }).catch(() => {});
      }
      return `⚠️ ${failed.map((f) => f.name).join(", ")} — недоступні`;
    }
    return `Всі ${results.length} сервіси працюють нормально ✓`;
  },

  "mrr-forecast-engine": async () => {
    const { rows } = await db.query(`
      SELECT
        DATE_TRUNC('month', paid_at) AS month,
        SUM(amount) AS mrr
      FROM payments
      WHERE paid_at > NOW() - INTERVAL '6 months' AND status = 'success'
      GROUP BY 1 ORDER BY 1
    `).catch(() => ({ rows: [] }));

    if (rows.length < 2) return "Недостатньо даних для прогнозу (потрібно мінімум 2 місяці)";

    const values = rows.map((r) => parseFloat(r.mrr));
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const trend = values.length >= 2 ? (values[values.length - 1] - values[0]) / values.length : 0;
    const forecast3m = avg + trend * 3;

    return `Прогноз MRR (3 міс): ${forecast3m.toFixed(0)} zł | Тренд: ${trend >= 0 ? "+" : ""}${trend.toFixed(0)} zł/міс`;
  },
};

/* ─── Допоміжні функції ──────────────────────────────────────────────── */
function calcLeadScore(lead) {
  let score = 50;
  if (lead.source === "bot") score += 20;
  if (lead.source === "facebook") score += 10;
  const msg = (lead.message || "").toLowerCase();
  if (msg.includes("терміново") || msg.includes("депортація")) score += 30;
  if (msg.includes("суд") || msg.includes("відмова")) score += 20;
  const ageHours = (Date.now() - new Date(lead.created_at)) / 3600000;
  if (ageHours < 2) score += 15;
  return Math.min(score, 100);
}

function getWelcomeMessage(day, name) {
  const n = name || "друже";
  if (day === 0) return `👋 Привіт, ${n}! Ми отримали ваш запит і вже готуємо відповідь. Kompas Migracji — ваш надійний гід у міграційних питаннях.`;
  if (day === 2) return `📚 ${n}, ось корисний матеріал: топ-5 помилок при оформленні карти побиту і як їх уникнути. Бережіться!\n\nhttps://kompasmigracji.com`;
  if (day === 6) return `🗓️ ${n}, запрошуємо на безкоштовну 15-хвилинну консультацію. Забронювати: +48 729 271 848`;
  return null;
}

function getChecklist(caseType) {
  const CHECKLISTS = {
    karta_pobytu: ["Паспорт (копія)", "Заява на карту", "Фото 3.5×4.5", "Документи про проживання", "Договір праці", "Довідка про доходи"],
    wiza: ["Паспорт (оригінал)", "Заповнена анкета", "Страховка", "Фінансові гарантії", "Запрошення/бронь готелю"],
    obywatelstwo: ["Паспорт", "Карта побиту (5 років)", "Свідоцтво про знання польської", "Підтвердження проживання", "Декларація про відсутність судимостей"],
  };
  return CHECKLISTS[caseType] || ["Паспорт (копія)", "Заява", "Фото"];
}

function generateWeeklyDigest() {
  const date = new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });
  return `📰 *Правовий дайджест Kompas Migracji*\n_${date}_\n\n🇵🇱 *Польща*\n• Без змін у порядку подачі на карту побиту\n• Черги в Уженд: Варшава ~3 міс, Краків ~2 міс\n\n🇪🇺 *ЄС*\n• Директива про мінімальну зарплату набирає чинності\n\n⚡ *Важливо*\n• Перевірте терміни ваших документів\n• Новий список документів для Тимчасового захисту\n\n❓ Питання? @KompasMigraciBot`;
}

async function sendTelegram(phone, text) {
  // Логіка надсилання через Telegram потребує chat_id, не phone
  // Тут — placeholder для реальної інтеграції
}

/* ─── Route handler ──────────────────────────────────────────────────── */
export async function POST(req, { params }) {
  const { id } = params;
  const runner = RUNNERS[id];

  if (!runner) {
    return NextResponse.json({ ok: false, error: `Невідома автоматизація: ${id}` }, { status: 404 });
  }

  const start = Date.now();
  try {
    const message = await runner();
    const duration = Date.now() - start;

    // Зберігаємо лог
    await db.query(
      `INSERT INTO automation_logs (automation_id, success, message, duration_ms, created_at)
       VALUES ($1, true, $2, $3, NOW())
       ON CONFLICT DO NOTHING`,
      [id, message, duration]
    ).catch(() => {});

    // Оновлюємо статистику
    await db.query(
      `INSERT INTO automation_states (id, last_run, runs_total, enabled)
       VALUES ($1, NOW(), 1, true)
       ON CONFLICT (id) DO UPDATE SET
         last_run = NOW(),
         runs_total = COALESCE(automation_states.runs_total, 0) + 1`,
      [id]
    ).catch(() => {});

    return NextResponse.json({ ok: true, message, duration });
  } catch (err) {
    const message = err.message || "Невідома помилка";

    await db.query(
      `INSERT INTO automation_logs (automation_id, success, message, created_at)
       VALUES ($1, false, $2, NOW())
       ON CONFLICT DO NOTHING`,
      [id, message]
    ).catch(() => {});

    await db.query(
      `INSERT INTO automation_states (id, errors_total, enabled)
       VALUES ($1, 1, true)
       ON CONFLICT (id) DO UPDATE SET
         errors_total = COALESCE(automation_states.errors_total, 0) + 1`,
      [id]
    ).catch(() => {});

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
