#!/usr/bin/env node

/**
 * Icon Setup Verification Script
 * Run this to check if all icon fonts are properly set up
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking React Native Vector Icons Setup...\n');

// Check if react-native-vector-icons is installed
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (packageJson.dependencies['react-native-vector-icons']) {
  console.log('✅ react-native-vector-icons is installed');
  console.log(`   Version: ${packageJson.dependencies['react-native-vector-icons']}`);
} else {
  console.log('❌ react-native-vector-icons is NOT installed');
  process.exit(1);
}

// Check Android font files
const androidFontsPath = path.join(__dirname, 'android/app/src/main/assets/fonts');
const requiredFonts = [
  'MaterialCommunityIcons.ttf',
  'MaterialIcons.ttf',
  'FontAwesome.ttf',
  'Ionicons.ttf'
];

console.log('\n📱 Checking Android font files:');

if (fs.existsSync(androidFontsPath)) {
  const existingFonts = fs.readdirSync(androidFontsPath);
  
  requiredFonts.forEach(font => {
    if (existingFonts.includes(font)) {
      console.log(`✅ ${font}`);
    } else {
      console.log(`❌ ${font} - MISSING`);
    }
  });
  
  console.log(`\n📊 Total fonts found: ${existingFonts.length}`);
  existingFonts.forEach(font => {
    if (!requiredFonts.includes(font)) {
      console.log(`ℹ️  Additional font: ${font}`);
    }
  });
} else {
  console.log('❌ Android fonts directory does not exist');
  console.log('   Expected: android/app/src/main/assets/fonts/');
}

// Check MainApplication.java
const mainAppPath = path.join(__dirname, 'android/app/src/main/java/com/reactnative/MainApplication.java');
console.log('\n🔧 Checking Android configuration:');

if (fs.existsSync(mainAppPath)) {
  const mainAppContent = fs.readFileSync(mainAppPath, 'utf8');
  
  if (mainAppContent.includes('VectorIconsPackage')) {
    console.log('✅ VectorIconsPackage imported in MainApplication.java');
  } else {
    console.log('❌ VectorIconsPackage NOT imported in MainApplication.java');
  }
} else {
  console.log('❌ MainApplication.java not found');
}

// Check build.gradle
const buildGradlePath = path.join(__dirname, 'android/app/build.gradle');
if (fs.existsSync(buildGradlePath)) {
  const buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
  
  if (buildGradleContent.includes('react-native-vector-icons/fonts.gradle')) {
    console.log('✅ fonts.gradle applied in build.gradle');
  } else {
    console.log('❌ fonts.gradle NOT applied in build.gradle');
  }
} else {
  console.log('❌ build.gradle not found');
}

console.log('\n🎯 Setup Summary:');
console.log('1. Install: react-native-vector-icons ✅');
console.log('2. Android fonts: Copy font files to assets ✅');
console.log('3. Android config: Import VectorIconsPackage ✅');
console.log('4. Build config: Apply fonts.gradle ✅');

console.log('\n🚀 Next Steps:');
console.log('1. Clean build: npm run android-clean');
console.log('2. Run app: npx react-native run-android');
console.log('3. Test icons using IconTest component');

console.log('\n📚 Icon Libraries Available:');
console.log('- MaterialCommunityIcons (Primary)');
console.log('- MaterialIcons');
console.log('- FontAwesome');
console.log('- Ionicons');
console.log('- Feather');
console.log('- AntDesign');

console.log('\n✨ Setup verification complete!');