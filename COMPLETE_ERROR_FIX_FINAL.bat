@echo off
echo 🔧 COMPLETE React Native Error Fix - Final Solution
echo ================================================
echo.

echo 📱 Step 1: Stopping all Metro processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im "Metro Bundler" 2>nul
timeout /t 3 >nul

echo 🧹 Step 2: Cleaning all caches and build files...
if exist android\app\build (
    echo Removing android\app\build...
    rmdir /s /q android\app\build
)
if exist android\build (
    echo Removing android\build...
    rmdir /s /q android\build
)
if exist node_modules\.cache (
    echo Removing node_modules\.cache...
    rmdir /s /q node_modules\.cache
)

echo 🗑️ Step 3: Cleaning Metro cache...
npx react-native start --reset-cache --port 8081 &
timeout /t 5 >nul
taskkill /f /im node.exe 2>nul

echo 📦 Step 4: Reinstalling dependencies...
echo Removing node_modules...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo Installing fresh dependencies...
npm install

echo 🏗️ Step 5: Cleaning Android build...
cd android
echo Running gradlew clean...
gradlew clean
cd ..

echo 🔄 Step 6: Resetting React Native cache...
npx react-native start --reset-cache &
timeout /t 3 >nul
taskkill /f /im node.exe 2>nul

echo 📱 Step 7: Checking device connection...
adb devices

echo 🚀 Step 8: Starting fresh Metro bundler...
echo Starting Metro in new window...
start "Metro Bundler" cmd /k "npx react-native start --reset-cache"
timeout /t 8 >nul

echo ✅ Fix completed successfully!
echo.
echo 📋 Next steps:
echo 1. Wait for Metro bundler to fully start (green text)
echo 2. In a new terminal, run: npx react-native run-android
echo 3. If still having issues, restart your device/emulator
echo.
echo 🔧 Additional troubleshooting:
echo - Restart Android Studio
echo - Restart your computer
echo - Check if emulator is running properly
echo.
pause