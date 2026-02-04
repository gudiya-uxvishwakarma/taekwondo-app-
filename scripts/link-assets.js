#!/usr/bin/env node

/**
 * Asset linking script for React Native
 * Ensures all assets are properly linked for APK builds
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const ANDROID_ASSETS_DIR = path.join(__dirname, '../android/app/src/main/assets');

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
}

function copyAssets() {
  console.log('🔗 Linking assets for APK build...');
  
  // Ensure Android assets directory exists
  ensureDirectoryExists(ANDROID_ASSETS_DIR);
  
  // Copy all assets from src/assets to android/app/src/main/assets
  const copyRecursive = (src, dest) => {
    if (!fs.existsSync(src)) {
      console.log(`⚠️  Source directory not found: ${src}`);
      return;
    }
    
    const stats = fs.statSync(src);
    
    if (stats.isDirectory()) {
      ensureDirectoryExists(dest);
      const files = fs.readdirSync(src);
      
      files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        copyRecursive(srcPath, destPath);
      });
    } else {
      fs.copyFileSync(src, dest);
      console.log(`📁 Copied: ${path.relative(process.cwd(), src)} → ${path.relative(process.cwd(), dest)}`);
    }
  };
  
  // Copy main assets
  copyRecursive(ASSETS_DIR, path.join(ANDROID_ASSETS_DIR, 'assets'));
  
  console.log('✅ Asset linking completed!');
}

function verifyAssets() {
  console.log('🔍 Verifying assets...');
  
  const requiredAssets = [
    'taekwondo-logo.jpg'
  ];
  
  let allAssetsFound = true;
  
  requiredAssets.forEach(asset => {
    const assetPath = path.join(ASSETS_DIR, asset);
    if (fs.existsSync(assetPath)) {
      console.log(`✅ Found: ${asset}`);
    } else {
      console.log(`❌ Missing: ${asset}`);
      allAssetsFound = false;
    }
  });
  
  if (allAssetsFound) {
    console.log('✅ All required assets found!');
  } else {
    console.log('⚠️  Some assets are missing. Please ensure all logo files are present.');
  }
  
  return allAssetsFound;
}

// Main execution
if (require.main === module) {
  console.log('🚀 React Native Asset Linker');
  console.log('============================');
  
  verifyAssets();
  copyAssets();
  
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Run: npx react-native-asset');
  console.log('2. Clean build: cd android && ./gradlew clean');
  console.log('3. Build APK: cd android && ./gradlew assembleRelease');
}

module.exports = { copyAssets, verifyAssets };