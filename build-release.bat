@echo off
echo ========================================
echo React Native Release Build Script
echo ========================================

echo.
echo [1/6] Cleaning previous builds...
call npm run android-deep-clean
if %errorlevel% neq 0 (
    echo ERROR: Failed to clean Android build
    pause
    exit /b 1
)

echo.
echo [2/6] Clearing Metro cache...
call npx metro serve --port 8081 --reset-cache &
timeout /t 3 /nobreak > nul
taskkill /f /im node.exe 2>nul

echo.
echo [3/6] Preparing assets directory...
rmdir /s /q android\app\src\main\assets 2>nul
mkdir android\app\src\main\assets

echo.
echo [4/6] Building JavaScript bundle...
call npx metro build index.js --platform android --dev false --out android/app/src/main/assets/index.android.bundle
if %errorlevel% neq 0 (
    echo ERROR: Failed to build JavaScript bundle
    pause
    exit /b 1
)

echo.
echo [5/6] Building Android APK...
cd android
call gradlew clean
call gradlew assembleRelease --stacktrace
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Android APK
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [6/6] Build completed successfully!
echo APK location: android\app\build\outputs\apk\release\app-release.apk

echo.
echo Checking APK size...
for %%I in (android\app\build\outputs\apk\release\app-release.apk) do echo APK Size: %%~zI bytes

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
pause