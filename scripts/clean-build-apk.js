#!/usr/bin/env node

/**
 * Clean Build APK Script
 * This script performs a complete clean build to ensure assets are properly bundled
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Starting clean APK build process...');

// Function to execute commands with proper error handling
function executeCommand(command, description) {
  console.log(`\n📋 ${description}`);
  console.log(`🔧 Running: ${command}`);
  
  try {
    execSync(command, { 
      stdio: 'inherit', 
      cwd: process.cwd(),
      env: { ...process.env, FORCE_COLOR: '1' }
    });
    console.log(`✅ ${description} completed successfully`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    throw error;
  }
}

// Function to clean directories
function cleanDirectory(dirPath, description) {
  if (fs.existsSync(dirPath)) {
    console.log(`🗑️  Cleaning ${description}...`);
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ ${description} cleaned successfully`);
    } catch (error) {
      console.error(`❌ Failed to clean ${description}:`, error.message);
    }
  } else {
    console.log(`ℹ️  ${description} doesn't exist, skipping...`);
  }
}

async function main() {
  try {
    // Step 1: Clean React Native cache
    console.log('\n🔄 Step 1: Cleaning React Native cache');
    executeCommand('npx react-native start --reset-cache', 'Reset Metro cache');
    
    // Wait a moment for cache reset
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 2: Clean Android build directories
    console.log('\n🔄 Step 2: Cleaning Android build directories');
    cleanDirectory('./android/app/build', 'Android app build directory');
    cleanDirectory('./android/build', 'Android build directory');
    cleanDirectory('./android/.gradle', 'Gradle cache');
    
    // Step 3: Clean node modules and reinstall
    console.log('\n🔄 Step 3: Cleaning and reinstalling dependencies');
    cleanDirectory('./node_modules', 'Node modules');
    executeCommand('npm install', 'Install dependencies');
    
    // Step 4: Link assets
    console.log('\n🔄 Step 4: Linking assets');
    executeCommand('npx react-native-asset', 'Link assets');
    
    // Step 5: Clean and build Android
    console.log('\n🔄 Step 5: Building Android APK');
    process.chdir('./android');
    
    executeCommand('./gradlew clean', 'Clean Android project');
    executeCommand('./gradlew assembleRelease', 'Build release APK');
    
    process.chdir('..');
    
    // Step 6: Locate and display APK info
    console.log('\n🔄 Step 6: Locating built APK');
    const apkPath = './android/app/build/outputs/apk/release/app-release.apk';
    
    if (fs.existsSync(apkPath)) {
      const stats = fs.statSync(apkPath);
      const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log('\n🎉 APK Build Successful!');
      console.log(`📱 APK Location: ${apkPath}`);
      console.log(`📏 APK Size: ${fileSizeInMB} MB`);
      console.log(`📅 Build Time: ${new Date().toLocaleString()}`);
      
      // Verify assets are bundled
      console.log('\n🔍 Verifying asset bundling...');
      executeCommand('npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/', 'Verify bundle creation');
      
      console.log('\n✅ Clean build completed successfully!');
      console.log('📝 The logo should now be properly bundled in the release APK.');
      
    } else {
      console.error('❌ APK not found at expected location');
      console.log('🔍 Checking alternative locations...');
      
      // Check for other possible APK locations
      const possiblePaths = [
        './android/app/build/outputs/apk/release/',
        './android/app/build/outputs/apk/',
      ];
      
      for (const dir of possiblePaths) {
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          const apkFiles = files.filter(file => file.endsWith('.apk'));
          if (apkFiles.length > 0) {
            console.log(`📱 Found APK(s) in ${dir}:`);
            apkFiles.forEach(file => console.log(`   - ${file}`));
          }
        }
      }
    }
    
  } catch (error) {
    console.error('\n❌ Build process failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure Android SDK is properly installed');
    console.log('2. Check that ANDROID_HOME environment variable is set');
    console.log('3. Ensure you have the required Android build tools');
    console.log('4. Try running the commands manually if the script fails');
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);