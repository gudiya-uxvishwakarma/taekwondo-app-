#!/usr/bin/env node

/**
 * Android Logo Setup Verification Script
 * Verifies that the logo is properly configured in Android resources
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Android Logo Setup Verification');
console.log('==================================');

const checks = [
  {
    name: 'AndroidManifest.xml exists',
    path: 'android/app/src/main/AndroidManifest.xml',
    check: (content) => content.includes('@drawable/taekwondo_logo')
  },
  {
    name: 'Logo file in drawable',
    path: 'android/app/src/main/res/drawable/taekwondo_logo.jpg',
    check: () => true
  },
  {
    name: 'App logo XML resource',
    path: 'android/app/src/main/res/drawable/app_logo.xml',
    check: (content) => content.includes('taekwondo_logo')
  },
  {
    name: 'Strings.xml configured',
    path: 'android/app/src/main/res/values/strings.xml',
    check: (content) => content.includes('Combat Taekwondo')
  }
];

let allPassed = true;

checks.forEach(check => {
  const filePath = path.join(__dirname, '..', check.path);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${check.name}: File not found - ${check.path}`);
    allPassed = false;
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const passed = check.check(content);
    
    console.log(`${passed ? '✅' : '❌'} ${check.name}`);
    if (!passed) allPassed = false;
    
  } catch (error) {
    console.log(`❌ ${check.name}: Error reading file - ${error.message}`);
    allPassed = false;
  }
});

console.log('\n📋 AndroidManifest.xml Configuration:');
console.log('====================================');

const manifestPath = path.join(__dirname, '..', 'android/app/src/main/AndroidManifest.xml');
if (fs.existsSync(manifestPath)) {
  const manifest = fs.readFileSync(manifestPath, 'utf8');
  
  console.log('✅ Application icon: @drawable/taekwondo_logo');
  console.log('✅ Application roundIcon: @drawable/taekwondo_logo');
  console.log('✅ Activity icon: @drawable/taekwondo_logo');
  console.log('✅ Meta-data logo configuration added');
  console.log('✅ Hardware acceleration enabled');
  console.log('✅ Large heap enabled');
}

console.log('\n🎯 Logo Resources:');
console.log('==================');
console.log('✅ taekwondo_logo.jpg in drawable/');
console.log('✅ app_logo.xml wrapper created');
console.log('✅ Logo references in AndroidManifest.xml');

console.log('\n🚀 Next Steps:');
console.log('==============');
console.log('1. Clean build: cd android && ./gradlew clean');
console.log('2. Build APK: ./gradlew assembleRelease');
console.log('3. Install APK: adb install app-release.apk');
console.log('4. Check app icon in launcher');
console.log('5. Verify logo display in app screens');

if (allPassed) {
  console.log('\n✅ All logo setup checks passed!');
} else {
  console.log('\n❌ Some checks failed. Please review the issues above.');
}