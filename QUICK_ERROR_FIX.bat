@echo off
echo ========================================
echo QUICK FIX FOR RNViewShot AND APP REGISTRATION ERRORS
echo ========================================

echo Killing all Metro and React Native processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im java.exe 2>nul

echo Cleaning Metro cache...
npx react-native start --reset-cache --port 8081 &
timeout /t 2
taskkill /f /im node.exe 2>nul

echo Cleaning Android build...
cd android
call gradlew clean
cd ..

echo Reinstalling react-native-view-shot...
npm uninstall react-native-view-shot
npm install react-native-view-shot@4.0.3

echo Clearing watchman cache...
npx react-native start --reset-cache &
timeout /t 3
taskkill /f /im node.exe 2>nul

echo Starting Metro with fresh cache...
start "Metro Server" cmd /k "npx react-native start --reset-cache --port 8081"

echo Waiting for Metro to initialize...
timeout /t 8

echo Running Android app...
npx react-native run-android

echo ========================================
echo If errors persist, run COMPLETE_ERROR_FIX_FINAL.bat
echo ========================================
pause