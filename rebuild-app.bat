@echo off
echo ========================================
echo Rebuilding React Native App
echo ========================================
echo.

echo Step 1: Stopping Metro bundler...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo.
echo Step 2: Clearing Metro cache...
call npm start -- --reset-cache &
timeout /t 5 >nul
taskkill /F /IM node.exe 2>nul

echo.
echo Step 3: Cleaning Android build...
cd android
call gradlew clean
cd ..

echo.
echo Step 4: Rebuilding Android app...
call npx react-native run-android

echo.
echo ========================================
echo Rebuild complete!
echo ========================================
pause
