@echo off
echo ========================================
echo Ultimate React Native Fix Script
echo ========================================

echo Step 1: Stopping all processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im java.exe 2>nul

echo Step 2: Cleaning everything...
cd android
call gradlew clean
cd ..

echo Step 3: Clearing all caches...
npm cache clean --force
npx react-native start --reset-cache --port 8084 &

echo Step 4: Waiting for Metro to start...
timeout /t 15

echo Step 5: Building Android app...
npx react-native run-android --port 8084

echo ========================================
echo Fix completed!
echo ========================================
pause