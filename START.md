# 🚀 SIMPLE START GUIDE

## Just 3 Steps:

### 1️⃣ Make sure you have a .env file
```bash
# Copy the example (if you haven't already)
cp .env.example .env

# Then add your OpenAI API key to .env
# OPENAI_API_KEY=your_actual_key_here
```

### 2️⃣ Install dependencies (first time only)
```bash
npm install
cd apps/server && npm install
cd ../client && npm install
cd ../..
```

> 💡 **Shortcut on Windows:** Double-click `quick-start.bat`. It runs these setup checks automatically before launching the app.

### 3️⃣ Start the app
```bash
npm run dev
```

That's it! When you see both processes running, open http://localhost:5173 in your browser.

---

## 🔧 If Something Goes Wrong

**Problem**: Port already in use
```bash
# Kill any running Node processes
# On Mac/Linux:
pkill -9 node

# On Windows (in Command Prompt):
taskkill /F /IM node.exe
```

**Problem**: Missing dependencies
```bash
# Clean install everything
rm -rf node_modules apps/*/node_modules
npm install
cd apps/server && npm install
cd ../client && npm install
cd ../..
```

**Problem**: Can't find OpenAI key
- Make sure you have a `.env` file in the root directory
- Make sure it has: `OPENAI_API_KEY=sk-your-actual-key`

---

## 📝 What `npm run dev` Does

It runs this command:
```bash
concurrently "npm run dev:server" "npm run dev:client"
```

Which starts:
- **Backend** on http://localhost:3001
- **Frontend** on http://localhost:5173

If you used `quick-start.bat`, a new browser tab opens for you. Otherwise, visit the URL manually.

---

## ✅ You Know It's Working When You See:

```
[SERVER] ✓ Balance Agent Server listening on http://localhost:3001
[CLIENT] ➜  Local:   http://localhost:5173/
```

And your browser opens showing the Balance Agent with the animated avatar!
