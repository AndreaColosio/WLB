**Do not re-plan unless a human requests it.**

# Client App Inventory & Development Plan

## Current File Map

### Entry Points
- `src/main.tsx` - React DOM root
- `src/index.css` - Global styles (Tailwind + CSS variables)
- `src/App.tsx` - Main app component (QueryClient setup)
- `src/App.module.css` - App-specific styles (28KB, 1430 lines)

### Pages
- `src/pages/Today.tsx` - Today view
- `src/pages/Journal.tsx` - Journal entries
- `src/pages/Gratitude.tsx` - Gratitude entries
- `src/pages/Progress.tsx` - Progress tracking
- `src/pages/not-found.tsx` - 404 page

### Components
- `src/components/AvatarChat.tsx` - Main chat interface (312 lines)
- `src/components/ResultCards.tsx` - Result display cards (364 lines)
- `src/components/Sidebar.tsx` - Sidebar navigation
- `src/components/CalendarSidebar.tsx` - Calendar widget
- `src/components/TabNavigation.tsx` - Tab switcher
- `src/components/QuickCapture.tsx` - Quick entry form
- `src/components/BalanceSliders.tsx` - Balance sliders UI
- `src/components/AgentCard.tsx` - Agent display card
- `src/components/ui/*` - 48 shadcn/ui components (accordion, alert, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, switch, table, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip)

### Hooks
- `src/hooks/useApi.ts` - API calls wrapper
- `src/hooks/useConversationState.ts` - Chat state management
- `src/hooks/use-mobile.tsx` - Mobile detection
- `src/hooks/use-toast.ts` - Toast notifications

### API
- `src/api/client.ts` - Axios instance (34 lines)

### Lib/Utils
- `src/lib/utils.ts` - Utility functions
- `src/lib/queryClient.ts` - React Query setup

### Services
None currently (potential services directory for chatService, dataService, etc.)

---

## Development Milestones

### Milestone 1: Core Routing & Layout Foundation
**Goal:** Set up routing, layout structure, and navigation

**Files to Modify:**
- `src/App.tsx` - Add React Router setup
- `src/main.tsx` - Add router provider

**Files to Add:**
- `src/routes/index.tsx` - Route definitions
- `src/components/layout/Layout.tsx` - Main layout wrapper
- `src/components/layout/Header.tsx` - App header component
- `src/components/layout/NavBar.tsx` - Navigation bar

**Files to Delete:**
None

---

### Milestone 2: Page Structure & Navigation
**Goal:** Implement all page routes and tab navigation

**Files to Modify:**
- `src/routes/index.tsx` - Define all page routes (chat, today, journal, gratitude, progress, 404)
- `src/components/layout/NavBar.tsx` - Active route highlighting
- `src/pages/Today.tsx` - Add proper route wrapper
- `src/pages/Journal.tsx` - Add proper route wrapper
- `src/pages/Gratitude.tsx` - Add proper route wrapper
- `src/pages/Progress.tsx` - Add proper route wrapper

**Files to Add:**
- `src/pages/Chat.tsx` - Dedicated chat page (extract from App.tsx)
- `src/components/layout/NavItem.tsx` - Reusable nav item component

**Files to Delete:**
None

---

### Milestone 3: Component Architecture & State Management
**Goal:** Organize components, add global state, and API integration

**Files to Modify:**
- `src/components/AvatarChat.tsx` - Extract to services, add state hooks
- `src/hooks/useApi.ts` - Expand API endpoints
- `src/lib/queryClient.ts` - Add default error handling

**Files to Add:**
- `src/services/chatService.ts` - Chat API calls
- `src/services/dataService.ts` - Data fetching
- `src/context/AppContext.tsx` - Global app state
- `src/context/AuthContext.tsx` - Auth state (if needed)
- `src/types/index.ts` - TypeScript definitions
- `src/components/error/ErrorBoundary.tsx` - Error handling

**Files to Delete:**
None

---

### Milestone 4: Features & Polish
**Goal:** Complete features, responsiveness, and optimization

**Files to Modify:**
- `src/components/ResultCards.tsx` - Add animations and interactions
- `src/pages/Progress.tsx` - Add charts/visualizations
- `src/components/BalanceSliders.tsx` - Add validation and feedback
- `src/index.css` - Add responsive breakpoints
- `src/App.module.css` - Optimize and modularize

**Files to Add:**
- `src/components/skeleton/LoadingSkeleton.tsx` - Loading states
- `src/components/error/ErrorDisplay.tsx` - Error UI
- `src/utils/dateUtils.ts` - Date formatting helpers
- `src/utils/validation.ts` - Form validation helpers

**Files to Delete:**
- `src/components/Sidebar.d.ts` (empty type file, if unused)
- `src/components/AvatarChat.d.ts` (empty type file, if unused)
- `src/components/CalendarSidebar.d.ts` (empty type file, if unused)

---

## Dependencies & Tools

**Current Stack:**
- React 18.2.0
- TypeScript 5.4.5
- Vite 5.2.10
- React Query 5.51.1
- Axios 1.7.2
- Tailwind CSS 3.4.18
- Lucide React (icons)

**To Add:**
- `react-router-dom` - Client-side routing
- `date-fns` or `dayjs` - Date utilities

**Style System:**
- Tailwind CSS (utility-first)
- CSS Modules (App.module.css)
- CSS Variables (theme system in index.css)
- 48 shadcn/ui components
