#!/usr/bin/env node

/**
 * Force Logo Bundle Script
 * This script ensures the logo is bundled in the APK through multiple methods
 */

const fs = require('fs');
const path = require('path');

const LOGO_FILE = 'taekwondo-logo.jpg';
const SOURCE_LOGO = path.join(__dirname, '../src/assets', LOGO_FILE);

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
}

function copyLogoToAndroidAssets() {
  console.log('🚀 Force bundling logo for APK...');
  
  if (!fs.existsSync(SOURCE_LOGO)) {
    console.error('❌ Source logo not found!');
    process.exit(1);
  }
  
  const logoStats = fs.statSync(SOURCE_LOGO);
  console.log(`📊 Logo size: ${(logoStats.size / 1024).toFixed(2)} KB`);
  
  // Multiple target locations for maximum reliability
  const targets = [
    // Main assets folder
    path.join(__dirname, '../android/app/src/main/assets/assets', LOGO_FILE),
    // Raw resources
    path.join(__dirname, '../android/app/src/main/res/raw/taekwondo_logo.jpg'),
    // Drawable resources
    path.join(__dirname, '../android/app/src/main/res/drawable/taekwondo_logo.jpg'),
    // Mipmap resources (for launcher icons, but can work for regular images too)
    path.join(__dirname, '../android/app/src/main/res/mipmap-hdpi/taekwondo_logo.jpg'),
    path.join(__dirname, '../android/app/src/main/res/mipmap-mdpi/taekwondo_logo.jpg'),
    path.join(__dirname, '../android/app/src/main/res/mipmap-xhdpi/taekwondo_logo.jpg'),
    path.join(__dirname, '../android/app/src/main/res/mipmap-xxhdpi/taekwondo_logo.jpg'),
    path.join(__dirname, '../android/app/src/main/res/mipmap-xxxhdpi/taekwondo_logo.jpg'),
  ];
  
  let successCount = 0;
  
  targets.forEach((target) => {
    try {
      ensureDirectoryExists(target);
      fs.copyFileSync(SOURCE_LOGO, target);
      console.log(`✅ Copied to: ${path.relative(process.cwd(), target)}`);
      successCount++;
    } catch (error) {
      console.log(`⚠️  Could not copy to: ${path.relative(process.cwd(), target)} (${error.message})`);
    }
  });
  
  console.log(`\n📋 Summary: ${successCount}/${targets.length} locations updated`);
  return successCount > 0;
}

function createAssetIndex() {
  console.log('\n📝 Creating comprehensive asset index...');
  
  const assetIndexPath = path.join(__dirname, '../src/assets/index.js');
  const assetIndex = `// Comprehensive asset index for APK bundling
// This ensures the logo is properly bundled in release builds

// Direct require for maximum reliability
const LOGO_IMAGE = require('./taekwondo-logo.jpg');

// Multiple export formats for compatibility
export const taekwondoLogo = LOGO_IMAGE;
export const logo = LOGO_IMAGE;
export default LOGO_IMAGE;

// Legacy compatibility
export const LOGO_ASSETS = {
  taekwondoLogo: LOGO_IMAGE,
  logo: LOGO_IMAGE,
};

// Force bundling by touching the asset
console.log('Logo asset loaded:', LOGO_IMAGE);
`;
  
  try {
    fs.writeFileSync(assetIndexPath, assetIndex);
    console.log(`✅ Asset index updated: ${assetIndexPath}`);
  } catch (error) {
    console.log(`⚠️  Could not update asset index: ${error.message}`);
  }
}

function updateMetroConfig() {
  console.log('\n🔧 Updating Metro config for asset bundling...');
  
  const metroConfigPath = path.join(__dirname, '../metro.config.js');
  
  if (fs.existsSync(metroConfigPath)) {
    let metroConfig = fs.readFileSync(metroConfigPath, 'utf8');
    
    // Ensure jpg is in asset extensions
    if (!metroConfig.includes("'jpg'")) {
      metroConfig = metroConfig.replace(
        /assetExts:\s*\[([^\]]+)\]/,
        "assetExts: ['bin', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'psd', 'svg', 'json', 'ttf', 'otf', 'woff', 'woff2']"
      );
      
      try {
        fs.writeFileSync(metroConfigPath, metroConfig);
        console.log('✅ Metro config updated with jpg extension');
      } catch (error) {
        console.log(`⚠️  Could not update Metro config: ${error.message}`);
      }
    } else {
      console.log('✅ Metro config already includes jpg extension');
    }
  }
}

function main() {
  console.log('🎯 Force Logo Bundle Script');
  console.log('============================');
  
  const success = copyLogoToAndroidAssets();
  createAssetIndex();
  updateMetroConfig();
  
  if (success) {
    console.log('\n🎉 Logo force bundling completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Clean build: cd android && ./gradlew clean');
    console.log('2. Build APK: cd android && ./gradlew assembleRelease');
    console.log('\n💡 The logo should now definitely appear in your APK!');
  } else {
    console.error('\n❌ Logo bundling failed!');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { copyLogoToAndroidAssets, createAssetIndex };