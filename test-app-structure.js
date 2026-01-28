// Test App Structure and Registration
// Run this with: node test-app-structure.js

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing React Native App Structure...\n');

// Test 1: Check if main files exist
console.log('📁 Test 1: Checking main files...');
const mainFiles = [
  'App.jsx',
  'index.js',
  'app.json',
  'package.json'
];

let allFilesExist = true;
mainFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Test 2: Check app.json configuration
console.log('\n📋 Test 2: Checking app.json configuration...');
try {
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  console.log(`✅ App name: "${appJson.name}"`);
  console.log(`✅ Display name: "${appJson.displayName}"`);
  
  if (appJson.name === 'reactnative') {
    console.log('✅ App name matches expected value');
  } else {
    console.log('⚠️ App name might cause registration issues');
  }
} catch (error) {
  console.log('❌ Error reading app.json:', error.message);
  allFilesExist = false;
}

// Test 3: Check index.js registration
console.log('\n📱 Test 3: Checking index.js registration...');
try {
  const indexJs = fs.readFileSync('index.js', 'utf8');
  
  if (indexJs.includes('AppRegistry.registerComponent')) {
    console.log('✅ AppRegistry.registerComponent found');
  } else {
    console.log('❌ AppRegistry.registerComponent missing');
    allFilesExist = false;
  }
  
  if (indexJs.includes('import App from')) {
    console.log('✅ App import found');
  } else {
    console.log('❌ App import missing');
    allFilesExist = false;
  }
  
  if (indexJs.includes('name as appName')) {
    console.log('✅ App name import found');
  } else {
    console.log('❌ App name import missing');
    allFilesExist = false;
  }
} catch (error) {
  console.log('❌ Error reading index.js:', error.message);
  allFilesExist = false;
}

// Test 4: Check App.jsx structure
console.log('\n⚛️ Test 4: Checking App.jsx structure...');
try {
  const appJsx = fs.readFileSync('App.jsx', 'utf8');
  
  if (appJsx.includes('export default App')) {
    console.log('✅ Default export found');
  } else {
    console.log('❌ Default export missing');
    allFilesExist = false;
  }
  
  if (appJsx.includes('function App()') || appJsx.includes('const App =')) {
    console.log('✅ App component found');
  } else {
    console.log('❌ App component missing');
    allFilesExist = false;
  }
} catch (error) {
  console.log('❌ Error reading App.jsx:', error.message);
  allFilesExist = false;
}

// Test 5: Check package.json
console.log('\n📦 Test 5: Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (packageJson.name) {
    console.log(`✅ Package name: "${packageJson.name}"`);
  } else {
    console.log('❌ Package name missing');
  }
  
  if (packageJson.dependencies && packageJson.dependencies['react-native']) {
    console.log(`✅ React Native version: ${packageJson.dependencies['react-native']}`);
  } else {
    console.log('❌ React Native dependency missing');
    allFilesExist = false;
  }
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
  allFilesExist = false;
}

// Test 6: Check for common issues
console.log('\n🔍 Test 6: Checking for common issues...');

// Check for node_modules
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules directory exists');
} else {
  console.log('❌ node_modules missing - run: npm install');
  allFilesExist = false;
}

// Check for Android directory
if (fs.existsSync('android')) {
  console.log('✅ android directory exists');
} else {
  console.log('❌ android directory missing');
  allFilesExist = false;
}

// Final result
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 APP STRUCTURE TEST: PASSED');
  console.log('\n✅ All required files and configurations are present.');
  console.log('\n🚀 If you\'re still getting registration errors, try:');
  console.log('1. Run: ./QUICK_FIX_APP_REGISTRATION.bat');
  console.log('2. Start Metro: npx react-native start --reset-cache');
  console.log('3. Run Android: npx react-native run-android');
} else {
  console.log('❌ APP STRUCTURE TEST: FAILED');
  console.log('\n🔧 Please fix the issues above before running the app.');
}
console.log('='.repeat(50));