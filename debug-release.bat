@echo off
echo ========================================
echo React Native Release Debug Script
echo ========================================

echo.
echo [1] Installing APK on device...
adb install -r android\app\build\outputs\apk\release\app-release.apk
if %errorlevel% neq 0 (
    echo ERROR: Failed to install APK
    echo Make sure your device is connected and USB debugging is enabled
    pause
    exit /b 1
)

echo.
echo [2] Starting app...
adb shell am start -n com.reactnative/.MainActivity

echo.
echo [3] Monitoring logs (Press Ctrl+C to stop)...
echo Filtering for React Native and app-specific logs...
adb logcat | findstr /i "ReactNativeJS\|com.reactnative\|AndroidRuntime\|System.err"

pause