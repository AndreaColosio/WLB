# Balance Agent

A minimalist, agent-assisted life balance toolkit that unifies journaling, gratitude tracking, daily check-ins, and AI-powered coaching.

## 🎯 Vision

**Avatar-first, agentic life balance companion** - The product surface is a single Avatar that the user can chat with by text, voice, or short video notes. Behind this conversation, an AI Agent interprets the message and pre-prepares the four pillars:

- **Journal entry** - Reflective writing with prompts
- **Daily balance check-in** - Energy, rest, focus, connection metrics
- **Gratitude item** - Appreciation tracking with streaks
- **Practice suggestion** - Actionable wellness practices

The user never has to jump between modules. The agent turns raw conversation into structured records, then shows a concise preview for one-tap confirm or light edit.

## 🚀 Quick Start

The entire stack runs from the root `npm` scripts. In most cases you only need three commands:

1. **Install dependencies (first run only)**
   ```bash
   npm run install:all
   ```

2. **Create your environment file**
   ```bash
   cp .env.example .env
   # Add your OPENAI_API_KEY before using AI features
   ```

3. **Start both servers**
   ```bash
   npm run dev
   ```

This launches the backend on **http://localhost:3001** and the Vite frontend on **http://localhost:5173** with hot reload enabled.

> 💡 **Windows shortcut:** Double-click `quick-start.bat` to run the same flow. The helper checks for Node.js, ensures dependencies are installed, runs `npm run dev` in a new terminal window, and opens the app in your default browser.

### Troubleshooting the first run

- **Port in use?** Stop other Node/Vite processes (`taskkill /F /IM node.exe` on Windows, `pkill node` on macOS/Linux) and retry `npm run dev`.
- **Missing `.env`?** Copy `.env.example` again and add your OpenAI key. Without it the app boots, but AI responses stay in demo mode.
- **Dependencies stale?** Re-run `npm run install:all` after pulling changes.

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **AvatarChat** - Main conversation interface
- **ResultCards** - Inline review cards for journal/checkin/gratitude/practice
- **State Machine** - Conversation flow management
- **UI Components** - shadcn/ui components with Tailwind CSS

### Backend (Node.js + Express)
- **Message Analyzer** - LLM-powered conversation parsing
- **API Endpoints** - RESTful JSON API
- **Database** - SQLite with Prisma ORM
- **Gamification** - Streaks, badges, and progress tracking

### Conversation Flow
```
User Input → AI Analysis → Result Cards → User Review → Save to Database
```

## 🎨 Features

### Core Experience
- **Single Interface** - No tab switching, just natural conversation
- **AI-Powered Analysis** - Extracts structured data from natural language
- **Inline Editing** - Review and modify AI suggestions before saving
- **Voice & Video Ready** - Recording capabilities (transcription coming soon)

### Wellness Tracking
- **Journal Entries** - Reflective writing with AI-generated prompts
- **Balance Check-ins** - Energy, rest, focus, connection (0-10 scale)
- **Gratitude Tracking** - Categorized appreciation with streaks
- **Practice Suggestions** - Actionable wellness activities

### Gamification
- **Streak Tracking** - Consecutive days of activity
- **Achievement Badges** - First entry, 7-day streak, 30 gratitudes
- **Progress Analytics** - Weekly summaries and trends

## 🏗️ Recent Architecture Improvements

**New!** The codebase has been significantly improved for production-readiness:

- ✅ **Single ORM (Prisma)** - Removed Drizzle, consolidated to Prisma only
- 🔐 **JWT Authentication** - Secure user authentication with bcrypt
- 🛡️ **Error Handling** - Standardized error responses across all endpoints
- ⚙️ **Environment Validation** - Type-safe, validated environment variables
- 🧪 **Testing Infrastructure** - Vitest setup with sample tests
- 🚦 **Rate Limiting** - Protection against abuse with AI-specific limits
- 💰 **Cost Tracking** - OpenAI token usage monitoring

📖 **[Read the full Architecture Improvements Guide](./ARCHITECTURE_IMPROVEMENTS.md)**

## 🔧 Development

### Project Structure
```
WLB/
├── apps/
│   ├── client/          # React frontend
│   └── server/          # Node.js backend
├── quick-start.bat      # Optional Windows helper (wraps npm run dev)
└── README.md
```

### Available Scripts
```bash
npm run dev              # Start both server and client
npm run dev:server       # Start only backend
npm run dev:client       # Start only frontend
npm run build            # Build for production
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
npm run install:all      # Install all dependencies
```

### Environment Variables
```bash
# Required
OPENAI_API_KEY=your_key_here

# Optional (with defaults)
OPENAI_MODEL=gpt-4o-mini
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

See `.env.example` for complete list and documentation.

## 🎯 User Experience

**North Star Experience:**
1. User speaks for 30-60 seconds about their day
2. Avatar listens and analyzes the message
3. Shows prepared cards: journal draft, check-in values, gratitude, practice
4. User taps "Accept" - total time under 90 seconds

**Example Conversation:**
```
User: "I'm feeling tired but grateful for my morning coffee. Work was stressful but I managed to focus on the important tasks."

Avatar: "I hear you're managing stress while staying focused. Let me help you capture this moment."

[Shows cards for:]
- Journal: "Managing Stress with Focus" 
- Check-in: Energy 6, Rest 5, Focus 7, Connection 6
- Gratitude: "Morning coffee ritual"
- Practice: "2-minute breathing exercise"
```

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express, TypeScript
- **Database:** SQLite with Prisma ORM
- **AI:** OpenAI GPT-4o-mini
- **State Management:** React Query, Local state
- **Styling:** Tailwind CSS with CSS modules

## 📱 Mobile-First Design

The app is designed mobile-first with a maximum width container to simulate a phone app experience, making it perfect for daily wellness check-ins on any device.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Verify with `npm run dev`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ for mindful living and balanced wellness.**