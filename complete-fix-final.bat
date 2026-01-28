@echo off
echo ========================================
echo Complete React Native Fix Script
echo ========================================

echo Step 1: Stopping all Metro processes...
taskkill /f /im node.exe 2>nul
timeout /t 2

echo Step 2: Cleaning Android build...
cd android
call gradlew clean
cd ..

echo Step 3: Clearing npm cache...
npm cache clean --force

echo Step 4: Clearing Metro cache...
npx react-native start --reset-cache --port 8083 &

echo Waiting for Metro to start...
timeout /t 10

echo Step 5: Building and running Android app...
npx react-native run-android --port 8083

echo ========================================
echo Fix completed! App should now work properly.
echo ========================================
pause