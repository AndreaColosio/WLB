# Balance Agent - Complete Setup Guide

## Quick Start (Recommended)

### For Windows:
1. Double-click `start.bat`
2. Edit `.env` and add your OpenAI API key
3. Run `start.bat` again

### For Mac/Linux:
1. Run `./start.sh`
2. Edit `.env` and add your OpenAI API key
3. Run `./start.sh` again

The script will automatically:
- Create `.env` from `.env.example` if missing
- Install all dependencies if needed
- Set up Prisma client (with workaround for restricted environments)
- Start both frontend and backend servers

## Manual Setup

If you prefer to run setup manually:

### 1. Install Dependencies

```bash
npm install                    # Root dependencies
cd apps/server && npm install  # Server dependencies
cd ../client && npm install    # Client dependencies
cd ../..
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set your OpenAI API key:
```
OPENAI_API_KEY=your_actual_openai_api_key_here
```

### 3. Setup Database

**Normal Environment:**
```bash
cd apps/server
npx prisma generate
npx prisma db push
cd ../..
```

**Restricted Environment (if Prisma engine downloads are blocked):**
```bash
./setup-prisma-mock.sh   # Mac/Linux
# or
setup-prisma-mock.bat    # Windows
```

### 4. Start Development Servers

```bash
npm run dev
```

This starts:
- **Backend API** on http://localhost:3001
- **Frontend UI** on http://localhost:5173

## What's Included After Setup

✅ **Dependencies Installed:**
- Root workspace dependencies
- Server dependencies (Express, Prisma, OpenAI, etc.)
- Client dependencies (React, Vite, Framer Motion, etc.)

✅ **Environment Configuration:**
- `.env` file created (not committed to git)
- Default settings for development

✅ **Database Setup:**
- SQLite database (or mock in restricted environments)
- Prisma client generated

## Current Setup State

### ✅ Already Configured:
- All npm dependencies installed in all packages
- `.env` file created from template
- Prisma mock client configured (temporary workaround)
- Start scripts updated with auto-setup

### ⚠️ Needs Your Attention:
1. **Add OpenAI API Key** - Edit `.env` and replace `your_openai_api_key_here`
2. **Database Limitation** - Currently using mock Prisma client due to environment restrictions
   - Data will NOT persist between restarts
   - For production, use a non-restricted environment

## Known Issues & Workarounds

### Issue: Prisma Engine Download Blocked (403 Forbidden)

**Cause:** This environment blocks downloads from binaries.prisma.sh

**Current Workaround:** Using a mock Prisma client that:
- ✓ Allows the app to start without errors
- ✓ Provides the same API as real Prisma
- ✗ Does NOT persist data to database
- ✗ Always returns empty results

**Permanent Solutions:**
1. Run in a different environment without network restrictions
2. Use a VPN or proxy that allows Prisma downloads
3. Switch to a different database library (e.g., better-sqlite3)

The mock client is automatically recreated by `start.sh`/`start.bat` if missing.

## Project Structure

```
WLB/
├── apps/
│   ├── server/           # Backend API (Express + Prisma)
│   │   ├── prisma/       # Database schema
│   │   └── src/          # Server source code
│   └── client/           # Frontend UI (React + Vite)
│       └── src/          # Client source code
├── .env                  # Environment variables (create from .env.example)
├── .env.example          # Environment template
├── start.sh              # Quick start launcher (Mac/Linux)
├── start.bat             # Quick start launcher (Windows)
├── setup-prisma-mock.sh  # Prisma workaround script (Mac/Linux)
└── setup-prisma-mock.bat # Prisma workaround script (Windows)
```

## Environment Variables

All environment variables are in `.env`:

```bash
# Server
PORT=3001                 # Backend server port
NODE_ENV=development      # Environment mode

# Database
# DATABASE_URL is auto-set for SQLite: file:dev.sqlite
# For PostgreSQL: postgresql://user:pass@host:5432/dbname

# OpenAI
OPENAI_API_KEY=          # ⚠️ REQUIRED - Get from https://platform.openai.com
OPENAI_MODEL=gpt-4o-mini # AI model to use

# Authentication
JWT_SECRET=              # Change in production! (generate: openssl rand -base64 32)
JWT_EXPIRES_IN=7d        # Token expiration time
```

## Testing

```bash
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Building for Production

```bash
npm run build         # Build both client and server
npm start             # Start production server
```

## Troubleshooting

### "OPENAI_API_KEY: Required" error
- Edit `.env` and add your OpenAI API key
- Get one from https://platform.openai.com/api-keys

### "Prisma Client did not initialize" error
- Run `./setup-prisma-mock.sh` (Mac/Linux) or `setup-prisma-mock.bat` (Windows)
- This creates a mock client that bypasses the download issue

### Port already in use
- Check if another app is using port 3001 or 5173
- Change `PORT` in `.env` to a different port

### Can't connect to backend
- Make sure both servers are running (you should see 2 outputs)
- Check that backend shows "Server running on port 3001"
- Try accessing http://localhost:3001/health directly

## Getting Help

If you encounter issues:
1. Check this SETUP.md file
2. Review the console output for specific error messages
3. Ensure `.env` has your OpenAI API key
4. Try deleting `node_modules` and running `npm install` again

## Next Steps

Once setup is complete:
1. Open http://localhost:5173 in your browser
2. You'll see the modern chat interface
3. Start chatting with your Balance Agent!

Note: Due to the mock database, your conversations won't persist. For full functionality, run in an unrestricted environment.
