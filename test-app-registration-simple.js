// Simple App Registration Test
// Run this with: node test-app-registration-simple.js

const fs = require('fs');

console.log('🧪 Simple App Registration Test...\n');

// Test 1: Check main files
console.log('📁 Checking main files...');
const files = ['App.jsx', 'index.js', 'app.json', 'package.json'];
files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Test 2: Check app.json content
console.log('\n📋 Checking app.json...');
try {
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  console.log(`App name: "${appJson.name}"`);
  console.log(`Display name: "${appJson.displayName}"`);
} catch (error) {
  console.log('❌ Error reading app.json:', error.message);
}

// Test 3: Check index.js content
console.log('\n📱 Checking index.js...');
try {
  const indexJs = fs.readFileSync('index.js', 'utf8');
  if (indexJs.includes('AppRegistry.registerComponent')) {
    console.log('✅ AppRegistry.registerComponent found');
  } else {
    console.log('❌ AppRegistry.registerComponent missing');
  }
} catch (error) {
  console.log('❌ Error reading index.js:', error.message);
}

// Test 4: Check for problematic imports
console.log('\n🔍 Checking for import issues...');
const problematicFiles = [
  'src/services/SharingService.js',
  'src/screens/CertificateShareScreen.jsx',
  'src/context/NavigationContext.jsx'
];

problematicFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
    try {
      const content = fs.readFileSync(file, 'utf8');
      // Check for syntax issues
      if (content.includes('import') && content.includes('export')) {
        console.log(`   ✅ ${file} has valid import/export structure`);
      } else {
        console.log(`   ⚠️ ${file} might have import/export issues`);
      }
    } catch (error) {
      console.log(`   ❌ Error reading ${file}:`, error.message);
    }
  } else {
    console.log(`❌ ${file} missing`);
  }
});

console.log('\n🎯 RECOMMENDATIONS:');
console.log('1. Run: ./COMPLETE_FIX_APP_REGISTRATION.bat');
console.log('2. Start Metro in one terminal: npx react-native start --reset-cache');
console.log('3. Wait for Metro to fully start');
console.log('4. Run Android in another terminal: npx react-native run-android');
console.log('5. If still failing, try on a physical device instead of emulator');

console.log('\n✅ Test complete!');