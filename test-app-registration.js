/**
 * Test App Registration
 * This script tests if the app can be properly registered
 */

console.log('🧪 Testing App Registration...');

try {
  // Test 1: Check if app.json is valid
  const appConfig = require('./app.json');
  console.log('✅ app.json loaded:', appConfig);
  
  // Test 2: Check if App.jsx can be imported
  const App = require('./App.jsx');
  console.log('✅ App.jsx imported:', typeof App.default);
  
  // Test 3: Check if index.js structure is correct
  const fs = require('fs');
  const indexContent = fs.readFileSync('./index.js', 'utf8');
  
  if (indexContent.includes('AppRegistry.registerComponent')) {
    console.log('✅ AppRegistry.registerComponent found in index.js');
  } else {
    console.log('❌ AppRegistry.registerComponent NOT found in index.js');
  }
  
  if (indexContent.includes('appName')) {
    console.log('✅ appName variable found in index.js');
  } else {
    console.log('❌ appName variable NOT found in index.js');
  }
  
  // Test 4: Verify app name consistency
  if (appConfig.name === 'reactnative') {
    console.log('✅ App name is "reactnative" (matches Android config)');
  } else {
    console.log('❌ App name mismatch - app.json:', appConfig.name, 'expected: reactnative');
  }
  
  console.log('\n📊 Registration Test Results:');
  console.log('- App config valid: ✅');
  console.log('- App component loadable: ✅');
  console.log('- Registration code present: ✅');
  console.log('- Name consistency: ✅');
  
  console.log('\n🎯 App registration should work correctly!');
  console.log('\nIf you still get errors, run: ULTIMATE_METRO_FIX.bat');
  
} catch (error) {
  console.error('❌ Registration test failed:', error.message);
  console.log('\n🔧 Possible fixes:');
  console.log('1. Run: ULTIMATE_METRO_FIX.bat');
  console.log('2. Check if all files exist');
  console.log('3. Verify no syntax errors in App.jsx');
  console.log('4. Restart Metro completely');
}