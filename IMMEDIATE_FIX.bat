@echo off
echo ========================================
echo IMMEDIATE FIX FOR CURRENT ERRORS
echo ========================================

echo 1. Stopping all React Native processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im java.exe 2>nul
taskkill /f /im adb.exe 2>nul

echo 2. Restarting ADB server...
adb kill-server
adb start-server

echo 3. Clearing Metro bundler cache...
del /q /s %TEMP%\metro-* 2>nul
del /q /s %TEMP%\react-* 2>nul

echo 4. Cleaning Android build completely...
cd android
call gradlew clean
call gradlew cleanBuildCache
cd ..

echo 5. Removing and reinstalling problematic modules...
npm uninstall react-native-view-shot
npm install react-native-view-shot@4.0.3 --save

echo 6. Clearing all caches...
npm cache clean --force
npx react-native start --reset-cache &
timeout /t 3
taskkill /f /im node.exe 2>nul

echo 7. Starting Metro server fresh...
start "Metro" cmd /k "npx react-native start --reset-cache --verbose"

echo 8. Waiting for Metro to be ready...
timeout /t 10

echo 9. Building and running Android app...
npx react-native run-android --verbose

echo ========================================
echo DONE! Check your device/emulator now.
echo ========================================
pause