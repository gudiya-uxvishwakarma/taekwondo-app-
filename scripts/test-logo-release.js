#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Logo in Release Build...\n');

async function testLogo() {
  try {
    console.log('1️⃣ Checking asset configuration...');
    execSync('npm run check-logo', { stdio: 'inherit' });
    
    console.log('\n2️⃣ Cleaning previous builds...');
    execSync('cd android && gradlew clean', { stdio: 'inherit' });
    
    console.log('\n3️⃣ Building release APK...');
    execSync('cd android && gradlew assembleRelease', { stdio: 'inherit' });
    
    // Check if APK was created
    const apkPath = path.join(__dirname, '../android/app/build/outputs/apk/release/app-release.apk');
    if (fs.existsSync(apkPath)) {
      const stats = fs.statSync(apkPath);
      const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log('\n✅ Release APK built successfully!');
      console.log(`📱 APK Location: ${apkPath}`);
      console.log(`📊 APK Size: ${fileSizeInMB} MB`);
      
      console.log('\n🧪 Logo Test Instructions:');
      console.log('1. Install APK: adb install android/app/build/outputs/apk/release/app-release.apk');
      console.log('2. Open the app and check if the logo appears on the login screen');
      console.log('3. If logo doesn\'t appear, you should see a 🥋 emoji fallback');
      console.log('4. Check logs: adb logcat | findstr ReactNativeJS');
      
      console.log('\n🔍 Logo Loading Strategies Used:');
      console.log('✅ Strategy 1: Centralized asset management (images.taekwondoLogo)');
      console.log('✅ Strategy 2: Direct require() fallback');
      console.log('✅ Strategy 3: Android drawable resource (Android only)');
      console.log('✅ Strategy 4: Emoji fallback (🥋) if all strategies fail');
      
      console.log('\n📋 If logo still doesn\'t work:');
      console.log('- The fallback emoji (🥋) should always appear');
      console.log('- Check adb logcat for any error messages');
      console.log('- Verify the logo file exists in src/assets/taekwondo-logo.jpg');
      
    } else {
      console.error('❌ APK file not found. Build may have failed.');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Logo test failed:', error.message);
    process.exit(1);
  }
}

testLogo();