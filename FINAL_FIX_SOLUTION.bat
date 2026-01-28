@echo off
echo ========================================
echo    FINAL COMPLETE FIX SOLUTION
echo ========================================
echo.
echo Fixing both Metro registration and share functionality...
echo.

echo Step 1: Stopping all processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im adb.exe 2>nul
timeout /t 2 >nul

echo Step 2: Fixed app.json name mismatch (reactnative -> student-app)
echo Step 3: Updated certificate verification share functionality
echo Step 4: Added proper WhatsApp sharing with ViewShot

echo Step 5: Clearing all caches...
if exist node_modules\.cache rmdir /s /q node_modules\.cache 2>nul
if exist %TEMP%\metro-* (
    for /d %%i in (%TEMP%\metro-*) do rmdir /s /q "%%i" 2>nul
)
if exist %TEMP%\react-* (
    for /d %%i in (%TEMP%\react-*) do rmdir /s /q "%%i" 2>nul
)

echo Step 6: Restarting ADB...
adb kill-server
adb start-server

echo Step 7: Starting Metro with clean cache...
echo.
echo ========================================
echo    STARTING METRO BUNDLER
echo ========================================
npx react-native start --reset-cache --port 8081

echo.
echo After Metro starts, open NEW terminal and run:
echo npx react-native run-android
echo.
pause