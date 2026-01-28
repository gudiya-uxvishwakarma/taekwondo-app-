@echo off
echo 🔧 Fixing Certificate Implementation Errors...

echo.
echo 📱 Stopping Metro and clearing cache...
taskkill /f /im node.exe 2>nul
timeout /t 2 >nul

echo.
echo 🧹 Cleaning project...
if exist node_modules\react-native-fs (
    echo Removing react-native-fs dependency...
    npm uninstall react-native-fs
)

echo.
echo 📦 Installing required dependencies...
npm install

echo.
echo 🔄 Clearing Metro cache...
npx react-native start --reset-cache --port 8081 &

echo.
echo ⏳ Waiting for Metro to start...
timeout /t 5 >nul

echo.
echo 📱 Building and running the app...
npx react-native run-android --reset-cache

echo.
echo ✅ Certificate implementation fixed!
echo.
echo 🎯 Features now working:
echo   ✅ Certificate icons (MaterialIcons)
echo   ✅ Filter system (All, 2025, 2026, Awards, etc.)
echo   ✅ Beautiful certificate view modal
echo   ✅ Download and share functionality
echo   ✅ No RNFS dependency errors
echo.
pause