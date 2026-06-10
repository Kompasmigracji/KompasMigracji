# Project: KompasCRM - Active Modules & AI Agent Console Integration

## Architecture
- **Navigation (RBAC)**: Defined in `lib/rbac.js`. The sidebar menu dynamically filters `NAV` configurations matching the logged-in user's roles.
- **App Shell Layout**: All dashboard routes are wrapped inside `app/admin/(panel)/layout.jsx` which returns `components/admin/Shell.jsx`.
- **Systematic Console Injection**: Instead of modifying 121 files individually, we mount `components/admin/AgentConsole.jsx` inside `Shell.jsx` alongside the main content area, resolving context via URL pathname.
- **Component Styling & Assets**: Common styles use custom CSS variables. SVGs are resolved statically inside the `PATHS` dictionary in `components/admin/ui.jsx`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Navigation & Icons Setup | Register 21 modules in `lib/rbac.js` and add missing SVG paths in `components/admin/ui.jsx`. | None | DONE |
| M2 | AI Agent Console Implementation | Implement `AgentConsole.jsx` and modify `Shell.jsx` to render the console context-aware. | M1 | DONE |
| M3 | Code Quality & Build Verification | Perform full production builds, typechecks, and verify zero errors/lint issues. | M2 | DONE |

## Interface Contracts
### `AgentConsole` Component
- **Props**:
  - `module`: `string` (corresponds to the URL path segment under `/admin/`, e.g. `booking` or `livechat`).
  - `onClose`: `() => void` (callback fired when closing the right panel drawer).
- **Behavior**:
  - Resolves agent details (`name`, `role`, `objective`, `uptime`, `memory`, `defaultLogs`) from local registry.
  - Dynamically updates mock console logs every 12 seconds with simulated telemetry lines.
  - Allows command prompt input; echoes back user commands and mock acknowledgment logs.
