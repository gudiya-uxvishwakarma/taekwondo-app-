@echo off
echo 🚨 ULTIMATE FIX: React Native App Registration Error
echo ====================================================

echo.
echo 🔧 Step 1: Kill all processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq Metro*" 2>nul
echo ✅ Processes killed

echo.
echo 🧹 Step 2: Remove problematic node_modules...
rmdir /s /q node_modules 2>nul
echo ✅ node_modules removed

echo.
echo 🧹 Step 3: Clean all caches...
rmdir /s /q %TEMP%\metro-* 2>nul
rmdir /s /q %TEMP%\react-* 2>nul
rmdir /s /q %TEMP%\haste-* 2>nul
rmdir /s /q %APPDATA%\npm-cache 2>nul
echo ✅ Caches cleaned

echo.
echo 📦 Step 4: Fresh install dependencies...
npm install
echo ✅ Dependencies installed

echo.
echo 🧹 Step 5: Clean Android build...
cd android
call gradlew clean
cd ..
echo ✅ Android build cleaned

echo.
echo 🔄 Step 6: Reset ADB...
adb kill-server
adb start-server
echo ✅ ADB reset

echo.
echo 📱 Step 7: Check device connection...
adb devices

echo.
echo ✅ ULTIMATE FIX COMPLETE!
echo.
echo 🚀 Now run these commands in SEPARATE terminals:
echo.
echo Terminal 1 (Start Metro):
echo    npx react-native start --reset-cache
echo.
echo Terminal 2 (Run Android - wait 30 seconds after Metro starts):
echo    npx react-native run-android
echo.
echo 💡 IMPORTANT:
echo - Wait for Metro to show "Metro waiting on port 8081"
echo - Then wait 30 more seconds before running Android
echo - If still failing, try on a physical device
echo.
pause