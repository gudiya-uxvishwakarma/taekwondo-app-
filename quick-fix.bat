@echo off
echo Quick Fix for React Native App...

echo Stopping all Node processes...
taskkill /f /im node.exe 2>nul

echo Cleaning project...
cd android
call gradlew clean
cd ..

echo Clearing npm cache...
npm start -- --reset-cache &

echo Waiting 3 seconds...
timeout /t 3

echo Running app...
npx react-native run-android

echo Done!
pause