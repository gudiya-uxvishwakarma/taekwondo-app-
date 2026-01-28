@echo off
echo Setting up network for React Native...

echo.
echo 1. Setting up ADB port forwarding...
adb reverse tcp:5000 tcp:5000
if %errorlevel% equ 0 (
    echo ✅ ADB port forwarding set up successfully
) else (
    echo ❌ ADB port forwarding failed - make sure device/emulator is connected
)

echo.
echo 2. Checking ADB devices...
adb devices

echo.
echo 3. Testing backend connection...
curl -s http://localhost:5000/api/health
if %errorlevel% equ 0 (
    echo ✅ Backend is running
) else (
    echo ❌ Backend is not running - please start the backend server
)

echo.
echo Network setup complete!
echo.
echo If you're still having issues:
echo 1. Make sure your backend server is running on port 5000
echo 2. Make sure your Android emulator/device is connected
echo 3. Try restarting the React Native metro server
echo.
pause