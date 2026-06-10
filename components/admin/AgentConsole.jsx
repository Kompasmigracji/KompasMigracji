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
