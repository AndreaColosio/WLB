# Architecture Summary: Sources of Complexity

## Current Architecture (Simplified)
```
WLB/
├── server/              ← PROBLEM: Legacy monolithic server (604-line routes.ts)
│   └── routes.ts        ← Contains duplicated chat, agent, entries logic
│
├── apps/
│   ├── server/          ← GOOD: Proper modular server
│   │   └── src/
│   │       ├── routes/      (8 files, properly split)
│   │       ├── services/    (agent, messageAnalyzer)
│   │       ├── middleware/  (auth, rateLimiter, errorHandler)
│   │       └── lib/         (prisma, jwt, scoring)
│   │
│   └── client/          ← MESSY: Multiple UI generations mixed together
│       └── src/
│           ├── pages/       ← Has Old + New versions (Chat.tsx + NewChat.tsx)
│           └── components/
│               ├── layout/      ← One Layout system
│               └── modern/      ← ANOTHER Layout system
│
├── vite.config.ts       ← Root config (for which client?)
└── tailwind.config.ts   ← Root config (duplicates apps/client config?)
```

## Top Redundancies & Confusion Sources

| Issue | Location | Impact |
|-------|----------|--------|
| **Duplicate server** | `server/` vs `apps/server/` | AI doesn't know which to modify |
| **Monolithic routes.ts** | `server/routes.ts` (604 lines) | All logic in one file with inline OpenAI code |
| **Old/New page pairs** | `pages/Chat.tsx` + `pages/NewChat.tsx` | 4 pairs: Chat, Journal, Gratitude, Progress |
| **Competing layouts** | `components/layout/` vs `components/modern/` | Two ways to structure UI |
| **Router confusion** | `react-router-dom` + `wouter` in package.json | Both routing libs installed |
| **ThemeContext duplication** | `components/ThemeContext.tsx` + `contexts/ThemeContext` | Two theme implementations |

## The 3 Most Important Simplifications

### 1. Delete `server/` directory entirely
**Why:** `apps/server/` already has all functionality with better architecture.
- `server/routes.ts` is 604 lines of duplicated monolithic code
- `apps/server/src/routes/` has the same endpoints split into 8 clean files
- Root server creates confusion about which is "real"

**Action:** `rm -rf server/` + update root scripts if needed

### 2. Pick one page per feature, delete the "New" versions
**Why:** Having `Chat.tsx` AND `NewChat.tsx` means AI might edit wrong file.
```
Keep:          Delete:
Chat.tsx       NewChat.tsx
Journal.tsx    NewJournal.tsx
Gratitude.tsx  NewGratitude.tsx
Progress.tsx   NewProgress.tsx
```
**Action:** Consolidate best parts into single files

### 3. Consolidate to one Layout system
**Why:** `components/layout/` and `components/modern/` do the same thing.
- Pick `modern/` (appears more recent)
- Move any unique components from `layout/` into it
- Delete `components/layout/`

---

## Why This Confuses AI Tools

1. **Ambiguous targets** - "Edit the chat route" could mean 3 places
2. **Pattern inconsistency** - Some routes in monolith, some modular
3. **Naming conflicts** - `Layout.tsx` exists in two places
4. **Dead code paths** - Old versions kept alongside new ones
5. **No clear entry point** - Root has server code + apps have server code

## Quick Wins (< 30 min each)
- [ ] Delete `server/` directory
- [ ] Delete `New*.tsx` page duplicates
- [ ] Remove `wouter` from package.json (use react-router-dom only)
- [ ] Delete `components/ThemeContext.tsx` (keep `contexts/ThemeContext`)
