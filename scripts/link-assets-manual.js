#!/usr/bin/env node

/**
 * Manual Asset Linking Script
 * Ensures assets are properly linked for release builds
 */

const fs = require('fs');
const path = require('path');

console.log('🔗 Manually linking assets for release builds...\n');

// Source and destination paths
const sourceAsset = path.join(__dirname, '../src/assets/taekwondo-logo.jpg');
const destinations = [
  path.join(__dirname, '../android/app/src/main/res/drawable/taekwondo_logo.jpg'),
  path.join(__dirname, '../android/app/src/main/res/raw/taekwondo_logo.jpg'),
  path.join(__dirname, '../android/app/src/main/assets/taekwondo_logo.jpg'),
];

// Check if source exists
if (!fs.existsSync(sourceAsset)) {
  console.log('❌ Source asset not found:', sourceAsset);
  process.exit(1);
}

console.log('✅ Source asset found:', sourceAsset);

// Create directories and copy assets
destinations.forEach((dest, index) => {
  const destDir = path.dirname(dest);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`📁 Created directory: ${destDir}`);
  }
  
  // Copy asset
  try {
    fs.copyFileSync(sourceAsset, dest);
    console.log(`✅ Copied to: ${dest}`);
  } catch (error) {
    console.log(`❌ Failed to copy to: ${dest}`, error.message);
  }
});

// Update Android build.gradle to include assets
const buildGradlePath = path.join(__dirname, '../android/app/build.gradle');
if (fs.existsSync(buildGradlePath)) {
  let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
  
  // Check if assets are already configured
  if (!buildGradleContent.includes('sourceSets')) {
    console.log('\n📝 Adding asset configuration to build.gradle...');
    
    const assetConfig = `
android {
    sourceSets {
        main {
            assets.srcDirs = ['src/main/assets', '../../src/assets']
        }
    }
}`;
    
    // Add before the dependencies block
    buildGradleContent = buildGradleContent.replace(
      'dependencies {',
      assetConfig + '\n\ndependencies {'
    );
    
    fs.writeFileSync(buildGradlePath, buildGradleContent);
    console.log('✅ Updated build.gradle with asset configuration');
  } else {
    console.log('✅ build.gradle already has asset configuration');
  }
}

console.log('\n🎉 Asset linking completed!');
console.log('\n🚀 Next steps:');
console.log('1. Clean build: npm run android-clean');
console.log('2. Build release: npm run build-release');
console.log('3. Install and test: npm run install-release');