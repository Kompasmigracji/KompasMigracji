"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Icon, Badge, Avatar } from "./ui";

const AGENT_REGISTRY = {
  "": {
    name: "CoreOrchestrator",
    role: "System-Wide Operations Orchestrator",
    objective: "Monitoring all sub-agent telemetry loops, workspace hygiene, and scheduling tasks.",
    uptime: "99.99%",
    memory: "42.5 MB",
    defaultLogs: [
      "CoreOrchestrator initialized.",
      "Heartbeats from 53 modules active.",
      "System check: Clean. No anomalies.",
      "Workspace cleanliness verification check: PASS."
    ]
  },
  members: {
    name: "UnionSentinel",
    role: "Union Membership Database Auditor",
    objective: "Scanning membership records, tracking dues, auto-cleaning duplicate profiles.",
    uptime: "99.98%",
    memory: "22.4 MB",
    defaultLogs: [
      "Union membership tables monitored.",
      "Scan results: 1,240 records clean.",
      "Subscriptions linked.",
      "Daily cleanup: removed 0 inactive duplicates."
    ]
  },
  leads: {
    name: "LeadNurturer",
    role: "Sales Pipeline & Conversion Agent",
    objective: "Allocating lead owners, scanning lead freshness, scoring deals, and tracking status.",
    uptime: "99.95%",
    memory: "19.1 MB",
    defaultLogs: [
      "Lead pool checked.",
      "Flagged 3 stale leads for manual review.",
      "Webhook listener online.",
      "Checking leads distribution fairness index: 100%."
    ]
  },
  deals: {
    name: "DealCloser",
    role: "Deals & Pipeline Bottleneck Detector",
    objective: "Tracking deal values, predicting closure probability, and highlighting inactive deals.",
    uptime: "99.97%",
    memory: "20.8 MB",
    defaultLogs: [
      "Deal stage progression logs loaded.",
      "Active deals value: $450k.",
      "Bot alerts configured.",
      "Suggested feature: Deal velocity metric calculation added."
    ]
  },
  cases: {
    name: "CaseManager",
    role: "Client Case & Legal Process Assistant",
    objective: "Monitoring case files, tracking deadline compliance, checking document uploads.",
    uptime: "99.96%",
    memory: "25.2 MB",
    defaultLogs: [
      "Case manager online.",
      "Verified file completeness for active immigration cases.",
      "Checking case status sync pipeline...",
      "Cleanliness check: All database indexes verified."
    ]
  },
  reports: {
    name: "InsightAnalyzer",
    role: "Real-time KPI & Charts Generator",
    objective: "Generating custom BI reports, auditing system database query times, and cleaning log tables.",
    uptime: "99.92%",
    memory: "48.1 MB",
    defaultLogs: [
      "BI reports daemon operational.",
      "Chart components reloaded.",
      "Cache invalidation cycle: OK.",
      "Daily insight recommendation generated."
    ]
  },
  emails: {
    name: "MailFlow",
    role: "Smart Inbox Auditor & Deliverability Guard",
    objective: "Monitoring inbound email queues, evaluating spam scores, and preparing AI reply templates.",
    uptime: "100.00%",
    memory: "31.4 MB",
    defaultLogs: [
      "Mail queue checked.",
      "Spam threshold safe (0.01%).",
      "Smart drafts loaded.",
      "Syncing IMAP/SMTP mail server tunnels."
    ]
  },
  "work-permits": {
    name: "PermitAssure",
    role: "Polish Work Permit Compliance Tracker",
    objective: "Checking permit expirations, verifying Urząd Wojewódzki decision logs, and issuing renewal warnings.",
    uptime: "99.85%",
    memory: "17.6 MB",
    defaultLogs: [
      "Cross-checking 124 active work permits.",
      "Highlighted 4 profiles near expiration (30 days remaining).",
      "Triggered client notification drip queue."
    ]
  },
  appointments: {
    name: "CalSync",
    role: "Office Appointments & Room Capacity Planner",
    objective: "Preventing slot booking conflicts, routing customer reminders, and scheduling calendar checks.",
    uptime: "99.98%",
    memory: "18.9 MB",
    defaultLogs: [
      "Synced office calendar loops.",
      "Removed 2 expired holds.",
      "Awaiting next customer check-in.",
      "Double booking verification algorithm: OK."
    ]
  },
  contracts: {
    name: "DocuSigner",
    role: "Contract Template Clause Auditor",
    objective: "Scanning dynamic placeholders, verifying sign states, and checking document schema safety.",
    uptime: "99.99%",
    memory: "21.2 MB",
    defaultLogs: [
      "Contract engine ready.",
      "Checked 15 document templates.",
      "All variable signatures verified.",
      "Security integrity scan for PDF exports: PASS."
    ]
  },
  litigation: {
    name: "JusticeBot",
    role: "Appeals & Court Courtroom Tracker",
    objective: "Monitoring appeal deadlines, parsing court files, and tracking attorney notes.",
    uptime: "99.90%",
    memory: "23.5 MB",
    defaultLogs: [
      "Court dates sync completed.",
      "Standardizing appeal templates.",
      "Checked court calendar entries.",
      "Legal citation helper active."
    ]
  },
  insurance: {
    name: "ZusGuard",
    role: "Insurance Status & ZUS Declaration Inspector",
    objective: "Checking ZUS payment registration, auditing insurance forms, and ensuring local policy compliance.",
    uptime: "99.75%",
    memory: "19.8 MB",
    defaultLogs: [
      "Auditing monthly ZUS reports.",
      "Compliance index: 100%.",
      "All filings confirmed for Warsaw office.",
      "Systematic data sanitization complete."
    ]
  },
  housing: {
    name: "HostelHost",
    role: "Hostel Occupancy & Lease Compliance Agent",
    objective: "Tracking bed occupancy, planning room maintenance schedules, and auditing lease paperwork.",
    uptime: "99.91%",
    memory: "16.7 MB",
    defaultLogs: [
      "Warsaw & Krakow hostel logs updated.",
      "Occupancy level: 89%.",
      "Cleaning checklist verified.",
      "Utility expense tracker synced."
    ]
  },
  fleet: {
    name: "LogiRoute",
    role: "Logistics & Vehicle Maintenance Dispatcher",
    objective: "Optimizing driver schedules, mapping route logs, and verifying fuel expense receipts.",
    uptime: "99.88%",
    memory: "20.1 MB",
    defaultLogs: [
      "Fleet GPS trackers reporting.",
      "Mileage tables updated.",
      "Checked next service intervals.",
      "Auto-cleanup of unused geo-paths."
    ]
  },
  mailroom: {
    name: "VirtualPost",
    role: "Virtual Office Post Digitization Auditor",
    objective: "Sorting scanned letters, uploading PDF attachments, and notifying business clients.",
    uptime: "99.99%",
    memory: "24.0 MB",
    defaultLogs: [
      "Scanning mailbox directories.",
      "OCR processing active.",
      "Successfully uploaded 3 envelopes.",
      "Archiving legacy scans to secure vault."
    ]
  },
  academy: {
    name: "LmsPilot",
    role: "LMS Learning & Academy Progress Guard",
    objective: "Monitoring course completions, grading quiz entries, and issuing student certificates.",
    uptime: "99.96%",
    memory: "18.2 MB",
    defaultLogs: [
      "Checked training modules.",
      "Student progress metrics updated.",
      "5 certificates generated.",
      "Suggested training feedback loop added."
    ]
  },
  messengers: {
    name: "OmniChatBot",
    role: "Unified Messaging Router",
    objective: "Routing WhatsApp/Viber/Telegram chats to agents and logging customer sentiment.",
    uptime: "100.00%",
    memory: "34.5 MB",
    defaultLogs: [
      "Omnichannel listener active.",
      "Active chats queued.",
      "Transcripts exported.",
      "Optimizing chat routing delay metrics."
    ]
  },
  "e-invoicing": {
    name: "KsefConnector",
    role: "Ministry of Finance KSeF API Sync Agent",
    objective: "Validating invoice XML structures, checking transaction numbers, and synchronizing billing records.",
    uptime: "99.80%",
    memory: "28.6 MB",
    defaultLogs: [
      "Connected to KSeF Sandbox.",
      "Checked 12 dynamic invoices.",
      "XML validation schema: Correct.",
      "Automatic ledger sync complete."
    ]
  },
  "ocr-scanner": {
    name: "OcrProcessor",
    role: "Passport & ID Document OCR Parser",
    objective: "Running image preprocessing, stripping background noise, and validating parsed fields.",
    uptime: "99.95%",
    memory: "55.0 MB",
    defaultLogs: [
      "Parser engine loaded.",
      "Scanned passport documents.",
      "Average recognition rate: 98.7%.",
      "Noise filters calibrated."
    ]
  },
  "partner-portal": {
    name: "B2BPartner",
    role: "B2B Affiliate & Partner Log Coordinator",
    objective: "Verifying agent contracts, matching affiliate balances, and tracking referrals.",
    uptime: "99.98%",
    memory: "21.5 MB",
    defaultLogs: [
      "Partner panel credentials checked.",
      "Computed monthly referral payouts.",
      "Clean files verified.",
      "Affiliate API validation passed."
    ]
  },
  referrals: {
    name: "ReferralBoost",
    role: "Referral Rewards & Commission Calculator",
    objective: "Verifying referral link logs, tracking cookies, and generating reward payouts.",
    uptime: "99.97%",
    memory: "18.3 MB",
    defaultLogs: [
      "Referral code tracking loop online.",
      "Commission transactions logged.",
      "All audits: Pass.",
      "Referral bonus metrics synchronized."
    ]
  },
  gamification: {
    name: "QuestGiver",
    role: "Team KPI Gamification Master",
    objective: "Updating sales leaderboards, assigning team achievement badges, and preparing daily tasks.",
    uptime: "99.99%",
    memory: "19.2 MB",
    defaultLogs: [
      "Leaderboard calculated.",
      "2 achievements unlocked today.",
      "Proposing daily member challenge.",
      "Quest rewards updated."
    ]
  },
  "knowledge-base": {
    name: "WikiCustodian",
    role: "Knowledge Base SEO & Indexing Custodian",
    objective: "Scanning database articles for outdated policies, broken links, and tagging entries.",
    uptime: "100.00%",
    memory: "15.8 MB",
    defaultLogs: [
      "Scanned Wiki contents.",
      "Updated tags on 12 legal guides.",
      "Cleanliness checks: 0 warnings.",
      "Optimizing SEO description meta-tags."
    ]
  },
  accounting: {
    name: "LedgerBot",
    role: "Payroll & Bank Reconciliation Auditor",
    objective: "Matching invoice totals, tracking bank transfers, and reconciling ledger variances.",
    uptime: "99.99%",
    memory: "36.1 MB",
    defaultLogs: [
      "Double-entry ledger verified.",
      "Synced payroll tables.",
      "Checked 8 balance statements.",
      "Tax rules validator online."
    ]
  },
  marketing: {
    name: "PromoEngine",
    role: "Marketing Campaign Analytics & Lists Auditor",
    objective: "Auditing ad pixel events, verifying campaign UTM tags, and updating subscriber list.",
    uptime: "99.93%",
    memory: "26.4 MB",
    defaultLogs: [
      "Campaign performance indexes checked.",
      "Email bounce rate: 0.8%.",
      "Clean list triggers active.",
      "New drip cohort defined."
    ]
  },
  integrations: {
    name: "ApiGatekeeper",
    role: "Third-Party API Hook Sentinel",
    objective: "Verifying integrations, testing OAuth token freshness, and alert on webhook failures.",
    uptime: "99.99%",
    memory: "22.8 MB",
    defaultLogs: [
      "API status check complete.",
      "Google Drive, Twilio, and Stripe API keys: Operational.",
      "Cleaned stale connection logs."
    ]
  },
  "custom-fields": {
    name: "SchemaBuilder",
    role: "Custom Schema Metadata Architect",
    objective: "Validating field indexing, preventing column bloat, and checking system performance.",
    uptime: "100.00%",
    memory: "14.5 MB",
    defaultLogs: [
      "Database metadata scanned.",
      "24 custom fields indexed.",
      "No unused schema blocks found.",
      "Type casting sanity audit complete."
    ]
  },
  "api-hub": {
    name: "WebhookRouter",
    role: "Enterprise API Hub & Webhooks Router",
    objective: "Monitoring outgoing events, tracking webhook payloads, and retry queue cleanup.",
    uptime: "99.98%",
    memory: "38.2 MB",
    defaultLogs: [
      "Webhook endpoints listening.",
      "Webhook logs scanned: 1,230 deliveries successful.",
      "Archiving logs from last week."
    ]
  },
  rodo: {
    name: "PrivacyOfficer",
    role: "GDPR Compliance & Anonymization Officer",
    objective: "Tracking user consent records, scrubbing expired personal files, and RODO compliance.",
    uptime: "100.00%",
    memory: "17.4 MB",
    defaultLogs: [
      "Running RODO privacy cleanup script.",
      "Scrubbed 8 old lead profiles.",
      "Consent database OK.",
      "Consent form validations verified."
    ]
  },
  "audit-log": {
    name: "SystemLogAuditor",
    role: "Log Forensic Investigator",
    objective: "Detecting suspicious access patterns, auditing user logs, and packing old files.",
    uptime: "100.00%",
    memory: "32.0 MB",
    defaultLogs: [
      "Security audit logs parsed.",
      "0 anomalies detected.",
      "Checked login trials and system config changes.",
      "Logs compression complete."
    ]
  },
  "mobile-app": {
    name: "AppPushSync",
    role: "Mobile Assets & Push Delivery Controller",
    objective: "Synchronizing layout parameters, verifying push notification pipelines, and clearing device tokens.",
    uptime: "99.94%",
    memory: "21.0 MB",
    defaultLogs: [
      "Push notifications gateway operational.",
      "Syncing mobile API settings.",
      "15 active devices online.",
      "Mobile dashboard dynamic configs verified."
    ]
  },
  monitoring: {
    name: "HealthCheck",
    role: "System Performance & Resource Monitor",
    objective: "Measuring connection count, database performance metrics, and average page rendering speed.",
    uptime: "99.99%",
    memory: "45.8 MB",
    defaultLogs: [
      "CPU usage: 14%, Memory usage: 48%.",
      "Database pool status: Good.",
      "Checking server logs...",
      "Disk I/O latency sweep complete."
    ]
  },
  settings: {
    name: "ConfigGuardian",
    role: "Global Configuration & Backup Sentinel",
    objective: "Ensuring backup cycles run, tracking config state, and cleaning environment variables.",
    uptime: "100.00%",
    memory: "16.2 MB",
    defaultLogs: [
      "Backup sequence completed.",
      "Settings state verified.",
      "System config: Clean.",
      "Environment file permissions: PASS."
    ]
  },
  booking: {
    name: "QueueMaster",
    role: "Office Queue Optimizer & Scheduler",
    objective: "Monitoring office calendars, managing room capacity, and minimizing client wait times.",
    uptime: "99.98%",
    memory: "18.4 MB",
    defaultLogs: [
      "QueueMaster daemon initialized.",
      "Scanning database for pending visa appointments...",
      "Recalculating average queue wait times.",
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
      "Waiting for manual F8 broadcast approval trigger...",
      "Broadcasting lists cleaned."
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
      "Archiving call recording CC-984 to secure cloud bucket.",
      "Call center load balancer online."
    ]
  },
  "client-portal": {
    name: "PortalSecure",
    role: "Client Portal Guard & Secure Room Auditor",
    objective: "Configuring client access tokens, managing document rooms, and scanning portal activities.",
    uptime: "99.97%",
    memory: "23.0 MB",
    defaultLogs: [
      "Portal token vault: Validated.",
      "All clients sandbox environments verified.",
      "Portal accessibility parameters synced.",
      "Checked secure room authorization files: OK."
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
      "System database schema cached for natural language queries.",
      "Agent memory buffer: Fresh."
    ]
  },
  currencies: {
    name: "NbpSync",
    role: "NBP Exchange Rate Syncer",
    objective: "Fetching daily FX rates from Polish National Bank (NBP), updating tables, and tracking currency trends.",
    uptime: "99.96%",
    memory: "15.4 MB",
    defaultLogs: [
      "NBP API request successful.",
      "Updated EUR/PLN, USD/PLN, UAH/PLN exchange rates.",
      "Cross-checking currency buffer logs.",
      "FX margin calculators loaded."
    ]
  },
  "data-import": {
    name: "DataImporter",
    role: "Excel/CSV Schema Mapper",
    objective: "Validating uploaded excel cells, mapping headers, and cleaning database insert batches.",
    uptime: "99.95%",
    memory: "30.2 MB",
    defaultLogs: [
      "Import gateway: Ready. Awaiting CSV uploads.",
      "Cell validation rules compiled.",
      "Database schema checks completed: PASS."
    ]
  },
  "doc-builder": {
    name: "BilingualDocBuilder",
    role: "PL/UA/EN Document Generator",
    objective: "Assembling bilingual templates, validating margins, and auto-exporting PDFs.",
    uptime: "99.97%",
    memory: "32.6 MB",
    defaultLogs: [
      "PDF rendering engine warmed up.",
      "Checking font weights.",
      "Templates cached.",
      "Clean margins checklist: OK."
    ]
  },
  "e-signatures": {
    name: "ESignBroker",
    role: "E-Signature Verification Broker",
    objective: "Issuing signature request tokens, verifying SMS 2FA pins, and tracking document state.",
    uptime: "99.96%",
    memory: "21.0 MB",
    defaultLogs: [
      "Signature server connected.",
      "Waiting for signed callbacks.",
      "Audit logs synced.",
      "2FA verification queue operational."
    ]
  },
  "email-sequences": {
    name: "DripAutomator",
    role: "Email Drip Sequence Engine",
    objective: "Scheduling auto-responder steps, tracking open rates, and optimizing follow-up intervals.",
    uptime: "99.95%",
    memory: "22.5 MB",
    defaultLogs: [
      "Drip queues active.",
      "Processed 12 outreach steps.",
      "Unsubscribe loops verified.",
      "Sequence layout cleanliness score: 100%."
    ]
  },
  expenses: {
    name: "ExpenseAnalyzer",
    role: "Expense & P&L Calculator",
    objective: "Scanning receipt OCR outputs, allocating VAT categories, and recalculating P&L.",
    uptime: "99.94%",
    memory: "24.0 MB",
    defaultLogs: [
      "Invoice ledger loaded.",
      "Checked VAT tax calculations.",
      "Net profit margins updated.",
      "Receipt uploads audit: Clear."
    ]
  },
  forms: {
    name: "FormBuilder",
    role: "Survey & Form Submission Parser",
    objective: "Compiling custom questionnaire forms, sanitizing submissions, and saving fields.",
    uptime: "99.95%",
    memory: "18.0 MB",
    defaultLogs: [
      "Form layouts verified.",
      "Form entries scanned.",
      "Cleaned 0 spam submissions.",
      "Input fields validation active."
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
  "hr-leave": {
    name: "HrLeavePlanner",
    role: "HR Leave & PTO Scheduler",
    objective: "Calculating vacation balances, validating leave requests, and tracking team absence logs.",
    uptime: "99.96%",
    memory: "17.5 MB",
    defaultLogs: [
      "PTO tracker running.",
      "Calculated vacation limits.",
      "Approved 2 leave schedules.",
      "Absence reports compiled."
    ]
  },
  "leads-finder": {
    name: "LeadsScraper",
    role: "B2B Leads Finder Bot",
    objective: "Scraping business registries (REGON, KRS), finding contacts, and importing to Leads list.",
    uptime: "99.94%",
    memory: "35.0 MB",
    defaultLogs: [
      "Registries query active.",
      "Found 15 matching businesses in Warsaw. Importing now.",
      "B2B scraper logs clean."
    ]
  },
  livechat: {
    name: "LiveChatOperator",
    role: "Real-time Chat Queue Router",
    objective: "Managing live customer chats, routing to online agents, and suggesting AI auto-responses.",
    uptime: "99.98%",
    memory: "28.0 MB",
    defaultLogs: [
      "WebSocket chat channel: Standby.",
      "Awaiting incoming customer messages.",
      "Chat queue balanced.",
      "Suggested responses updated."
    ]
  },
  loyalty: {
    name: "LoyaltyCashback",
    role: "Customer Loyalty Reward Engine",
    objective: "Calculating cashback balances, tracking points, and issuing promo reward codes.",
    uptime: "99.96%",
    memory: "16.0 MB",
    defaultLogs: [
      "Loyalty transaction log verified.",
      "4 users rewarded with cashback points.",
      "Loyalty rule settings updated."
    ]
  },
  playbooks: {
    name: "PlaybookInstructor",
    role: "Interactive Sales Playbook Assistant",
    objective: "Displaying sales talk scripts, monitoring speech patterns, and suggesting response handling.",
    uptime: "99.95%",
    memory: "22.5 MB",
    defaultLogs: [
      "Sales playbook directory loaded.",
      "Core templates active.",
      "Suggestions updated.",
      "Objection handling triggers configured."
    ]
  },
  "service-catalog": {
    name: "CatalogCheckout",
    role: "Service Catalog & Price List Manager",
    objective: "Managing service items, updating invoice price lists, and tracking checkout success.",
    uptime: "99.97%",
    memory: "21.0 MB",
    defaultLogs: [
      "Service listing updated.",
      "Validated prices.",
      "System checkout paths verified: OK."
    ]
  },
  subscriptions: {
    name: "SubManager",
    role: "MRR Billing & Subscription Manager",
    objective: "Tracking Stripe subscriptions, managing recurring billing dates, and sending dunning emails.",
    uptime: "99.96%",
    memory: "23.0 MB",
    defaultLogs: [
      "Checked recurring subscription states.",
      "Processed 14 billing checks.",
      "Stripe webhooks validated."
    ]
  },
  workflows: {
    name: "WorkflowIFTTT",
    role: "IFTTT Automation Playbook Executer",
    objective: "Parsing webhook event chains, executing multi-step trigger rules, and logging action outputs.",
    uptime: "99.98%",
    memory: "26.0 MB",
    defaultLogs: [
      "Workflow engine active.",
      "Checked 3 triggered rules.",
      "Trigger status: Success.",
      "Automation queues checked: 0 errors."
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
        `Telemetry heartbeat active. Status: Normal.`,
        `Daily optimization features verified.`
      ]
    };
  }
};

export default function AgentConsole({ module, onClose }) {
  const agent = useMemo(() => {
    return AGENT_REGISTRY[module] || AGENT_REGISTRY.fallback(module);
  }, [module]);
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
  }, [module, agent.name, agent.defaultLogs]); // Include agent.name and agent.defaultLogs to satisfy linting rules

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
