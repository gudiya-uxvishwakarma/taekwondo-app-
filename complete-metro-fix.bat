@echo off
echo ========================================
echo    COMPLETE METRO BUNDLER FIX
echo ========================================
echo.

echo Step 1: Killing all Node.js processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im "Metro Bundler" 2>nul
timeout /t 3 >nul

echo Step 2: Clearing all React Native caches...
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

echo Step 3: Clearing Watchman cache...
npx watchman watch-del-all 2>nul

echo Step 4: Clearing React Native cache...
npx react-native start --reset-cache --port 8081

echo.
echo ========================================
echo    METRO FIX COMPLETE!
echo ========================================
echo.
echo Now open a NEW terminal and run:
echo npx react-native run-android
echo.
pause