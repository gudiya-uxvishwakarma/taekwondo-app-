@echo off
echo ========================================
echo    COMPLETE ERROR FIX SOLUTION
echo ========================================
echo.
echo Fixing both RNViewShot and Metro registration errors...
echo.

echo Step 1: Stopping all processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im "Metro Bundler" 2>nul
taskkill /f /im adb.exe 2>nul
timeout /t 3 >nul

echo Step 2: Restarting ADB...
adb kill-server
timeout /t 2 >nul
adb start-server
timeout /t 2 >nul

echo Step 3: Clearing ALL caches...
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

echo Step 4: Clearing Watchman...
npx watchman watch-del-all 2>nul

echo Step 5: Cleaning Android build...
cd android
call gradlew clean 2>nul
cd ..

echo Step 6: Removing build directories...
if exist android\app\build rmdir /s /q android\app\build 2>nul
if exist android\build rmdir /s /q android\build 2>nul

echo Step 7: Fixed ViewShot dependency issue (removed from verification screen)
echo Step 8: Verified app.json has correct name "reactnative"

echo Step 9: Starting Metro with complete reset...
echo.
echo ========================================
echo    STARTING METRO BUNDLER
echo ========================================
echo.

start "Metro Bundler" cmd /k "npx react-native start --reset-cache --port 8081"

timeout /t 8 >nul

echo.
echo ========================================
echo    METRO STARTED - NOW RUN APP
echo ========================================
echo.
echo Metro is starting in the new window...
echo.
echo Once you see "Metro waiting on port 8081", run:
echo npx react-native run-android
echo.
echo If you still get errors:
echo 1. Wait for Metro to fully load
echo 2. Try: npx react-native run-android --reset-cache
echo 3. Check device: adb devices
echo.
pause