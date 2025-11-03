# 🚀 Balance Agent - Windows Startup Guide

## 📋 Prerequisites
- Windows 10/11
- Node.js 18+ installed
- Chrome browser
- Git (optional, for updates)

## 🎯 Quick Start (Recommended)

### Method 1: Double-click `quick-start.bat`
1. **Run** `quick-start.bat` from your project folder.
2. The helper verifies Node.js, creates `.env` from `.env.example` if needed, installs dependencies, and opens a new terminal running `npm run dev`.
3. Your default browser (Chrome if it's your default) opens to `http://localhost:5173` once the frontend is ready.
4. Leave the new terminal window open while you use the app.

### Method 2: Use a single command prompt

1. **Open** Command Prompt (`Win + R`, then type `cmd`).
2. **Navigate** to the repo (example path shown—adjust to your machine):
   ```cmd
   cd "C:\Users\41795\OneDrive\Documents\WLB\WLB"
   ```
3. **Install dependencies** (first run or after pulling big changes):
   ```cmd
   npm run install:all
   ```
4. **Copy the env file** if it doesn't exist yet:
   ```cmd
   copy .env.example .env
   ```
5. **Start everything with one command**:
   ```cmd
   npm run dev
   ```
6. **Open Chrome** and go to `http://localhost:5173`.
   - Backend API health check lives at `http://localhost:3001/api/health`.
   - Leave the terminal running; press `Ctrl + C` to stop.

## 🔧 Troubleshooting

### If Port 5173 is Busy
```cmd
netstat -ano | findstr :5173
taskkill /f /pid [PID_NUMBER]
```

### If Port 3001 is Busy
```cmd
netstat -ano | findstr :3001
taskkill /f /pid [PID_NUMBER]
```

### If Dependencies Missing
```cmd
cd apps\server
npm install

cd ..\client
npm install
```

### If Still Not Working
1. **Close all command windows** so `npm run dev` stops completely.
2. **Run** `node --version` and `npm --version` to confirm both are available.
3. **Re-run** `npm run install:all` to refresh dependencies, then start again with `npm run dev` or `quick-start.bat`.

## 🌐 Access Points
- **Frontend**: http://localhost:5173 (Main app)
- **Backend API**: http://localhost:3001/api/health (Health check)
- **Avatar Chat**: http://localhost:5173 (Default tab)

## 🎨 What You'll See
- Beautiful avatar-first interface
- Modern glass-morphism design
- Chat with your Balance Agent
- Smooth animations and transitions
- Responsive design

## 🛑 Stopping the App
- **Close** both command windows, OR
- **Press** `Ctrl + C` in each window, OR
- **Run** `taskkill /f /im node.exe` to stop all Node processes

## 📞 Need Help?
- Check that both servers are running (two command windows)
- Verify ports 5173 and 3001 are not blocked
- Make sure Chrome can access localhost
- Try incognito mode if there are caching issues
