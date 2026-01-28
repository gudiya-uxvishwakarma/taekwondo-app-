@echo off
echo 🔗 Setting up sharing dependencies...

echo.
echo 📱 React Native Share - Auto-linking enabled (no manual linking needed)
echo 📁 React Native FS - Auto-linking enabled (no manual linking needed)  
echo 📸 React Native ViewShot - Auto-linking enabled (no manual linking needed)

echo.
echo 🧹 Cleaning build cache...
cd android
call gradlew clean
cd ..

echo.
echo ✅ All sharing dependencies are ready!
echo.
echo 🚀 You can now run: npm run android
pause