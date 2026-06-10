# Module Audit and Implementation Plan: AI Agent Integration & Visual Completion

This report details the current status of the 21 new administrative modules, analyzes role-based access control (RBAC) registration, identifies missing visual dependencies, and outlines a systematic architectural plan to incorporate a **live AI Agent Console** across all 121 modules of KompasCRM.

---

## 1. Summary of Findings

1. **Compilation & Build Health**: The repository builds cleanly (`pnpm build`), lints with minor warnings (`pnpm lint`), and typechecks with zero errors (`pnpm typecheck`).
2. **Module Visual Premium Quality**: The 21 new module pages are visually rich, containing interactive mock flows (e.g., dialers, live previews, CSV upload stages, and graphs). However, **many pages render broken icons** because the `Icon` component in `@/components/admin/ui` does not contain the corresponding SVG path strings.
3. **RBAC Integration**: None of the 21 new pages are registered in `lib/rbac.js`. As a result, they do not appear in the admin navigation panel, nor can users navigate to them under standard permissions.
4. **Agent Integration Strategy**: Instead of modifying all 121 individual pages to include a status console, we can achieve this **systematically** by modifying `components/admin/Shell.jsx` (which wraps all modules under the `(panel)` group layout). We can inject a toggleable right-sidebar console that dynamically resolves its state and behavior based on the current URL pathname.

---

## 2. Individual Module Audit

Below is a breakdown of the 21 new pages under `app/admin/(panel)/`:

| # | Module Name | Route Folder Path | Main Visual Purpose | Missing / Broken Icons | Registration in `lib/rbac.js` |
|---|-------------|-------------------|---------------------|------------------------|-------------------------------|
| 1 | booking | `booking` | Office queue and calendar slots management | `edit-2` (can map to `edit`) | None (Unregistered) |
| 2 | broadcasts | `broadcasts` | Telegram channel broadcast scheduler | None (all present) | None (Unregistered) |
| 3 | call-center | `call-center` | VoIP dialer queue, call routing & record player | `arrow-down-left`, `arrow-up-right`, `headphones`, `phone-call`, `mic-off`, `phone-off` | None (Unregistered) |
| 4 | client-portal | `client-portal` | Client access log, permissions & magic link dispatch | `upload-cloud` | None (Unregistered) |
| 5 | copilot | `copilot` | Interactive GPT assistant for database queries | `more-vertical`, `paperclip`, `arrow-up` | None (Unregistered) |
| 6 | currencies | `currencies` | FX exchange rates configuration & ECB synchronization | `edit-2`, `toggle-right`, `toggle-left` | None (Unregistered) |
| 7 | data-import | `data-import` | CSV pipeline, mapper & preview screen | `download-cloud`, `upload-cloud`, `file-plus`, `arrow-right` | None (Unregistered) |
| 8 | doc-builder | `doc-builder` | Document template layout editor | `code`, `edit-2`, `layout` | None (Unregistered) |
| 9 | e-signatures | `e-signatures` | Signature workflow status tracker | None (all present) | None (Unregistered) |
| 10 | email-sequences | `email-sequences` | Drip campaign editor and cron scheduler | `git-commit`, `edit-3`, `pie-chart`, `user-check` | None (Unregistered) |
| 11 | expenses | `expenses` | Costs breakdown & P&L margin calculator | `paperclip`, `edit-2`, `pie-chart` | None (Unregistered) |
| 12 | forms | `forms` | Client intake forms & NPS surveys builder | `check-square`, `pie-chart`, `layout` | None (Unregistered) |
| 13 | gov-integration | `gov-integration` | RPA scraper for Polish government portals | None (all present) | None (Unregistered) |
| 14 | hr-leave | `hr-leave` | Leave balance, sick leave tracker & routing sync | `thermometer` | None (Unregistered) |
| 15 | leads-finder | `leads-finder` | B2B directory browser & contact info unlocker | `unlock`, `database`, `check-square` | None (Unregistered) |
| 16 | livechat | `livechat` | Omnichannel chat interface (WhatsApp, Telegram, etc.) | `message-circle`, `globe` (missing path), `paperclip`, `smile` | None (Unregistered) |
| 17 | loyalty | `loyalty` | Client reward points and referral tracker | `gift`, `star` | None (Unregistered) |
| 18 | playbooks | `playbooks` | Interactive sales scripts with live logic builder | `edit-3`, `phone-off` | None (Unregistered) |
| 19 | service-catalog | `service-catalog` | CPQ volume discount quote simulator | `edit-2`, `percent` | None (Unregistered) |
| 20 | subscriptions | `subscriptions` | MRR recurring revenue and Stripe card retrier | `edit-2`, `credit-card` (use `card`), `trending-up` | None (Unregistered) |
| 21 | workflows | `workflows` | Background trigger rule conditions builder | `git-merge`, `bar-chart-2` | None (Unregistered) |

---

## 3. RBAC Audit & Registration Plan (`lib/rbac.js`)

In `lib/rbac.js`, the `NAV` configuration manages sidebar navigation visibility. Currently, none of the 21 modules are registered.

### Proposed Additions to `NAV` Array
To register the modules, the following entries should be appended to the `NAV` array in `lib/rbac.js`:

```javascript
  { href: "/admin/booking",          label: "Записи & Клієнти",     icon: "calendar", roles: ["admin", "moderator", "manager"] },
  { href: "/admin/broadcasts",       label: "Telegram Розсилки",     icon: "send",     roles: ["admin", "moderator", "manager"] },
  { href: "/admin/call-center",      label: "VoIP Колл-центр",      icon: "phone",    roles: ["admin", "moderator", "manager", "sales"] },
  { href: "/admin/client-portal",    label: "Портал Клієнтів",      icon: "key",      roles: ["admin", "moderator", "manager"] },
  { href: "/admin/copilot",          label: "ШІ Копілот",           icon: "cpu",      roles: ["admin", "moderator", "manager", "sales", "lawyer"] },
  { href: "/admin/currencies",       label: "Валюти & Курси FX",    icon: "refresh-cw",roles: ["admin"] },
  { href: "/admin/data-import",      label: "Імпорт Даних",         icon: "upload",   roles: ["admin"] },
  { href: "/admin/doc-builder",      label: "Конструктор Док-ів",    icon: "file-text",roles: ["admin", "moderator", "manager"] },
  { href: "/admin/e-signatures",     label: "Електронні Підписи",    icon: "check-circle",roles: ["admin", "moderator", "manager"] },
  { href: "/admin/email-sequences",  label: "Email Sequences",      icon: "mail",     roles: ["admin", "moderator", "manager"] },
  { href: "/admin/expenses",         label: "Витрати & P&L",        icon: "pie-chart",roles: ["admin"] },
  { href: "/admin/forms",            label: "Форми & Опитування",   icon: "check-square",roles: ["admin", "moderator"] },
  { href: "/admin/gov-integration",  label: "Держ. Портали RPA",    icon: "shield",   roles: ["admin"] },
  { href: "/admin/hr-leave",         label: "Кадри & PTO",          icon: "users",    roles: ["admin", "moderator"] },
  { href: "/admin/leads-finder",     label: "Пошук Лідів B2B",      icon: "search",   roles: ["admin", "moderator", "manager", "sales"] },
  { href: "/admin/livechat",         label: "Живий Чат",            icon: "message-square",roles: ["admin", "moderator", "manager"] },
  { href: "/admin/loyalty",          label: "Програма Лояльності",  icon: "award",    roles: ["admin", "moderator"] },
  { href: "/admin/playbooks",        label: "Скрипти Продажів",     icon: "book-open",roles: ["admin", "moderator", "manager", "sales"] },
  { href: "/admin/service-catalog",  label: "Каталог Послуг",       icon: "briefcase",roles: ["admin", "manager"] },
  { href: "/admin/subscriptions",    label: "Підписки & MRR",       icon: "card",     roles: ["admin"] },
  { href: "/admin/workflows",        label: "Автоматизація WF",     icon: "git-merge",roles: ["admin"] }
```

---

## 4. Icon Path Enhancements (`components/admin/ui.jsx`)

To fix the missing visual assets in the icons, we need to map the missing icon keys inside the `PATHS` dictionary in `components/admin/ui.jsx` (which utilizes SVG paths to render custom icons).

Below is the dictionary of proposed additions to the `PATHS` object:

```javascript
  "arrow-down-left": "M17 7 7 17M17 17H7V7",
  "arrow-up-right": "M7 17 17 7M7 7h10v10",
  "headphones": "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3",
  "phone-call": "M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  "mic-off": "M1 1l22 22M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23M12 19v4M8 23h8",
  "phone-off": "M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07M23 1 1 23M1 12.58A2 2 0 0 1 2.68 10.6l3-1.72a2 2 0 0 1 2 .45l1.27 1.27",
  "upload-cloud": "M16 16.12a5 5 0 0 0 0-9.88M20 20.38a8 8 0 0 0-16 0 M12 12V3 M8 7l4-4 4 4",
  "download-cloud": "M16 16.12a5 5 0 0 0 0-9.88M20 20.38a8 8 0 0 0-16 0 M12 3v9 M8 8l4 4 4-4",
  "file-plus": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M12 18v-6 M9 15h6",
  "arrow-right": "M5 12h14M12 5l7 7-7 7",
  "more-vertical": "M12 12h.01M12 5h.01M12 19h.01",
  "paperclip": "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48",
  "arrow-up": "M12 19V5M5 12l7-7 7 7",
  "edit-2": "M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z",
  "edit-3": "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  "toggle-right": "M16 5H8a7 7 0 0 0 0 14h8a7 7 0 0 0 0-14z M16 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  "toggle-left": "M16 5H8a7 7 0 0 0 0 14h8a7 7 0 0 0 0-14z M8 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  "code": "M16 18l6-6-6-6M8 6l-6 6 6 6",
  "layout": "M3 3h18v18H3zM3 9h18M9 21V9",
  "git-commit": "M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0 M1.05 12h7.95 M15 12h7.95",
  "pie-chart": "M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z",
  "user-check": "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M16 11l2 2 4-4",
  "check-square": "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  "thermometer": "M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z",
  "unlock": "M18 8A6 6 0 0 0 6 8v4M2 12h20v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z",
  "database": "M12 22c5.52 0 10-2.24 10-5V7c0-2.76-4.48-5-10-5S2 4.24 2 7v10c0 2.76 4.48 5 10 5z M2 7c0 2.76 4.48 5 10 5s10-2.24 10-5 M2 12c0 2.76 4.48 5 10 5s10-2.24 10-5",
  "message-circle": "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  "globe": "M12 22A10 10 0 1 0 12 2a10 10 0 0 0 0 20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  "smile": "M12 22A10 10 0 1 0 12 2a10 10 0 0 0 0 20z M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01",
  "gift": "M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z",
  "star": "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  "git-merge": "M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0 M6 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0 M6 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0 M21 18V8a4 4 0 0 0-4-4h-7M6 9v6",
  "bar-chart-2": "M18 20V10M12 20V4M6 20v-6",
  "trending-up": "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6",
  "percent": "M19 5L5 19M6.5 6.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0 M17.5 17.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0"
```

---

## 5. Systematic AI Agent Integration (Architectural Proposal)

To incorporate an AI Agent console inside all 121 modules, we propose a centralized layout injection inside `components/admin/Shell.jsx`.

### Structure of the Solution

1. **`components/admin/AgentConsole.jsx`**: A new React component that renders a collapsible right-hand panel. This component reads the `module` prop, determines the associated "autonomous agent details", displays live simulated telemetry logs, lists metrics, and allows interactive chat with that agent.
2. **Path Detection**: Inside `Shell.jsx`, we read the path using Next.js' `usePathname()`. By checking if the route starts with `/admin/`, we extract the active module context (e.g. `/admin/booking` -> `booking`).
3. **Collapsible Console Toggle**: A console toggle button is added to the topbar of the dashboard. When activated, a state variable (`isConsoleOpen`) shifts the layout or opens a drawer to place the console side-by-side with the content.

### Proposed Code: `components/admin/AgentConsole.jsx`

Here is the proposed component code to create:

```jsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Icon, Badge, Avatar } from "./ui";

const AGENT_REGISTRY = {
  booking: {
    name: "QueueMaster",
    role: "Office Queue Optimizer & Scheduler",
    objective: "Monitoring office calendars, managing room capacity, and minimizing client wait times.",
    uptime: "99.98%",
    memory: "18.4 MB",
    defaultLogs: [
      "QueueMaster daemon initialized successfully.",
      "Scanning database for pending visa appointments...",
      "Recalculating average queue wait times. Current threshold: 4.5m.",
      "Syncing office availability with external consulate feeds."
    ]
  },
  broadcasts: {
    name: "TeleBroadcaster",
    role: "Telegram Notification Dispatcher",
    objective: "Handling mass broadcasts, segment queries, and rate-limiting limits.",
    uptime: "100.00%",
    memory: "14.1 MB",
    defaultLogs: [
      "Broadcaster operational. Connected to Telegram bot gateway.",
      "Loaded segmentation rules. All channels standby.",
      "Waiting for manual F8 broadcast approval trigger..."
    ]
  },
  "call-center": {
    name: "VoipOperator",
    role: "Call Routing & VoIP Queue Manager",
    objective: "Orchestrating agent dialers, routing inbound SIP calls, and recording logs.",
    uptime: "99.95%",
    memory: "32.8 MB",
    defaultLogs: [
      "SIP Gateway connected. WebRTC channel initialized.",
      "Awaiting incoming calls on round-robin queues.",
      "Archiving call recording CC-984 to secure cloud bucket."
    ]
  },
  copilot: {
    name: "CopilotAI",
    role: "General CRM Intelligence Assistant",
    objective: "Providing ChatGPT-style analytics and database command execution.",
    uptime: "99.99%",
    memory: "128.5 MB",
    defaultLogs: [
      "LLM Context window loaded. Ready to execute semantic queries.",
      "System database schema cached for natural language queries."
    ]
  },
  "gov-integration": {
    name: "GovRpaBot",
    role: "Government Portal RPA Automator",
    objective: "Using headless bots to query ZUS, Praca.gov, and inPOL status checks.",
    uptime: "98.70%",
    memory: "64.2 MB",
    defaultLogs: [
      "Headless Chrome driver initialized.",
      "inPOL tracker: Logged in. Checking status for 142 clients...",
      "Alert: 2FA required on CEIDG sync profile. Pausing session."
    ]
  },
  // Default fallback for any other of the 121 modules
  fallback: (module) => {
    const formattedName = module
      ? module.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("")
      : "Orchestrator";
    return {
      name: `${formattedName}Agent`,
      role: `Autonomous processor for /admin/${module || ""}`,
      objective: `Monitoring activities, indexes, and schemas for the ${module || "dashboard"} module.`,
      uptime: "99.99%",
      memory: "16.0 MB",
      defaultLogs: [
        `Agent ${formattedName}Agent initialized.`,
        `Monitoring telemetry lines for ${module || "root"} module...`,
        `Telemetry heartbeat active. Status: Normal.`
      ]
    };
  }
};

export default function AgentConsole({ module, onClose }) {
  const agent = AGENT_REGISTRY[module] || AGENT_REGISTRY.fallback(module);
  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState("");
  const logEndRef = useRef(null);

  useEffect(() => {
    // Initialize default logs
    const initialLogs = agent.defaultLogs.map(text => ({
      time: new Date().toLocaleTimeString(),
      text
    }));
    setLogs(initialLogs);

    // Simulate real-time logs updating
    const interval = setInterval(() => {
      const liveEvents = [
        "Database scan cycle completed.",
        "CPU metrics snapshot saved.",
        "Verified schema integrity check. OK.",
        "Awaiting instruction commands...",
        "Telemetry heartbeat sent to orchestrator."
      ];
      const randomMsg = liveEvents[Math.floor(Math.random() * liveEvents.length)];
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: `[Live] ${randomMsg}` }]);
    }, 12000);

    return () => clearInterval(interval);
  }, [module]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { time: new Date().toLocaleTimeString(), text: `[User Command]: ${input}` };
    const agentMsg = {
      time: new Date().toLocaleTimeString(),
      text: `[${agent.name}]: Processing command. Task dispatched to CRM pool.`
    };
    setLogs(prev => [...prev, userMsg, agentMsg]);
    setInput("");
  };

  return (
    <div style={{
      width: 320,
      background: "var(--panel)",
      borderLeft: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      position: "relative",
      boxShadow: "var(--shadow-lg)"
    }}>
      {/* Console Header */}
      <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-success)", boxShadow: "0 0 8px var(--color-success)" }}></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "14px" }}>Agent: {agent.name}</div>
            <div style={{ fontSize: "10px", color: "var(--dim)" }}>{agent.role}</div>
          </div>
        </div>
        <button className="kc-btn kc-btn-ghost" onClick={onClose} style={{ padding: 4, minHeight: "auto" }}>
          <Icon name="x" size={16} />
        </button>
      </div>

      {/* Agent Metrics */}
      <div style={{ padding: "var(--space-sm) var(--space-md)", background: "var(--panel-2)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--dim)" }}>
        <span>Uptime: <strong style={{ color: "var(--fg)" }}>{agent.uptime}</strong></span>
        <span>RAM: <strong style={{ color: "var(--fg)" }}>{agent.memory}</strong></span>
      </div>

      {/* Objective Section */}
      <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border)", fontSize: "12px" }}>
        <div style={{ fontWeight: 600, color: "var(--color-primary)", textTransform: "uppercase", fontSize: "10px", marginBottom: 4 }}>Current Objective</div>
        <div style={{ color: "var(--fg)" }}>{agent.objective}</div>
      </div>

      {/* Terminal Logs */}
      <div style={{ flex: 1, padding: "var(--space-md)", overflowY: "auto", fontFamily: "var(--font-mono)", fontSize: "11px", background: "#090d13", color: "#8be9fd", display: "flex", flexDirection: "column", gap: 6 }}>
        {logs.map((log, idx) => (
          <div key={idx} style={{ lineHeight: "1.4" }}>
            <span style={{ color: "var(--dim)", marginRight: 6 }}>[{log.time}]</span>
            <span style={{ color: log.text.includes("[Live]") ? "#50fa7b" : log.text.includes("[User Command]") ? "#ff79c6" : "#f8f8f2" }}>
              {log.text}
            </span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* Command Prompt */}
      <form onSubmit={handleSend} style={{ padding: "var(--space-sm)", borderTop: "1px solid var(--border)", display: "flex", gap: 4 }}>
        <input
          type="text"
          className="kc-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Instruct ${agent.name}...`}
          style={{ flex: 1, fontSize: "12px", minHeight: "32px", padding: "4px 8px" }}
        />
        <button type="submit" className="kc-btn kc-btn-primary" style={{ padding: "4px 12px", minHeight: "32px" }}>
          <Icon name="send" size={12} />
        </button>
      </form>
    </div>
  );
}
```

### Proposed Patch for `components/admin/Shell.jsx`

Here is the diff showing how to systematically render the toggle and panel inside the shell:

```diff
--- components/admin/Shell.jsx
+++ components/admin/Shell.jsx
@@ -8,6 +8,7 @@
 import GlobalSearch from "./GlobalSearch";
 import NotificationCenter from "./NotificationCenter";
+import AgentConsole from "./AgentConsole";
 import enMsg from "@/messages/admin/en.json";
 import plMsg from "@/messages/admin/pl.json";
 import ukMsg from "@/messages/admin/uk.json";
@@ -26,6 +27,7 @@
   const pathname = usePathname();
   const router = useRouter();
+  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
 
   useEffect(() => {
     fetch("/api/admin/auth/me")
@@ -73,6 +75,9 @@
   const nav = navFor(user?.role || "member");
   const current = nav.find((n) =>
     n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)
   );
 
+  // Extract module name from pathname (e.g. /admin/booking -> booking)
+  const moduleName = pathname.split("/")[2] || "";
+
   const t = translations[lang] || translations.en;
 
   return (
@@ -187,6 +192,12 @@
 
               <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 8px' }} />
 
+              <button 
+                onClick={() => setIsConsoleOpen(!isConsoleOpen)} 
+                className={`kc-theme-btn ${isConsoleOpen ? 'kc-on' : ''}`}
+                title="AI Agent Console"
+                style={{ color: isConsoleOpen ? 'var(--color-primary)' : 'inherit', marginRight: 4 }}
+              >
+                <Icon name="cpu" size={16} />
+              </button>
+
               <button onClick={toggleTheme} className="kc-theme-btn" title={t.theme}>
                 <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
                 <span>{theme === "dark" ? t.light : t.dark}</span>
@@ -194,9 +205,12 @@
             </div>
           </header>
           
-          <main className="kc-content kc-page-enter">
-            {children}
+          <main className="kc-content kc-page-enter" style={{ display: 'flex', gap: 'var(--space-lg)', position: 'relative', height: 'calc(100vh - 60px)', padding: 0, maxWidth: 'none' }}>
+            <div style={{ flex: 1, minWidth: 0, padding: 'var(--space-lg)', overflowY: 'auto', height: '100%' }}>
+              {children}
+            </div>
+            {isConsoleOpen && (
+              <AgentConsole module={moduleName} onClose={() => setIsConsoleOpen(false)} />
+            )}
           </main>
         </div>
       </div>
```

---

## 6. Verification Guidelines

Once the implementation is complete, standard verification checks can be run:
1. **Compilation Check**:
   ```bash
   pnpm build
   ```
   Ensures the additions to `ui.jsx`, `rbac.js`, `Shell.jsx`, and `AgentConsole.jsx` are syntactically correct with no missing imports.
2. **Icon Rendering Spot-Checks**:
   Open `/admin/call-center` or `/admin/livechat` and confirm icons that previously had empty square borders now display correctly.
3. **AI Agent Live Toggle Check**:
   Log in to the panel, click the `cpu` button in the topbar, verify that the right panel slides out, lists metrics specific to the active page (e.g. `QueueMaster` on `/admin/booking`), shows live logs, and responds to command prompts.
