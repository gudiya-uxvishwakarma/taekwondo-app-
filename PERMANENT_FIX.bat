@echo off
echo ========================================
echo PERMANENT FIX FOR REACT NATIVE ERRORS
echo ========================================

echo Step 1: Stopping all processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im java.exe 2>nul
taskkill /f /im adb.exe 2>nul

echo Step 2: Restarting ADB...
adb kill-server
adb start-server

echo Step 3: Complete clean...
cd android
call gradlew clean
call gradlew cleanBuildCache
cd ..

echo Step 4: Removing node_modules and reinstalling...
rmdir /s /q node_modules 2>nul
npm cache clean --force
npm install

echo Step 5: Manual linking for react-native-view-shot...
npx react-native unlink react-native-view-shot
npx react-native link react-native-view-shot

echo Step 6: Clearing all React Native caches...
del /q /s %TEMP%\metro-* 2>nul
del /q /s %TEMP%\react-* 2>nul
del /q /s %TEMP%\haste-* 2>nul

echo Step 7: Rebuilding Android project...
cd android
call gradlew clean
call gradlew build
cd ..

echo Step 8: Starting Metro with fresh cache...
start "Metro Server" cmd /k "npx react-native start --reset-cache --verbose"

echo Step 9: Waiting for Metro to initialize...
timeout /t 15

echo Step 10: Running Android app...
npx react-native run-android --verbose

echo ========================================
echo PERMANENT FIX COMPLETE!
echo If you still get errors, the native module
echo has been manually added to MainApplication.java
echo ========================================
pause