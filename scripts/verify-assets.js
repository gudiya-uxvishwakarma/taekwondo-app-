#!/usr/bin/env node

/**
 * Asset Verification Script
 * Verifies that assets are properly configured for release builds
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying asset configuration...\n');

// Check if assets exist
const assetsDir = path.join(__dirname, '../src/assets');
const logoPath = path.join(assetsDir, 'taekwondo-logo.jpg');
const indexPath = path.join(assetsDir, 'index.js');

console.log('📁 Checking asset files:');
console.log(`  - Assets directory: ${fs.existsSync(assetsDir) ? '✅' : '❌'} ${assetsDir}`);
console.log(`  - Logo file: ${fs.existsSync(logoPath) ? '✅' : '❌'} ${logoPath}`);
console.log(`  - Asset index: ${fs.existsSync(indexPath) ? '✅' : '❌'} ${indexPath}`);

// Check asset index content
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  const hasLogoExport = indexContent.includes('taekwondoLogo');
  console.log(`  - Logo export in index: ${hasLogoExport ? '✅' : '❌'}`);
}

// Check React Native config
const configPath = path.join(__dirname, '../react-native.config.js');
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf8');
  const hasAssetsConfig = configContent.includes('./src/assets/');
  console.log(`  - RN config assets: ${hasAssetsConfig ? '✅' : '❌'}`);
}

// Check Metro config
const metroPath = path.join(__dirname, '../metro.config.js');
if (fs.existsSync(metroPath)) {
  const metroContent = fs.readFileSync(metroPath, 'utf8');
  const hasAssetExts = metroContent.includes('jpg');
  console.log(`  - Metro asset extensions: ${hasAssetExts ? '✅' : '❌'}`);
}

console.log('\n📋 Asset Usage Analysis:');

// Find files using the old require pattern
const srcDir = path.join(__dirname, '../src');
const findOldRequires = (dir) => {
  const files = fs.readdirSync(dir);
  const issues = [];
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      issues.push(...findOldRequires(filePath));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes("require('../../assets/taekwondo-logo.jpg')") || 
          content.includes("require('../assets/taekwondo-logo.jpg')")) {
        issues.push(filePath);
      }
    }
  });
  
  return issues;
};

const oldRequires = findOldRequires(srcDir);
if (oldRequires.length > 0) {
  console.log('❌ Files still using old require pattern:');
  oldRequires.forEach(file => {
    console.log(`  - ${path.relative(__dirname, file)}`);
  });
} else {
  console.log('✅ All files using centralized asset imports');
}

console.log('\n🚀 Recommendations for release builds:');
console.log('1. Run: npx react-native link (if using RN < 0.60)');
console.log('2. Clean build: cd android && ./gradlew clean');
console.log('3. Build release: npx react-native run-android --variant=release');
console.log('4. Or build APK: cd android && ./gradlew assembleRelease');

console.log('\n✨ Asset verification complete!');