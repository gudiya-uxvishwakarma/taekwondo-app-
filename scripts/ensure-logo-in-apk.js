#!/usr/bin/env node

/**
 * Comprehensive Logo APK Bundling Script
 * Ensures the logo is properly included in APK builds through multiple methods
 */

const fs = require('fs');
const path = require('path');

const LOGO_FILE = 'taekwondo-logo.jpg';
const SOURCE_LOGO = path.join(__dirname, '../src/assets', LOGO_FILE);

// Multiple locations to ensure logo is bundled
const TARGET_LOCATIONS = [
  // Android assets
  path.join(__dirname, '../android/app/src/main/assets/assets', LOGO_FILE),
  // Android drawable
  path.join(__dirname, '../android/app/src/main/res/drawable/taekwondo_logo.jpg'),
  // Android raw resources
  path.join(__dirname, '../android/app/src/main/res/raw/taekwondo_logo.jpg'),
  // Metro bundler assets
  path.join(__dirname, '../android/app/build/generated/assets/react/release', LOGO_FILE),
];

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
}

function copyLogoToTargets() {
  console.log('🚀 Ensuring logo is bundled in APK...');
  console.log(`📁 Source logo: ${SOURCE_LOGO}`);
  
  if (!fs.existsSync(SOURCE_LOGO)) {
    console.error('❌ Source logo not found!');
    process.exit(1);
  }
  
  const logoStats = fs.statSync(SOURCE_LOGO);
  console.log(`📊 Logo size: ${(logoStats.size / 1024).toFixed(2)} KB`);
  
  let successCount = 0;
  
  TARGET_LOCATIONS.forEach((target, index) => {
    try {
      ensureDirectoryExists(target);
      fs.copyFileSync(SOURCE_LOGO, target);
      console.log(`✅ Copied to: ${target}`);
      successCount++;
    } catch (error) {
      console.log(`⚠️  Could not copy to: ${target} (${error.message})`);
    }
  });
  
  console.log(`\n📋 Summary: ${successCount}/${TARGET_LOCATIONS.length} locations updated`);
  
  if (successCount > 0) {
    console.log('✅ Logo bundling preparation complete!');
  } else {
    console.error('❌ Failed to copy logo to any target location!');
    process.exit(1);
  }
}

function createAssetManifest() {
  console.log('\n📝 Creating asset manifest...');
  
  const manifestPath = path.join(__dirname, '../android/app/src/main/assets/asset-manifest.json');
  const manifest = {
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    assets: [
      {
        name: LOGO_FILE,
        type: "image",
        required: true,
        locations: [
          `assets/${LOGO_FILE}`,
          'drawable/taekwondo_logo.jpg',
          'raw/taekwondo_logo.jpg'
        ]
      }
    ]
  };
  
  try {
    ensureDirectoryExists(manifestPath);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`✅ Asset manifest created: ${manifestPath}`);
  } catch (error) {
    console.log(`⚠️  Could not create manifest: ${error.message}`);
  }
}

function updateReactNativeConfig() {
  console.log('\n🔧 Updating React Native asset config...');
  
  const configPath = path.join(__dirname, '../react-native.config.js');
  
  if (fs.existsSync(configPath)) {
    console.log('✅ React Native config already exists');
  } else {
    const config = `module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: {
          icons: ['MaterialIcons.ttf', 'MaterialCommunityIcons.ttf', 'Ionicons.ttf', 'FontAwesome.ttf'],
        },
      },
    },
  },
  assets: [
    './src/assets/',
  ],
};`;
    
    try {
      fs.writeFileSync(configPath, config);
      console.log(`✅ Created React Native config: ${configPath}`);
    } catch (error) {
      console.log(`⚠️  Could not create config: ${error.message}`);
    }
  }
}

function main() {
  console.log('🎯 Logo APK Bundling Script');
  console.log('===========================');
  
  copyLogoToTargets();
  createAssetManifest();
  updateReactNativeConfig();
  
  console.log('\n🎉 Logo bundling script completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Run: npx react-native-asset');
  console.log('2. Clean build: cd android && ./gradlew clean');
  console.log('3. Build APK: cd android && ./gradlew assembleRelease');
  console.log('\n💡 The logo should now appear in your APK build!');
}

if (require.main === module) {
  main();
}

module.exports = { copyLogoToTargets, createAssetManifest };