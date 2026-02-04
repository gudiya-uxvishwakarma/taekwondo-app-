#!/usr/bin/env node

/**
 * Custom Bundle Creation Script
 * Creates Android bundle using Metro bundler directly
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
}

function createBundle() {
  console.log('🚀 Creating Android Bundle...');
  console.log('===============================');

  try {
    // Ensure output directories exist
    const bundleDir = path.join(__dirname, '../android/app/src/main/assets');
    const assetsDir = path.join(__dirname, '../android/app/src/main/res');
    
    ensureDirectoryExists(bundleDir);
    ensureDirectoryExists(assetsDir);

    console.log('📦 Building bundle with Metro...');
    
    // Use Metro CLI directly with proper syntax
    const metroCommand = [
      'npx @react-native-community/cli bundle',
      '--entry-file index.js',
      '--platform android',
      '--dev false',
      '--minify true',
      '--bundle-output android/app/src/main/assets/index.android.bundle',
      '--assets-dest android/app/src/main/res',
      '--reset-cache'
    ].join(' ');

    console.log(`Running: ${metroCommand}`);
    
    execSync(metroCommand, { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
      env: { ...process.env, NODE_ENV: 'production' }
    });

    console.log('✅ Bundle created successfully!');
    
    // Verify bundle was created
    const bundlePath = path.join(__dirname, '../android/app/src/main/assets/index.android.bundle');
    if (fs.existsSync(bundlePath)) {
      const stats = fs.statSync(bundlePath);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`📊 Bundle size: ${fileSizeMB} MB`);
    }

    console.log('🎉 Bundle creation completed!');
    console.log('You can now build your APK with: npm run build-apk');

  } catch (error) {
    console.error('❌ Bundle creation failed:', error.message);
    console.log('\n🔧 Alternative: Use the build-apk command directly');
    console.log('npm run build-apk');
    process.exit(1);
  }
}

if (require.main === module) {
  createBundle();
}

module.exports = { createBundle };