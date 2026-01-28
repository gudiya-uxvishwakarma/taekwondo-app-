@echo off
echo 🚨 QUICK FIX: React Native App Registration Error
echo.

echo 🔧 Step 1: Kill any running Metro processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq Metro*" 2>nul

echo.
echo 🧹 Step 2: Clean Metro cache...
rmdir /s /q node_modules\.cache 2>nul
rmdir /s /q %TEMP%\metro-* 2>nul
rmdir /s /q %TEMP%\react-* 2>nul

echo.
echo 🧹 Step 3: Clean Android build...
cd android
call gradlew clean
cd ..

echo.
echo 🔄 Step 4: Restart ADB...
adb kill-server
adb start-server

echo.
echo 📱 Step 5: Check device connection...
adb devices

echo.
echo ✅ Quick fix complete!
echo.
echo 🚀 Now run these commands in separate terminals:
echo    Terminal 1: npx react-native start --reset-cache
echo    Terminal 2: npx react-native run-android
echo.
pause