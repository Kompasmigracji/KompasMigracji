## 2026-06-10T03:14:49Z
You are the Implementation Specialist.
Your working directory is c:\Users\user\Documents\GitHub\KompasMigracji\.agents\worker_bugfix.
Your task is to fix the memory leak and infinite re-render loop in `components/admin/AgentConsole.jsx` identified by the Forensic Auditor.

Specifically:
1. Wrap the initialization of `agent` in `useMemo` so that the object reference remains stable when the module doesn't change:
   ```javascript
   const agent = useMemo(() => {
     return AGENT_REGISTRY[module] || AGENT_REGISTRY.fallback(module);
   }, [module]);
   ```
   Make sure to import `useMemo` at the top of the file alongside other React hooks.
2. In the `useEffect` block inside `AgentConsole.jsx`, ensure the interval timer is cleaned up on unmount or when dependencies change by returning a cleanup function:
   ```javascript
   return () => clearInterval(interval);
   ```
3. Run `pnpm build`, `pnpm lint`, and `pnpm typecheck` (or `tsc --noEmit` if typecheck script is not in package.json) to verify the build completes successfully without errors or warnings.
4. Document the exact changes and build outputs in `handoff.md` in your directory. Use send_message to report your progress and completion back to me.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
