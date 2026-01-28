@echo off
echo Fixing Metro/React Native Error...

echo Step 1: Killing all Node processes...
taskkill /f /im node.exe 2>nul

echo Step 2: Cleaning Metro cache...
npx react-native start --reset-cache --port 8081 &

echo Step 3: Waiting for Metro to start...
timeout /t 5

echo Step 4: Running Android app...
npx react-native run-android

echo Metro error fix completed!
pause