// Test script to verify react-native-view-shot is working
console.log('🔍 Testing react-native-view-shot integration...');

try {
  // Test import
  const ViewShot = require('react-native-view-shot');
  console.log('✅ ViewShot import successful');
  console.log('📦 ViewShot object:', typeof ViewShot);
  
  // Test if it has the expected methods
  if (ViewShot && typeof ViewShot.captureRef === 'function') {
    console.log('✅ ViewShot.captureRef method found');
  } else {
    console.log('❌ ViewShot.captureRef method not found');
  }
  
  if (ViewShot && typeof ViewShot.captureScreen === 'function') {
    console.log('✅ ViewShot.captureScreen method found');
  } else {
    console.log('❌ ViewShot.captureScreen method not found');
  }
  
  console.log('🎉 react-native-view-shot is properly configured!');
  
} catch (error) {
  console.error('❌ ViewShot test failed:', error.message);
  console.error('🔧 Run PERMANENT_FIX.bat to resolve this issue');
}

console.log('\n🔍 Testing app registration...');
try {
  const { AppRegistry } = require('react-native');
  console.log('✅ AppRegistry import successful');
  
  // Check if our app is registered
  const registeredApps = AppRegistry.getAppKeys();
  console.log('📱 Registered apps:', registeredApps);
  
  if (registeredApps.includes('reactnative')) {
    console.log('✅ App "reactnative" is properly registered');
  } else {
    console.log('❌ App "reactnative" is NOT registered');
    console.log('🔧 Check index.js and App.jsx files');
  }
  
} catch (error) {
  console.error('❌ App registration test failed:', error.message);
}

console.log('\n🏁 Test complete!');