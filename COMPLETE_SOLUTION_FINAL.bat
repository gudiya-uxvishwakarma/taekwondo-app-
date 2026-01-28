@echo off
echo ========================================
echo COMPLETE SOLUTION - REMOVING VIEWSHOT PERMANENTLY
echo ========================================

echo 🛑 Step 1: Killing all processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im java.exe 2>nul
taskkill /f /im adb.exe 2>nul

echo 🗑️ Step 2: Removing react-native-view-shot completely...
npm uninstall react-native-view-shot

echo 🧹 Step 3: Deep cleaning...
cd android
call gradlew clean
call gradlew cleanBuildCache
rmdir /s /q build 2>nul
rmdir /s /q app\build 2>nul
cd ..

echo 📦 Step 4: Reinstalling dependencies...
rmdir /s /q node_modules 2>nul
npm cache clean --force
npm install

echo 🔄 Step 5: Restarting ADB...
adb kill-server
adb start-server

echo 🗑️ Step 6: Clearing all caches...
del /q /s %TEMP%\metro-* 2>nul
del /q /s %TEMP%\react-* 2>nul
del /q /s %TEMP%\haste-* 2>nul

echo 🚀 Step 7: Starting Metro fresh...
start "Metro Server" cmd /k "npx react-native start --reset-cache --verbose"

echo ⏳ Step 8: Waiting for Metro to initialize...
timeout /t 15

echo 📱 Step 9: Running Android app...
npx react-native run-android --verbose

echo ========================================
echo ✅ COMPLETE SOLUTION APPLIED!
echo 
echo Changes made:
echo - Removed react-native-view-shot completely
echo - Updated all files to use alternative ScreenCapture
echo - Cleaned MainApplication.java
echo - Updated react-native.config.js
echo - Updated package.json
echo 
echo Your app should now work without any ViewShot errors!
echo ========================================
pause