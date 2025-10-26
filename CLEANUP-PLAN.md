# Cleanup Plan: Consolidate to Single Client Directory

## Current State
- `apps/client/` - The REAL client (used by all scripts, monorepo structure)
- `client/` - Duplicate directory (created by mistake during Milestones 1-4)

## Problem
Having two client directories causes:
- Confusion about which to edit
- Wasted time copying files between them
- Risk of working in the wrong directory

## Solution: Keep `apps/client/`, Remove `client/`

### Step 1: Verify `apps/client/` has everything
✅ All Milestone 1-4 files are now in `apps/client/src/`:
- Routes, layout, avatar components
- Module stubs (Check-in, Journal, Gratitude, Progress)
- Services (storage, intent, convo)
- Pages (Chat, not-found)
- Hook (useConversationState)
- Updated App.tsx with RouterProvider

### Step 2: Move PLAN.md to proper location
```bash
move client\PLAN.md apps\client\PLAN.md
```

### Step 3: Delete the duplicate `client/` directory
```bash
rmdir /s /q client
```

### Step 4: Update any references
- Check if any scripts reference `client/` (they shouldn't based on README.md)
- All scripts already use `apps/client/`

## After Cleanup
Single source of truth: `apps/client/`
- Cleaner repo structure
- No confusion
- Faster development

## Execute?
Run these commands when ready:
```bash
move client\PLAN.md apps\client\
git add apps\client\PLAN.md
git rm -r client\
git commit -m "chore: consolidate to single client directory, remove duplicate"
```

