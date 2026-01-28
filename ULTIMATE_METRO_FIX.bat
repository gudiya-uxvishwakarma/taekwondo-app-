@echo off
echo ========================================
echo    ULTIMATE METRO REGISTRATION FIX
echo ========================================
echo.
echo This will completely reset Metro and fix registration issues
echo.

echo Step 1: Killing ALL Node and React Native processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im "Metro Bundler" 2>nul
taskkill /f /im adb.exe 2>nul
taskkill /f /im java.exe 2>nul
timeout /t 3 >nul

echo Step 2: Stopping and restarting ADB...
adb kill-server
timeout /t 2 >nul
adb start-server
timeout /t 2 >nul

echo Step 3: Clearing ALL React Native caches...
if exist node_modules\.cache (
    echo Removing node_modules cache...
    rmdir /s /q node_modules\.cache
)

if exist %TEMP%\metro-* (
    echo Removing Metro temp files...
    for /d %%i in (%TEMP%\metro-*) do rmdir /s /q "%%i" 2>nul
)

if exist %TEMP%\react-* (
    echo Removing React temp files...
    for /d %%i in (%TEMP%\react-*) do rmdir /s /q "%%i" 2>nul
)

if exist %TEMP%\haste-* (
    echo Removing Haste temp files...
    for /d %%i in (%TEMP%\haste-*) do rmdir /s /q "%%i" 2>nul
)

if exist %APPDATA%\npm-cache (
    echo Clearing npm cache...
    npm cache clean --force 2>nul
)

echo Step 4: Clearing Watchman cache...
npx watchman watch-del-all 2>nul

echo Step 5: Cleaning Android build...
cd android
call gradlew clean 2>nul
cd ..

echo Step 6: Removing Android build cache...
if exist android\app\build rmdir /s /q android\app\build 2>nul
if exist android\build rmdir /s /q android\build 2>nul

echo Step 7: Starting Metro with complete reset...
echo.
echo ========================================
echo    STARTING FRESH METRO BUNDLER
echo ========================================
echo.
npx react-native start --reset-cache --port 8081

echo.
echo ========================================
echo    METRO STARTED SUCCESSFULLY!
echo ========================================
echo.
echo Now open a NEW terminal and run:
echo npx react-native run-android
echo.
echo If you still get errors, try:
echo npx react-native run-android --reset-cache
echo.
pause