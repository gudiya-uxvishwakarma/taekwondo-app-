#!/bin/bash

echo "🧹 Cleaning Android build..."
cd android
./gradlew clean
cd ..

echo "🗑️ Clearing Metro cache..."
npx react-native start --reset-cache &
METRO_PID=$!

echo "⏳ Waiting for Metro to start..."
sleep 5

echo "🔨 Building and installing app..."
npx react-native run-android

echo "✅ Done! The app should now be running with updated network configuration."
