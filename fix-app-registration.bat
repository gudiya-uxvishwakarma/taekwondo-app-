@echo off
echo 🔧 Fixing React Native App Registration Issue...

echo.
echo 🧹 Cleaning Metro cache...
npx react-native start --reset-cache --port 8081 &

echo.
echo 🧹 Cleaning Android build...
cd android
call gradlew clean
cd ..

echo.
echo 🔄 Restarting ADB...
adb kill-server
adb start-server

echo.
echo ✅ App registration fix complete!
echo.
echo 🚀 Now run: npm run android
pause