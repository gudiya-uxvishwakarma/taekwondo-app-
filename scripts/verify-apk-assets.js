#!/usr/bin/env node

/**
 * APK Asset Verification Script
 * Verifies that assets are properly included in the APK build
 */

const fs = require('fs');
const path = require('path');

function checkAPKExists() {
  const apkPath = path.join(__dirname, '../android/app/build/outputs/apk/release/app-release.apk');
  
  if (fs.existsSync(apkPath)) {
    const stats = fs.statSync(apkPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log('✅ APK Build Successful!');
    console.log(`📱 APK Location: ${apkPath}`);
    console.log(`📊 APK Size: ${fileSizeMB} MB`);
    console.log(`📅 Build Date: ${stats.mtime.toLocaleString()}`);
    return true;
  } else {
    console.log('❌ APK not found. Please run the build first.');
    return false;
  }
}

function checkAssetsCopied() {
  console.log('\n🔍 Checking copied assets...');
  
  const assetsDir = path.join(__dirname, '../android/app/src/main/assets/assets');
  
  if (!fs.existsSync(assetsDir)) {
    console.log('❌ Assets directory not found in Android build');
    return false;
  }
  
  const requiredAssets = [
    'taekwondo-logo.jpg'
  ];
  
  let allAssetsFound = true;
  
  requiredAssets.forEach(asset => {
    const assetPath = path.join(assetsDir, asset);
    if (fs.existsSync(assetPath)) {
      const stats = fs.statSync(assetPath);
      const fileSizeKB = (stats.size / 1024).toFixed(2);
      console.log(`✅ ${asset} (${fileSizeKB} KB)`);
    } else {
      console.log(`❌ Missing: ${asset}`);
      allAssetsFound = false;
    }
  });
  
  return allAssetsFound;
}

function checkSourceAssets() {
  console.log('\n🔍 Checking source assets...');
  
  const assetsDir = path.join(__dirname, '../src/assets');
  const requiredAssets = [
    'taekwondo-logo.jpg'
  ];
  
  let allAssetsFound = true;
  
  requiredAssets.forEach(asset => {
    const assetPath = path.join(assetsDir, asset);
    if (fs.existsSync(assetPath)) {
      const stats = fs.statSync(assetPath);
      const fileSizeKB = (stats.size / 1024).toFixed(2);
      console.log(`✅ ${asset} (${fileSizeKB} KB)`);
    } else {
      console.log(`❌ Missing: ${asset}`);
      allAssetsFound = false;
    }
  });
  
  return allAssetsFound;
}

function generateInstallInstructions() {
  console.log('\n📱 Installation Instructions:');
  console.log('============================');
  console.log('1. Enable "Unknown Sources" on your Android device');
  console.log('2. Copy the APK to your device');
  console.log('3. Install using one of these methods:');
  console.log('');
  console.log('Method 1 - ADB Install:');
  console.log('   adb install android/app/build/outputs/apk/release/app-release.apk');
  console.log('');
  console.log('Method 2 - Manual Install:');
  console.log('   - Copy APK to device storage');
  console.log('   - Open file manager and tap the APK');
  console.log('   - Follow installation prompts');
  console.log('');
  console.log('Method 3 - USB Transfer:');
  console.log('   - Connect device via USB');
  console.log('   - Copy APK to Downloads folder');
  console.log('   - Install from device');
}

function main() {
  console.log('🚀 APK Asset Verification');
  console.log('=========================');
  
  const apkExists = checkAPKExists();
  const sourceAssetsOK = checkSourceAssets();
  const copiedAssetsOK = checkAssetsCopied();
  
  console.log('\n📋 Summary:');
  console.log('===========');
  console.log(`APK Build: ${apkExists ? '✅ Success' : '❌ Failed'}`);
  console.log(`Source Assets: ${sourceAssetsOK ? '✅ All Found' : '❌ Missing Assets'}`);
  console.log(`Copied Assets: ${copiedAssetsOK ? '✅ All Found' : '❌ Missing Assets'}`);
  
  if (apkExists && sourceAssetsOK && copiedAssetsOK) {
    console.log('\n🎉 Logo APK Fix Successful!');
    console.log('The logo should now display properly in the APK build.');
    generateInstallInstructions();
  } else {
    console.log('\n⚠️  Issues Found:');
    if (!apkExists) console.log('- APK build failed or not found');
    if (!sourceAssetsOK) console.log('- Source assets missing');
    if (!copiedAssetsOK) console.log('- Assets not properly copied to Android build');
    
    console.log('\n🔧 Recommended Actions:');
    console.log('1. Run: npm run verify-assets');
    console.log('2. Run: npm run link-assets');
    console.log('3. Run: npm run build-apk');
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkAPKExists, checkAssetsCopied, checkSourceAssets };