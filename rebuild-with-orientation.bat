@echo off
echo Rebuilding Android app with orientation support...

echo Step 1: Cleaning previous build...
cd android
call gradlew clean
cd ..

echo Step 2: Clearing React Native cache...
npx react-native start --reset-cache &

echo Step 3: Building Android app...
npx react-native run-android

echo Build complete! The app should now support orientation changes.
pause