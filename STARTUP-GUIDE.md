# 🚀 Balance Agent - Windows Startup Guide

## 📋 Prerequisites
- Windows 10/11
- Node.js 18+ installed
- Chrome browser
- Git (optional, for updates)

## 🎯 Quick Start (Recommended)

### Method 1: Use the Launch Script
1. **Double-click** `quick-start.bat` in your project folder
2. **Wait** for two command windows to open (Backend & Frontend)
3. **Wait** for the browser to automatically open to `http://localhost:5173`
4. **Enjoy** your avatar-first Balance Agent!

### Method 2: Manual Startup (If scripts don't work)

#### Step 1: Open Command Prompt
- Press `Win + R`
- Type `cmd` and press Enter

#### Step 2: Navigate to Project
```cmd
cd "C:\Users\41795\OneDrive\Documents\WLB\WLB"
```

#### Step 3: Start Backend Server
```cmd
cd apps\server
npm run dev
```
- **Keep this window open**
- You should see: `🚀 Balance Agent Server listening on http://localhost:3001`

#### Step 4: Open New Command Prompt
- Press `Win + R` again
- Type `cmd` and press Enter

#### Step 5: Start Frontend Client
```cmd
cd "C:\Users\41795\OneDrive\Documents\WLB\WLB\apps\client"
npm run dev
```
- **Keep this window open**
- You should see: `Local: http://localhost:5173/`

#### Step 6: Open Chrome
- Open Chrome browser
- Go to: `http://localhost:5173`
- You should see the beautiful avatar-first interface!

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
1. **Close all command windows**
2. **Run** `test-launch.bat` to check system requirements
3. **Try** `launch.bat` for full diagnostic startup

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
