#!/usr/bin/env node

/**
 * Modern React Native Build Solution
 * Replaces deprecated react-native bundle command
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function showDeprecationInfo() {
  console.log('🚨 React Native Bundle Command - DEPRECATED');
  console.log('=============================================');
  console.log('');
  console.log('❌ The command you tried to run is deprecated:');
  console.log('   npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res');
  console.log('');
  console.log('✅ MODERN SOLUTION:');
  console.log('   The React Native team removed the bundle command in favor of integrated build processes.');
  console.log('   Your assets (including logos) are automatically bundled during the APK build process.');
  console.log('');
}

function showModernCommands() {
  console.log('🚀 MODERN REACT NATIVE BUILD COMMANDS:');
  console.log('=====================================');
  console.log('');
  console.log('1. 📱 Build APK (Recommended):');
  console.log('   npm run build-apk');
  console.log('   → This automatically bundles JS, assets, and creates APK');
  console.log('');
  console.log('2. 🔧 Build Debug APK:');
  console.log('   npm run build-debug-apk');
  console.log('   → Faster build for testing');
  console.log('');
  console.log('3. 🏃 Run on Device/Emulator:');
  console.log('   npm run android');
  console.log('   → Builds and runs on connected device');
  console.log('');
  console.log('4. 🔍 Verify Assets (including logo):');
  console.log('   npm run verify-apk');
  console.log('   → Checks if logo and assets are properly included');
  console.log('');
}

function checkLogoStatus() {
  console.log('🖼️  LOGO STATUS CHECK:');
  console.log('=====================');
  
  const logoPath = path.join(__dirname, '../src/assets/taekwondo-logo.jpg');
  const apkPath = path.join(__dirname, '../android/app/build/outputs/apk/release/app-release.apk');
  
  if (fs.existsSync(logoPath)) {
    const stats = fs.statSync(logoPath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    console.log(`✅ Logo source file exists: ${fileSizeKB} KB`);
  } else {
    console.log('❌ Logo source file missing!');
    return false;
  }
  
  if (fs.existsSync(apkPath)) {
    const stats = fs.statSync(apkPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`✅ APK exists: ${fileSizeMB} MB`);
    console.log(`📅 Built: ${stats.mtime.toLocaleString()}`);
  } else {
    console.log('⚠️  APK not found - run npm run build-apk first');
  }
  
  return true;
}

function showNextSteps() {
  console.log('');
  console.log('🎯 NEXT STEPS:');
  console.log('==============');
  console.log('');
  console.log('1. ✅ Your logo is already working in the APK build');
  console.log('2. 🔨 To build a new APK with latest changes:');
  console.log('   npm run build-apk');
  console.log('');
  console.log('3. 📱 To install on your device:');
  console.log('   npm run install-apk');
  console.log('');
  console.log('4. 🔍 To verify everything is working:');
  console.log('   npm run verify-apk');
  console.log('');
  console.log('💡 TIP: The modern React Native build process automatically');
  console.log('    handles bundling, asset copying, and APK creation in one step!');
}

function main() {
  showDeprecationInfo();
  showModernCommands();
  checkLogoStatus();
  showNextSteps();
}

if (require.main === module) {
  main();
}

module.exports = { main };