@echo off
echo 🧹 Cleaning Android build...
cd android
call gradlew clean
cd ..

echo 🗑️ Clearing Metro cache...
start /B npx react-native start --reset-cache

echo ⏳ Waiting for Metro to start...
timeout /t 5 /nobreak

echo 🔨 Building and installing app...
npx react-native run-android

echo ✅ Done! The app should now be running with updated network configuration.
pause
