@echo off
echo Fixing react-native-view-shot integration...

echo Step 1: Stopping Metro server...
taskkill /f /im node.exe 2>nul

echo Step 2: Cleaning Android build...
cd android
call gradlew clean
cd ..

echo Step 3: Clearing Metro cache...
npx react-native start --reset-cache --port 8082 &

timeout /t 5

echo Step 4: Building Android app...
npx react-native run-android --port 8082

echo Fix complete! The app should now work with react-native-view-shot.
pause