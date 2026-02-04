#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Ensuring logo assets are properly configured...\n');

const checks = [
  {
    name: 'Source logo file',
    path: 'src/assets/taekwondo-logo.jpg',
    required: true
  },
  {
    name: 'Assets index file',
    path: 'src/assets/index.js',
    required: true
  },
  {
    name: 'Android drawable logo',
    path: 'android/app/src/main/res/drawable/taekwondo_logo.jpg',
    required: false
  },
  {
    name: 'Metro config',
    path: 'metro.config.js',
    required: true
  },
  {
    name: 'React Native config',
    path: 'react-native.config.js',
    required: true
  }
];

let allGood = true;

for (const check of checks) {
  const fullPath = path.join(__dirname, '..', check.path);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ ${check.name}: Found`);
  } else {
    if (check.required) {
      console.log(`❌ ${check.name}: Missing (REQUIRED)`);
      allGood = false;
    } else {
      console.log(`⚠️  ${check.name}: Missing (optional)`);
    }
  }
}

// Check assets index content
const assetsIndexPath = path.join(__dirname, '..', 'src/assets/index.js');
if (fs.existsSync(assetsIndexPath)) {
  const content = fs.readFileSync(assetsIndexPath, 'utf8');
  if (content.includes('taekwondoLogo') && content.includes('require')) {
    console.log('✅ Assets index: Properly configured');
  } else {
    console.log('❌ Assets index: Not properly configured');
    allGood = false;
  }
}

// Check metro config
const metroConfigPath = path.join(__dirname, '..', 'metro.config.js');
if (fs.existsSync(metroConfigPath)) {
  const content = fs.readFileSync(metroConfigPath, 'utf8');
  if (content.includes('assetExts') && content.includes('jpg')) {
    console.log('✅ Metro config: JPG assets configured');
  } else {
    console.log('⚠️  Metro config: JPG assets might not be configured');
  }
}

console.log('\n📋 Asset Configuration Summary:');
if (allGood) {
  console.log('🎉 All required assets are properly configured!');
  console.log('\n📝 Next steps:');
  console.log('1. Clean build: npm run android-clean');
  console.log('2. Build release: npm run production-apk');
  console.log('3. Test on device: adb install android/app/build/outputs/apk/release/app-release.apk');
} else {
  console.log('❌ Some required assets are missing or misconfigured.');
  console.log('Please fix the issues above before building.');
}

console.log('\n🔧 Logo Loading Strategies:');
console.log('1. Centralized asset management (primary)');
console.log('2. Direct require() fallback');
console.log('3. Android drawable resource (Android only)');
console.log('4. Emoji fallback (🥋) if all fail');