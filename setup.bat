@echo off
REM StreamVerse Quick Setup Script for Windows
REM This script automates the setup process for the StreamVerse project

echo 🎬 StreamVerse Quick Setup
echo ==========================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
echo.

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo 🔧 Creating .env.local...
    (
        echo # Firebase Configuration
        echo NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
        echo NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
        echo NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
        echo NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
        echo NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
        echo NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
        echo.
        echo # API Configuration
        echo NEXT_PUBLIC_API_URL=http://localhost:3000
        echo.
        echo # Optional: OAuth Credentials
        echo # NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
        echo # NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
    ) > .env.local
    echo ✅ .env.local created. Please update with your Firebase credentials.
    echo.
) else (
    echo ✅ .env.local already exists
    echo.
)

echo 🚀 Setup complete!
echo.
echo Next steps:
echo 1. Update .env.local with your Firebase credentials
echo 2. Run: npm run dev
echo 3. Open: http://localhost:3000
echo.
echo 📚 Documentation: See README.md for more information
echo 💬 Need help? Check IMPLEMENTATION.md for detailed info
echo.
pause
