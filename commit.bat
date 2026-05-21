@echo off
cd /d "c:\Users\user\Documents\GitHub\KompasMigracji"
git add app/api/chat/route.ts components/ChatBot.tsx lib/supabase.ts
git commit -m "Fix code review issues: security, performance, and code quality

- Update Anthropic API model to claude-3-5-haiku-20241022 (sec-001)
- Add rate limiting to /api/chat endpoint - 10 requests/min per IP (sec-002)  
- Refactor ChatBot component: extract 120+ inline styles to object-based styles (perf-001)
- Add error logging to Supabase insert operation (perf-002)
- Replace array index keys with unique message IDs (code-002)
- Add warning for missing Supabase credentials in lib/supabase.ts (code-003)

This improves security against abuse, optimizes performance, and enhances code maintainability.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
