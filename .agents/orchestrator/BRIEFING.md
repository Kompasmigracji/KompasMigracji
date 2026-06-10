# BRIEFING — 2026-06-10T02:40:00+02:00

## Mission
Manage the implementation of 21 new automation engine modules for KompasCRM (R1, R2) and incorporate a live AI Agent helper console / logs in all 121 modules, verifying build completion.

## 🔒 My Identity
- Archetype: teamwork_preview_orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: c:\Users\user\Documents\GitHub\KompasMigracji\.agents\orchestrator
- Original parent: top-level
- Original parent conversation ID: 02025dca-59f8-43ad-b8d4-c54f978d0bc2

## 🔒 My Workflow
- **Pattern**: Project Pattern
- **Scope document**: c:\Users\user\Documents\GitHub\KompasMigracji\PROJECT.md
1. **Decompose**: Identify milestones for the 21 modules, RBAC updates, and 121 AI consoles.
2. **Dispatch & Execute**:
   - **Direct (iteration loop)**: Explorer → Worker → Reviewer → test → gate
   - **Delegate (sub-orchestrator)**: When an item is too large, spawn a sub-orchestrator
3. **On failure** (in this order):
   - Retry: nudge stuck agent or re-send task
   - Replace: spawn fresh agent with partial progress
   - Skip: proceed without (only if non-critical)
   - Redistribute: split stuck agent's remaining work
   - Redesign: re-partition decomposition
   - Escalate: report to parent (sub-orchestrators only, last resort)
4. **Succession**: Self-succeed at 16 spawns. Write handoff.md, spawn successor, cancel timers.
- **Work items**:
  - R1: Register 21 modules in lib/rbac.js [pending]
  - R2: Modernize/implement 21 page.jsx files under app/admin/(panel)/[module-name]/page.jsx [pending]
  - R3: Ensure all 121 modules are visually complete and have 'live' AI helper consoles/logs [pending]
  - R4: Technical Validation (pnpm build) [pending]
- **Current phase**: 1 (Decompose)
- **Current focus**: Planning milestones and structure

## 🔒 Key Constraints
- NEVER write, modify, or create source code files directly.
- NEVER run build/test commands yourself — require workers to do so.
- You MAY use file-editing tools ONLY for metadata/state files (.md) in your .agents/ folder.
- Never reuse a subagent after it has delivered its handoff — always spawn fresh.

## Current Parent
- Conversation ID: 02025dca-59f8-43ad-b8d4-c54f978d0bc2
- Updated: not yet

## Key Decisions Made
- Use Project Pattern to coordinate discovery, implementation, and verification tracks.

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|-------|------|-----------|--------|---------|
| explorer_initial_discovery | teamwork_preview_explorer | Initial discovery & 121 module audit | completed | 934d2072-c6ae-424e-bac6-354ec6c5ab1f |
| worker_m1_m2 | teamwork_preview_worker | Implement RBAC, icons, and AgentConsole | completed | 0377551b-4fc3-4312-905d-ff9cb9cbf50e |
| auditor_m1_m2 | teamwork_preview_auditor | Forensic audit and build verification | failed | fe4434d1-ebac-487a-8d1a-dd5c2e4bc35d |
| auditor_m1_m2_replace | teamwork_preview_auditor | Replacement forensic audit and build check | in-progress | d7a96cf8-9d79-4686-8321-ad9142bd2f5e |

## Succession Status
- Succession required: no
- Spawn count: 4 / 16
- Pending subagents: [d7a96cf8-9d79-4686-8321-ad9142bd2f5e]
- Predecessor: none
- Successor: not yet spawned

## Active Timers
- Heartbeat cron: task-21
- Safety timer: nonetask-120

## Artifact Index
- c:\Users\user\Documents\GitHub\KompasMigracji\PROJECT.md — Main project decomposition and architecture index
- c:\Users\user\Documents\GitHub\KompasMigracji\.agents\orchestrator\progress.md — Internal heartbeat and state log
