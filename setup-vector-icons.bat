@echo off
echo ========================================
echo React Native Vector Icons Setup Script
echo ========================================

echo.
echo [1/3] Creating fonts directory...
if not exist "android\app\src\main\assets\fonts" (
    mkdir android\app\src\main\assets\fonts
    echo Created fonts directory
) else (
    echo Fonts directory already exists
)

echo.
echo [2/3] Copying vector icon fonts...
copy "node_modules\react-native-vector-icons\Fonts\*" "android\app\src\main\assets\fonts\" /Y
if %errorlevel% equ 0 (
    echo Successfully copied vector icon fonts
) else (
    echo ERROR: Failed to copy vector icon fonts
    pause
    exit /b 1
)

echo.
echo [3/3] Verifying font files...
dir android\app\src\main\assets\fonts\*.ttf /b
echo.

echo ========================================
echo Vector Icons Setup Complete!
echo ========================================
echo.
echo The following icon families are now available:
echo - MaterialIcons
echo - MaterialCommunityIcons  
echo - Ionicons
echo - FontAwesome
echo - FontAwesome5
echo - AntDesign
echo - Feather
echo - Entypo
echo.
echo You can test the icons by:
echo 1. Running the app: npm run android
echo 2. Tapping the bug icon in the dashboard header
echo 3. Viewing the vector icons test screen
echo.
pause