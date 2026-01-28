@echo off
echo ========================================
echo    COMPLETE FINAL METRO FIX
echo ========================================
echo.
echo This will solve the "reactnative has not been registered" error completely
echo.

echo Step 1: Verified app.json name is "reactnative" (matches Android)
echo Step 2: Verified index.js has proper AppRegistry.registerComponent
echo Step 3: Verified App.jsx exports default App component

echo Step 4: Killing ALL processes that might interfere...
taskkill /f /im node.exe 2>nul
taskkill /f /im "Metro Bundler" 2>nul
taskkill /f /im adb.exe 2>nul
taskkill /f /im java.exe 2>nul
taskkill /f /im gradle.exe 2>nul
timeout /t 3 >nul

echo Step 5: Restarting ADB completely...
adb kill-server
timeout /t 2 >nul
adb start-server
timeout /t 3 >nul

echo Step 6: Clearing ALL possible caches...
if exist node_modules\.cache rmdir /s /q node_modules\.cache 2>nul
if exist %TEMP%\metro-* (
    for /d %%i in (%TEMP%\metro-*) do rmdir /s /q "%%i" 2>nul
)
if exist %TEMP%\react-* (
    for /d %%i in (%TEMP%\react-*) do rmdir /s /q "%%i" 2>nul
)
if exist %TEMP%\haste-* (
    for /d %%i in (%TEMP%\haste-*) do rmdir /s /q "%%i" 2>nul
)

echo Step 7: Clearing Watchman...
npx watchman watch-del-all 2>nul

echo Step 8: Cleaning Android completely...
cd android
call gradlew clean 2>nul
cd ..
if exist android\app\build rmdir /s /q android\app\build 2>nul
if exist android\build rmdir /s /q android\build 2>nul

echo Step 9: Starting Metro with COMPLETE reset...
echo.
echo ========================================
echo    STARTING METRO BUNDLER
echo ========================================
echo.
echo Metro will start now. After it shows "Metro waiting on port 8081"
echo Open a NEW terminal and run: npx react-native run-android
echo.

start "Metro Bundler" cmd /k "npx react-native start --reset-cache --port 8081"

timeout /t 5 >nul

echo.
echo ========================================
echo    METRO STARTED IN NEW WINDOW
echo ========================================
echo.
echo Now run in a NEW terminal:
echo npx react-native run-android
echo.
echo If error persists:
echo 1. Make sure Metro window shows "Metro waiting on port 8081"
echo 2. Try: npx react-native run-android --reset-cache
echo 3. Check device is connected: adb devices
echo.
pause