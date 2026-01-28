@echo off
echo 🚨 COMPLETE FIX: React Native App Registration Error
echo =====================================================

echo.
echo 🔧 Step 1: Kill all Node and Metro processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq Metro*" 2>nul
echo ✅ Processes killed

echo.
echo 🧹 Step 2: Clean all caches...
rmdir /s /q node_modules\.cache 2>nul
rmdir /s /q %TEMP%\metro-* 2>nul
rmdir /s /q %TEMP%\react-* 2>nul
rmdir /s /q %TEMP%\haste-* 2>nul
echo ✅ Metro cache cleaned

echo.
echo 🧹 Step 3: Clean Android build...
cd android
call gradlew clean
cd ..
echo ✅ Android build cleaned

echo.
echo 🔄 Step 4: Reset ADB...
adb kill-server
adb start-server
echo ✅ ADB reset

echo.
echo 📱 Step 5: Check device connection...
adb devices
echo.

echo.
echo 🔍 Step 6: Verify app structure...
if exist "App.jsx" (
    echo ✅ App.jsx exists
) else (
    echo ❌ App.jsx missing
)

if exist "index.js" (
    echo ✅ index.js exists
) else (
    echo ❌ index.js missing
)

if exist "app.json" (
    echo ✅ app.json exists
) else (
    echo ❌ app.json missing
)

if exist "package.json" (
    echo ✅ package.json exists
) else (
    echo ❌ package.json missing
)

echo.
echo 🔧 Step 7: Reinstall node_modules (if needed)...
if not exist "node_modules" (
    echo Installing node_modules...
    npm install
) else (
    echo ✅ node_modules exists
)

echo.
echo ✅ COMPLETE FIX FINISHED!
echo.
echo 🚀 Now run these commands in SEPARATE terminals:
echo.
echo Terminal 1 (Start Metro):
echo    npx react-native start --reset-cache
echo.
echo Terminal 2 (Run Android - wait for Metro to start first):
echo    npx react-native run-android
echo.
echo 💡 IMPORTANT NOTES:
echo - Wait for Metro to fully start before running Android
echo - Make sure your device/emulator is connected
echo - If still failing, try running on a physical device
echo.
pause