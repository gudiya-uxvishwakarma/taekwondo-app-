@echo off
echo 🔧 Fixing React Native App Registration Error...
echo.

echo 📱 Step 1: Stopping Metro bundler...
taskkill /f /im node.exe 2>nul
timeout /t 2 >nul

echo 🧹 Step 2: Cleaning Metro cache...
npx react-native start --reset-cache --port 8081 &
timeout /t 3 >nul
taskkill /f /im node.exe 2>nul

echo 🗑️ Step 3: Cleaning build directories...
if exist android\app\build rmdir /s /q android\app\build
if exist android\build rmdir /s /q android\build
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo 📦 Step 4: Reinstalling node modules...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
npm install

echo 🔗 Step 5: Linking native dependencies...
npx react-native unlink react-native-view-shot 2>nul
npx react-native unlink react-native-share 2>nul
npx react-native link react-native-view-shot
npx react-native link react-native-share

echo 🏗️ Step 6: Cleaning and rebuilding Android...
cd android
gradlew clean
cd ..

echo 🚀 Step 7: Starting fresh Metro bundler...
start "Metro" npx react-native start --reset-cache
timeout /t 5 >nul

echo ✅ Fix completed! Now run: npx react-native run-android
echo.
echo 📋 If error persists, try these additional steps:
echo 1. Restart your device/emulator
echo 2. Run: adb kill-server && adb start-server
echo 3. Check if all packages are properly installed
echo.
pause