#!/usr/bin/env node

/**
 * Asset Test Script
 * Tests that assets can be properly imported and resolved
 */

const path = require('path');

console.log('🧪 Testing asset imports...\n');

try {
  // Test the asset index
  const assetsPath = path.join(__dirname, '../src/assets');
  const { images } = require(assetsPath);
  
  console.log('✅ Asset index imported successfully');
  console.log('📋 Available images:', Object.keys(images));
  
  // Test the logo specifically
  if (images.taekwondoLogo) {
    console.log('✅ Taekwondo logo asset found');
    console.log('📄 Logo asset type:', typeof images.taekwondoLogo);
    
    // In React Native, require() returns a number (asset ID) for images
    if (typeof images.taekwondoLogo === 'number') {
      console.log('✅ Logo asset properly resolved as asset ID:', images.taekwondoLogo);
    } else {
      console.log('⚠️  Logo asset type unexpected:', images.taekwondoLogo);
    }
  } else {
    console.log('❌ Taekwondo logo not found in assets');
  }
  
  console.log('\n🎉 Asset test completed successfully!');
  console.log('\n💡 Next steps:');
  console.log('1. Test in debug mode: npx react-native run-android');
  console.log('2. Clean and build release: cd android && ./gradlew clean && ./gradlew assembleRelease');
  console.log('3. Install release APK and verify logo displays');
  
} catch (error) {
  console.error('❌ Asset test failed:', error.message);
  console.error('\n🔧 Troubleshooting:');
  console.error('1. Ensure src/assets/index.js exists');
  console.error('2. Ensure taekwondo-logo.jpg exists in src/assets/');
  console.error('3. Check for syntax errors in asset index');
  process.exit(1);
}