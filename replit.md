# Balance Agent

## Overview

Balance Agent is a minimalist, agent-assisted life balance toolkit that unifies journaling, gratitude tracking, daily check-ins, and AI-powered coaching. The application provides a mobile-first experience with four core features: Today Tab (AI-powered daily guidance), Journal (reflective writing), Gratitude (appreciation tracking with streaks), and Progress (weekly summaries and achievement badges).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, built using Vite
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: React Query (TanStack Query) for server state management, local component state for forms
- **Routing**: Wouter for lightweight client-side routing
- **UI Design**: Mobile-first responsive design with a maximum width container to simulate a phone app experience
- **Component Structure**: Modular components for each major feature (AgentCard, BalanceSliders, QuickCapture, TabNavigation)

### Backend Architecture
- **Framework**: Node.js with Express and TypeScript
- **Database**: PostgreSQL with Prisma ORM for database operations
- **API Design**: RESTful JSON API under `/api/*` endpoints
- **Development Setup**: Uses Vite middleware in development for hot module reloading
- **Request Logging**: Custom middleware for API request/response logging
- **Error Handling**: Centralized error handling with proper HTTP status codes

### Database Schema Design
- **Users**: Simple user model with ID and username/password fields
- **Entries**: Polymorphic entry system supporting JOURNAL, GRATITUDE, and CHECKIN types
- **Check-ins**: Separate model for daily balance assessments with energy, rest, focus, and connection metrics
- **Badges**: Gamification system for tracking user achievements
- **Scoring**: Computed balance scores and streak calculations

### AI Integration
- **Service**: OpenAI GPT integration for generating personalized coaching cards
- **Context-Aware**: Agent responses adapt based on time of day, mood, and recent entries
- **Fallback**: Offline mode with static content when API is unavailable
- **Response Format**: Structured JSON responses with prompts, reflections, and practices

### State Management Strategy
- **Server State**: React Query handles API calls, caching, and synchronization
- **Local State**: React hooks for form inputs and UI interactions
- **Data Flow**: Optimistic updates for better user experience
- **Cache Strategy**: 5-minute stale time for queries, disabled window focus refetching

### Gamification System
- **Streak Tracking**: Calculates consecutive days of activity across all entry types
- **Badge System**: Achievement-based rewards (first entry, 7-day streak, 30 gratitudes)
- **Progress Metrics**: Weekly summaries with entry counts and average balance scores
- **Real-time Updates**: Badges awarded immediately upon meeting criteria

## External Dependencies

### Third-Party Services
- **OpenAI API**: GPT-4 or GPT-5 for AI coaching responses, configured via environment variables
- **Neon Database**: PostgreSQL hosting service (indicated by @neondatabase/serverless dependency)

### Major Libraries and Frameworks
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, React Query, Wouter, shadcn/ui components
- **Backend**: Express, Prisma ORM, OpenAI SDK, CORS middleware
- **UI Components**: Extensive Radix UI primitives for accessible component foundation
- **Development**: tsx for TypeScript execution, concurrently for parallel processes

### Database and Storage
- **Primary Database**: PostgreSQL via Prisma ORM with Drizzle configuration
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon serverless PostgreSQL for production hosting

### Authentication and Security
- **Authentication**: Basic user model structure present but not fully implemented
- **CORS**: Configured for localhost development environments
- **Session Management**: Express session infrastructure in place

### Development and Build Tools
- **Build System**: Vite for frontend bundling and development server
- **TypeScript**: Full TypeScript support across frontend and backend
- **Package Management**: pnpm with workspace configuration for monorepo structure
- **Code Quality**: ESLint and Prettier configuration implied by development setup