@echo off
echo Fixing Metro Bundler Registration Issue...
echo.

echo Step 1: Stopping any running Metro processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 >nul

echo Step 2: Clearing Metro cache...
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist %TEMP%\metro-* rmdir /s /q %TEMP%\metro-*
if exist %TEMP%\react-* rmdir /s /q %TEMP%\react-*

echo Step 3: Clearing React Native cache...
npx react-native start --reset-cache --port 8081

echo.
echo Metro bundler restarted with cleared cache!
echo Now run your app again with: npx react-native run-android
pause