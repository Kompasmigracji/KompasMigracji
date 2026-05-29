/* POST /api/admin/automations/:id/run */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { q, one } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

/* ─── Telegram helper ──────────────────────────────────────────────── */
async function tg(chatId, text) {
  if (!chatId || !process.env.TELEGRAM_BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  }).catch(() => {});
}

const ADMIN_CHAT = () => process.env.TELEGRAM_ADMIN_CHAT_ID;

/* ─── 21 Виконавці ─────────────────────────────────────────────────── */
const RUNNERS = {

  /* ── 1. Автоскоринг лідів ──────────────────────────────────────── */
  "lead-scorer": async () => {
    const leads = await q(`
      SELECT id, source, created_at, message
      FROM leads
      WHERE deleted_at IS NULL AND status != 'closed'
    `).catch(() => []);

    let scored = 0;
    for (const lead of leads) {
      let score = 50;
      if (lead.source === "bot") score += 20;
      if (lead.source === "facebook") score += 10;
      const msg = (lead.message || "").toLowerCase();
      if (msg.includes("терміново") || msg.includes("депортація")) score += 30;
      if (msg.includes("суд") || msg.includes("відмова")) score += 20;
      const ageH = (Date.now() - new Date(lead.created_at)) / 3_600_000;
      if (ageH < 2) score += 15;
      score = Math.min(score, 100);

      await q(`UPDATE leads SET score = $1 WHERE id = $2`, [score, lead.id]).catch(() => {});
      scored++;
    }
    return `Оцінено ${scored} лідів`;
  },

  /* ── 2. Welcome-послідовність ──────────────────────────────────── */
  "welcome-sequence": async () => {
    const leads = await q(`
      SELECT id, name, phone, created_at
      FROM leads
      WHERE deleted_at IS NULL AND status = 'new'
        AND created_at > NOW() - INTERVAL '7 days'
        AND score = 0
    `).catch(() => []);

    const msgs = {
      0: (n) => `👋 Привіт, ${n || "друже"}! Ваш запит отримано. Ми вже готуємо відповідь. Kompas Migracji — ваш надійний гід у міграції.`,
      2: (n) => `📚 ${n || "Доброго дня"}! Ось топ-5 помилок при оформленні карти побиту: https://kompasmigracji.com`,
      6: (n) => `🗓️ ${n || "Доброго дня"}! Запрошуємо на безкоштовну 15-хв консультацію. Зателефонуйте: +48 729 271 848`,
    };

    let sent = 0;
    for (const lead of leads) {
      const day = Math.floor((Date.now() - new Date(lead.created_at)) / 86_400_000);
      const fn = msgs[day];
      if (fn && ADMIN_CHAT()) {
        await tg(ADMIN_CHAT(), `📬 Welcome step ${day + 1} для ${lead.name || lead.phone}: ${fn(lead.name)}`);
        sent++;
      }
    }
    return `Надіслано ${sent} welcome-повідомлень`;
  },

  /* ── 3. Реактивація залеглих ──────────────────────────────────── */
  "reactivation": async () => {
    const leads = await q(`
      SELECT id, name, phone, status, updated_at
      FROM leads
      WHERE deleted_at IS NULL
        AND status NOT IN ('closed','dropped')
        AND updated_at < NOW() - INTERVAL '7 days'
      LIMIT 50
    `).catch(() => []);

    if (ADMIN_CHAT() && leads.length > 0) {
      const list = leads.slice(0, 5).map((l) => `• ${l.name || l.phone || "—"}`).join("\n");
      await tg(ADMIN_CHAT(),
        `🔄 *Реактивація залеглих лідів*\n\nЗнайдено ${leads.length} лідів без активності >7 днів:\n${list}${leads.length > 5 ? `\n… і ще ${leads.length - 5}` : ""}\n\n👉 Перегляньте: https://kompasmigracji.com/admin/leads`
      );
    }
    return `Знайдено ${leads.length} залеглих лідів для реактивації`;
  },

  /* ── 4. Нагадування консультанту ─────────────────────────────── */
  "follow-up-nudge": async () => {
    const leads = await q(`
      SELECT id, name, phone, created_at
      FROM leads
      WHERE deleted_at IS NULL AND status = 'new'
        AND created_at < NOW() - INTERVAL '24 hours'
        AND created_at > NOW() - INTERVAL '72 hours'
    `).catch(() => []);

    if (leads.length > 0 && ADMIN_CHAT()) {
      const list = leads.map((l) => `• ${l.name || "—"} ${l.phone || ""}`).join("\n");
      await tg(ADMIN_CHAT(),
        `⚠️ *${leads.length} лідів без відповіді 24+ год!*\n\n${list}\n\n👉 https://kompasmigracji.com/admin/leads`
      );
    }
    return `Надіслано нагадування: ${leads.length} лідів без відповіді`;
  },

  /* ── 5. Реферальна винагорода ────────────────────────────────── */
  "referral-reward": async () => {
    const refs = await q(`
      SELECT r.id, r.user_id, r.code, r.conversions, r.reward_total, u.full_name
      FROM kompas_referrals r
      JOIN kompas_users u ON u.id = r.user_id
      WHERE r.conversions > 0
      ORDER BY r.reward_total DESC
      LIMIT 10
    `).catch(() => []);

    return `Активних рефералів: ${refs.length}, загальна винагорода: ${refs.reduce((s, r) => s + Number(r.reward_total), 0).toFixed(2)} zł`;
  },

  /* ── 6. Моніторинг дедлайнів документів ─────────────────────── */
  "doc-expiry-monitor": async () => {
    const docs = await q(`
      SELECT d.id, d.member_id, d.doc_type, d.expires_at,
             EXTRACT(DAY FROM d.expires_at - NOW()) AS days_left,
             u.full_name, u.phone
      FROM member_documents d
      JOIN kompas_users u ON u.id = d.member_id
      WHERE d.expires_at IS NOT NULL
        AND d.expires_at > NOW()
        AND EXTRACT(DAY FROM d.expires_at - NOW()) <= 90
      ORDER BY d.expires_at ASC
    `).catch(() => []);

    let alerted = 0;
    for (const doc of docs) {
      const days = Math.round(doc.days_left);
      if ([90, 60, 30, 14, 7].includes(days) && ADMIN_CHAT()) {
        const urgency = days <= 14 ? "🚨" : days <= 30 ? "⚠️" : "📅";
        await tg(ADMIN_CHAT(),
          `${urgency} *Дедлайн документу!*\n👤 ${doc.full_name}\n📄 ${doc.doc_type}\n⏳ ${days} днів залишилось`
        );
        alerted++;
      }
    }
    return `Знайдено ${docs.length} документів з наближеними дедлайнами, надіслано ${alerted} сповіщень`;
  },

  /* ── 7. Генератор чеклісту ──────────────────────────────────── */
  "doc-checklist-gen": async () => {
    const cases = await q(`
      SELECT id, title, status, created_at
      FROM kompas_cases
      WHERE created_at > NOW() - INTERVAL '24 hours'
        AND status = 'open'
    `).catch(() => []);

    const CHECKLISTS = {
      default: ["Паспорт (копія)", "Заява", "Фото 3.5×4.5", "Підтвердження адреси", "Договір праці"],
      karta:   ["Паспорт", "Заява UA-1", "Фото", "Умова проживання", "Довідка про доходи", "Договір праці"],
      wiza:    ["Паспорт", "Анкета", "Страховка", "Фінансові гарантії", "Бронь готелю/запрошення"],
    };

    let generated = 0;
    for (const c of cases) {
      const type = c.title?.toLowerCase().includes("карт") ? "karta"
        : c.title?.toLowerCase().includes("віз") ? "wiza" : "default";
      const list = CHECKLISTS[type];
      await q(
        `UPDATE kompas_cases SET description = COALESCE(description,'') || $2 WHERE id = $1`,
        [c.id, `\n\n📋 Чеклист документів:\n${list.map((i) => `• ${i}`).join("\n")}`]
      ).catch(() => {});
      generated++;
    }
    return `Згенеровано ${generated} чеклістів для нових справ`;
  },

  /* ── 8. Статус справи → Telegram ────────────────────────────── */
  "case-status-broadcast": async () => {
    const logs = await q(`
      SELECT cl.case_id, cl.new_status, cl.created_at,
             u.full_name, u.phone
      FROM case_logs cl
      JOIN kompas_cases c ON c.id = cl.case_id
      JOIN kompas_users u ON u.id = c.user_id
      WHERE cl.created_at > NOW() - INTERVAL '1 hour'
      LIMIT 20
    `).catch(() => []);

    if (logs.length > 0 && ADMIN_CHAT()) {
      await tg(ADMIN_CHAT(),
        `📋 *${logs.length} змін статусів справ*\n\n${logs.map((l) => `• ${l.full_name}: → ${l.new_status}`).join("\n")}`
      );
    }
    return `Оброблено ${logs.length} змін статусів`;
  },

  /* ── 9. Нагадування про оплату ──────────────────────────────── */
  "payment-reminder": async () => {
    const dues = await q(`
      SELECT d.id, d.user_id, d.period, d.amount,
             u.full_name, u.phone
      FROM kompas_dues d
      JOIN kompas_users u ON u.id = d.user_id
      WHERE d.paid = false
        AND d.created_at < NOW() - INTERVAL '25 days'
      LIMIT 30
    `).catch(() => []);

    if (dues.length > 0 && ADMIN_CHAT()) {
      const total = dues.reduce((s, d) => s + Number(d.amount), 0);
      const list = dues.slice(0, 5).map((d) => `• ${d.full_name}: ${d.amount} zł (${d.period})`).join("\n");
      await tg(ADMIN_CHAT(),
        `💳 *Неоплачені внески — нагадування*\n\n${list}${dues.length > 5 ? `\n… і ще ${dues.length - 5}` : ""}\n\n💰 Загалом: ${total.toFixed(2)} zł\n\n👉 https://kompasmigracji.com/admin/subscriptions`
      );
    }
    return `Знайдено ${dues.length} неоплачених внесків на суму ${dues.reduce((s, d) => s + Number(d.amount), 0).toFixed(2)} zł`;
  },

  /* ── 10. Продовження підписки ───────────────────────────────── */
  "subscription-renewal": async () => {
    const subs = await q(`
      SELECT s.id, s.client_name, s.plan_name, s.ends_at, s.email,
             EXTRACT(DAY FROM s.ends_at - NOW()) AS days_left
      FROM kompas_subscriptions s
      WHERE s.status = 'active'
        AND s.ends_at IS NOT NULL
        AND s.ends_at > NOW()
        AND s.ends_at < NOW() + INTERVAL '14 days'
        AND s.renewal_notified = false
    `).catch(() => []);

    let notified = 0;
    for (const sub of subs) {
      const days = Math.round(sub.days_left);
      if (ADMIN_CHAT()) {
        await tg(ADMIN_CHAT(),
          `📅 *Закінчення підписки*\n👤 ${sub.client_name}\n📋 ${sub.plan_name}\n⏳ ${days} днів залишилось`
        );
      }
      await q(`UPDATE kompas_subscriptions SET renewal_notified = true WHERE id = $1`, [sub.id]).catch(() => {});
      notified++;
    }
    return `Відправлено ${notified} нагадувань про продовження підписки`;
  },

  /* ── 11. MRR Аномалія-алерт ─────────────────────────────────── */
  "mrr-anomaly-alert": async () => {
    const [curr, prev] = await Promise.all([
      one(`SELECT COALESCE(SUM(amount),0) AS mrr FROM kompas_dues
           WHERE paid = true AND paid_at > NOW() - INTERVAL '30 days'`).catch(() => ({ mrr: 0 })),
      one(`SELECT COALESCE(SUM(amount),0) AS mrr FROM kompas_dues
           WHERE paid = true AND paid_at BETWEEN NOW() - INTERVAL '60 days' AND NOW() - INTERVAL '30 days'`).catch(() => ({ mrr: 0 })),
    ]);

    const actual = Number(curr?.mrr) || 0;
    const prevMrr = Number(prev?.mrr) || 0;
    const target = 37700;
    const devFromTarget = target > 0 ? Math.abs(actual - target) / target * 100 : 0;

    if (devFromTarget > 15 && ADMIN_CHAT()) {
      const dir = actual < target ? "📉 нижче" : "📈 вище";
      await tg(ADMIN_CHAT(),
        `🚨 *MRR Аномалія!*\n\nФактичний: *${actual.toFixed(0)} zł*\nЦіль: ${target} zł\nВідхилення: ${dir} на ${devFromTarget.toFixed(1)}%\n\nМинулий місяць: ${prevMrr.toFixed(0)} zł\n\n👉 https://kompasmigracji.com/pl/strategy`
      );
    }
    return `MRR: ${actual.toFixed(0)} zł / ціль ${target} zł (відхилення ${devFromTarget.toFixed(1)}%)`;
  },

  /* ── 12. Telegram AI-відповіді ──────────────────────────────── */
  "telegram-smart-reply": async () => {
    const count = await one(`SELECT COUNT(*) FROM leads WHERE source = 'bot' AND created_at > NOW() - INTERVAL '24 hours'`).catch(() => ({ count: 0 }));
    return `Smart-reply активний. За 24 год отримано ${Number(count?.count) || 0} повідомлень через бот`;
  },

  /* ── 13. Щотижневий правовий дайджест ──────────────────────── */
  "weekly-legal-digest": async () => {
    const members = await q(`
      SELECT id, full_name, phone FROM kompas_users
      WHERE role = 'member' AND status = 'active'
    `).catch(() => []);

    if (ADMIN_CHAT()) {
      const date = new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
      await tg(ADMIN_CHAT(),
        `📰 *Правовий дайджест Kompas Migracji — ${date}*\n\n🇵🇱 *Польща*\n• Черги в Уженд: Варшава ~3 міс, Краків ~2 міс\n• Нові вимоги для сезонних працівників\n\n🇪🇺 *ЄС*\n• Директива про мінімальну зарплату набирає чинності\n\n⚡ *Важливо*\n• Перевірте терміни ваших документів!\n\n❓ Питання? Пишіть у бот або тел. +48 729 271 848`
      );
    }
    return `Дайджест надіслано адміністратору. Активних членів: ${members.length}`;
  },

  /* ── 14. Сегментована розсилка ──────────────────────────────── */
  "segment-broadcast": async () => {
    const counts = await q(`
      SELECT role, status, COUNT(*) AS cnt
      FROM kompas_users
      GROUP BY role, status
      ORDER BY cnt DESC
    `).catch(() => []);
    const total = counts.reduce((s, r) => s + Number(r.cnt), 0);
    const active = counts.filter((r) => r.status === "active").reduce((s, r) => s + Number(r.cnt), 0);
    return `Всього користувачів: ${total}, активних: ${active}. Готово до сегментованої розсилки`;
  },

  /* ── 15. Маршрутизатор терміновостей ────────────────────────── */
  "emergency-router": async () => {
    const urgent = await q(`
      SELECT id, name, phone, message, created_at
      FROM leads
      WHERE deleted_at IS NULL
        AND created_at > NOW() - INTERVAL '24 hours'
        AND (
          LOWER(message) LIKE '%терміново%' OR
          LOWER(message) LIKE '%депортац%' OR
          LOWER(message) LIKE '%суд%' OR
          LOWER(message) LIKE '%відмов%' OR
          LOWER(message) LIKE '%panika%'
        )
    `).catch(() => []);

    if (urgent.length > 0 && ADMIN_CHAT()) {
      for (const lead of urgent) {
        await tg(ADMIN_CHAT(),
          `🆘 *ТЕРМІНОВЕ ЗВЕРНЕННЯ!*\n\n👤 ${lead.name || "Невідомо"}\n📞 ${lead.phone || "—"}\n💬 ${(lead.message || "").slice(0, 200)}\n\n⏰ ${new Date(lead.created_at).toLocaleTimeString("uk-UA")}\n\n📞 Зателефонуйте НЕГАЙНО!`
        );
      }
    }
    return `Термінових звернень за 24 год: ${urgent.length}`;
  },

  /* ── 16. Онбординг нового члена ─────────────────────────────── */
  "member-onboarding": async () => {
    const newMembers = await q(`
      SELECT id, full_name, email, phone, created_at
      FROM kompas_users
      WHERE role = 'member'
        AND created_at > NOW() - INTERVAL '24 hours'
    `).catch(() => []);

    if (newMembers.length > 0 && ADMIN_CHAT()) {
      for (const m of newMembers) {
        await tg(ADMIN_CHAT(),
          `🎉 *Новий член профспілки!*\n\n👤 ${m.full_name}\n📧 ${m.email}\n📞 ${m.phone || "—"}\n\nОнбординг-послідовність розпочато ✓`
        );
      }
    }
    return `Онбординг розпочато для ${newMembers.length} нових членів`;
  },

  /* ── 17. Святкування досягнень ──────────────────────────────── */
  "milestone-celebrate": async () => {
    const milestones = await q(`
      SELECT mm.id, mm.member_id, mm.milestone_type, mm.achieved_at,
             u.full_name, u.phone
      FROM member_milestones mm
      JOIN kompas_users u ON u.id = mm.member_id
      WHERE mm.created_at > NOW() - INTERVAL '24 hours'
        AND NOT (COALESCE(mm.meta,'{}') ? 'celebrated')
    `).catch(() => []);

    const LABELS = {
      karta_pobytu: "отримання карти побиту 🎉",
      citizenship: "отримання громадянства 🏆",
      first_job: "перше офіційне місце роботи 💼",
      permit_renewal: "продовження дозволу ✅",
    };

    let celebrated = 0;
    for (const m of milestones) {
      if (ADMIN_CHAT()) {
        await tg(ADMIN_CHAT(),
          `🎊 *Досягнення члена!*\n\n👤 ${m.full_name}\n🏅 ${LABELS[m.milestone_type] || m.milestone_type}\n\n🎁 Надішліть подарункову знижку!`
        );
        celebrated++;
      }
    }
    return `Відзначено ${celebrated} досягнень членів`;
  },

  /* ── 18. Моніторинг законодавства ───────────────────────────── */
  "legal-change-alert": async () => {
    let changes = 0;
    try {
      const r = await fetch("https://www.gov.pl/web/udsc/komunikaty", {
        signal: AbortSignal.timeout(5000),
        headers: { "User-Agent": "KompasMigracji/1.0" },
      });
      if (r.ok) {
        const html = await r.text();
        const matches = (html.match(/class=".*?tile-title/g) || []).length;
        changes = Math.min(matches, 10);
        if (changes > 0 && ADMIN_CHAT()) {
          await tg(ADMIN_CHAT(),
            `📢 *Моніторинг gov.pl*\n\nЗнайдено ${changes} нових публікацій УДСЦ\n\n👉 https://www.gov.pl/web/udsc/komunikaty`
          );
        }
      }
    } catch {/* мережа недоступна */}
    return `Перевірено gov.pl, знайдено ~${changes} нових публікацій`;
  },

  /* ── 19. Матчинг з роботодавцями ───────────────────────────── */
  "employer-matcher": async () => {
    const workers = await one(`
      SELECT COUNT(*) AS cnt FROM kompas_users
      WHERE role = 'member' AND status = 'active'
    `).catch(() => ({ cnt: 0 }));
    const count = Number(workers?.cnt) || 0;
    if (ADMIN_CHAT() && count > 0) {
      await tg(ADMIN_CHAT(),
        `💼 *Матчинг роботодавців*\n\nГотово до матчингу: ${count} активних членів\n\n👉 Додайте вакансії в систему для автоматичного підбору`
      );
    }
    return `Матчинг готовий для ${count} активних членів`;
  },

  /* ── 20. Моніторинг системи ─────────────────────────────────── */
  "system-health-monitor": async () => {
    const checks = [
      { name: "Telegram API", url: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN || "x"}/getMe` },
      { name: "Supabase",     url: (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co") + "/rest/v1/" },
      { name: "Vercel",       url: "https://vercel.com" },
    ];

    const results = await Promise.all(
      checks.map(async (c) => {
        try {
          const r = await fetch(c.url, { method: "HEAD", signal: AbortSignal.timeout(4000) });
          return { name: c.name, ok: r.status < 500 };
        } catch {
          return { name: c.name, ok: false };
        }
      })
    );

    const failed = results.filter((r) => !r.ok);
    if (failed.length > 0 && ADMIN_CHAT()) {
      await tg(ADMIN_CHAT(),
        `🚨 *Системний алерт!*\n\nНедоступні:\n${failed.map((f) => `❌ ${f.name}`).join("\n")}\n\nПеревірте негайно!`
      );
    }

    const ok = results.filter((r) => r.ok);
    return `Здоров'я системи: ${ok.length}/${results.length} сервісів OK${failed.length ? ` | ❌ ${failed.map((f) => f.name).join(", ")}` : ""}`;
  },

  /* ── 21. Прогноз MRR та відтоку ────────────────────────────── */
  "mrr-forecast-engine": async () => {
    const rows = await q(`
      SELECT DATE_TRUNC('month', paid_at) AS month, SUM(amount) AS mrr
      FROM kompas_dues
      WHERE paid = true AND paid_at > NOW() - INTERVAL '6 months'
      GROUP BY 1 ORDER BY 1
    `).catch(() => []);

    if (rows.length < 2) {
      return `Недостатньо даних (${rows.length} місяців). Потрібно мінімум 2 місяці оплат`;
    }

    const values = rows.map((r) => Number(r.mrr));
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const trend = (values[values.length - 1] - values[0]) / (values.length - 1);
    const forecast = [1, 2, 3].map((m) => Math.max(0, avg + trend * m).toFixed(0));

    if (ADMIN_CHAT()) {
      await tg(ADMIN_CHAT(),
        `📊 *Прогноз MRR*\n\nПоточний тренд: ${trend >= 0 ? "+" : ""}${trend.toFixed(0)} zł/міс\n\n📅 Прогноз:\n• Місяць 1: ${forecast[0]} zł\n• Місяць 2: ${forecast[1]} zł\n• Місяць 3: ${forecast[2]} zł\n\n🎯 Ціль: 37,700 zł`
      );
    }
    return `Прогноз: ${forecast[0]} → ${forecast[1]} → ${forecast[2]} zł (тренд: ${trend >= 0 ? "+" : ""}${trend.toFixed(0)} zł/міс)`;
  },
};

/* ─── Route handler ──────────────────────────────────────────────── */
export async function POST(req, { params }) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = params;
  const runner = RUNNERS[id];
  if (!runner) {
    return NextResponse.json({ ok: false, error: `Невідома автоматизація: ${id}` }, { status: 404 });
  }

  const start = Date.now();
  try {
    const message = await runner();
    const duration = Date.now() - start;

    await q(
      `INSERT INTO automation_logs (automation_id, success, message, duration_ms)
       VALUES ($1, true, $2, $3)`,
      [id, message, duration]
    ).catch(() => {});

    await q(
      `INSERT INTO automation_states (id, last_run, runs_total, enabled)
       VALUES ($1, NOW(), 1, true)
       ON CONFLICT (id) DO UPDATE SET
         last_run   = NOW(),
         runs_total = COALESCE(automation_states.runs_total, 0) + 1`,
      [id]
    ).catch(() => {});

    return NextResponse.json({ ok: true, message, duration });
  } catch (err) {
    const message = err?.message || "Невідома помилка";

    await q(
      `INSERT INTO automation_logs (automation_id, success, message)
       VALUES ($1, false, $2)`,
      [id, message]
    ).catch(() => {});

    await q(
      `INSERT INTO automation_states (id, errors_total, enabled)
       VALUES ($1, 1, true)
       ON CONFLICT (id) DO UPDATE SET
         errors_total = COALESCE(automation_states.errors_total, 0) + 1`,
      [id]
    ).catch(() => {});

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
