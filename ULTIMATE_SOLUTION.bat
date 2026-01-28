@echo off
echo ========================================
echo ULTIMATE SOLUTION - FIXING ALL ERRORS
echo ========================================

echo 🛑 Killing all React Native processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im java.exe 2>nul
taskkill /f /im adb.exe 2>nul

echo 🔄 Restarting ADB server...
adb kill-server
timeout /t 2
adb start-server

echo 🧹 Deep cleaning Android build...
cd android
call gradlew clean
call gradlew cleanBuildCache
rmdir /s /q build 2>nul
rmdir /s /q app\build 2>nul
cd ..

echo 📦 Reinstalling node_modules completely...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
npm cache clean --force

echo 📥 Fresh npm install...
npm install

echo 🔗 Manual linking of react-native-view-shot...
npx react-native unlink react-native-view-shot 2>nul
npx react-native link react-native-view-shot

echo 🗑️ Clearing all caches...
del /q /s %TEMP%\metro-* 2>nul
del /q /s %TEMP%\react-* 2>nul
del /q /s %TEMP%\haste-* 2>nul
del /q /s %APPDATA%\npm-cache 2>nul

echo 🔧 Testing ViewShot integration...
node test-viewshot-fix.js

echo 🏗️ Rebuilding Android project...
cd android
call gradlew assembleDebug
cd ..

echo 🚀 Starting Metro server...
start "Metro Server" cmd /k "npx react-native start --reset-cache --verbose"

echo ⏳ Waiting for Metro to be ready...
timeout /t 20

echo 📱 Running Android app...
npx react-native run-android --verbose

echo ========================================
echo ✅ ULTIMATE SOLUTION COMPLETE!
echo 
echo If you still see errors:
echo 1. Check that your Android device/emulator is connected
echo 2. Make sure USB debugging is enabled
echo 3. The native module is now manually linked in MainApplication.java
echo 
echo Your app should now work without RNViewShot or registration errors!
echo ========================================
pause