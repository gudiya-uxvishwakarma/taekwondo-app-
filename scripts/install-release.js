#!/usr/bin/env node

/**
 * Release APK Installation Script
 * Helps install and verify the release APK
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📱 Release APK Installation Helper\n');

const apkPath = path.join(__dirname, '../android/app/build/outputs/apk/release/app-release.apk');

// Check if APK exists
if (!fs.existsSync(apkPath)) {
  console.log('❌ Release APK not found!');
  console.log('📋 Run this first: npm run build-release');
  process.exit(1);
}

console.log('✅ Release APK found:', apkPath);

// Get APK info
const stats = fs.statSync(apkPath);
const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
console.log(`📦 APK Size: ${sizeInMB} MB`);
console.log(`📅 Built: ${stats.mtime.toLocaleString()}\n`);

// Check for connected devices
try {
  const devices = execSync('adb devices', { encoding: 'utf8' });
  console.log('📱 Connected devices:');
  console.log(devices);
  
  if (!devices.includes('device')) {
    console.log('⚠️  No devices connected or authorized');
    console.log('💡 Connect your device and enable USB debugging');
    console.log('💡 Or start an emulator');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ ADB not found or not in PATH');
  console.log('💡 Make sure Android SDK is installed and ADB is in PATH');
  process.exit(1);
}

console.log('🚀 Installation commands:');
console.log('1. Uninstall old version (if exists):');
console.log('   adb uninstall com.reactnative');
console.log('');
console.log('2. Install release APK:');
console.log(`   adb install "${apkPath}"`);
console.log('');
console.log('3. Launch the app:');
console.log('   adb shell am start -n com.reactnative/.MainActivity');
console.log('');
console.log('🔍 To check if logo displays:');
console.log('1. Open the app on your device');
console.log('2. Check the login screen for the taekwondo logo');
console.log('3. Navigate through the app to verify all logos display');
console.log('');
console.log('📋 If logo still doesn\'t show:');
console.log('1. Check device logs: adb logcat | findstr ReactNativeJS');
console.log('2. Look for image loading errors');
console.log('3. Verify asset was bundled correctly');

// Optionally auto-install if user wants
console.log('\n❓ Want to auto-install? (This will uninstall existing version)');
console.log('💡 Run: node scripts/install-release.js --install');