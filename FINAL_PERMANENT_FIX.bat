@echo off
echo ========================================
echo FINAL PERMANENT FIX - REMOVING PROBLEMATIC MODULES
echo ========================================

echo Step 1: Stopping all processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im java.exe 2>nul
taskkill /f /im adb.exe 2>nul

echo Step 2: Removing react-native-view-shot completely...
npm uninstall react-native-view-shot

echo Step 3: Cleaning Android build...
cd android
call gradlew clean
cd ..

echo Step 4: Clearing all caches...
npm cache clean --force
del /q /s %TEMP%\metro-* 2>nul
del /q /s %TEMP%\react-* 2>nul

echo Step 5: Starting Metro fresh...
start "Metro" cmd /k "npx react-native start --reset-cache"

echo Step 6: Waiting for Metro...
timeout /t 10

echo Step 7: Running app...
npx react-native run-android

echo ========================================
echo DONE! ViewShot removed - app should work now
echo ========================================
pause