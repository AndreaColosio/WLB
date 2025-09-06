# Balance Agent

A minimalist, agent-assisted life balance toolkit that unifies journaling, gratitude tracking, daily check-ins, and AI-powered coaching.

## Features

- **Today Tab**: AI-powered daily guidance and quick capture
- **Journal**: Reflective writing with prompts
- **Gratitude**: Appreciation tracking with streaks
- **Progress**: Weekly summaries and achievement badges

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up database
cd apps/server
pnpm prisma:gen
pnpm prisma:migrate

# Add environment variables (optional)
cp .env.example .env
# Edit .env with your OPENAI_API_KEY

# Start development servers
cd ../..
pnpm dev
