#!/usr/bin/env node

/**
 * Logo Display Test Script
 * Tests if the logo can be properly loaded and displayed
 */

const fs = require('fs');
const path = require('path');

function testLogoFile() {
  console.log('🖼️  Testing Logo File...');
  console.log('========================');
  
  const logoPath = path.join(__dirname, '../src/assets/taekwondo-logo.jpg');
  
  if (!fs.existsSync(logoPath)) {
    console.log('❌ Logo file not found at:', logoPath);
    return false;
  }
  
  const stats = fs.statSync(logoPath);
  const fileSizeKB = (stats.size / 1024).toFixed(2);
  
  console.log('✅ Logo file exists');
  console.log(`📊 Size: ${fileSizeKB} KB`);
  console.log(`📅 Modified: ${stats.mtime.toLocaleString()}`);
  
  // Check if file is not empty and has reasonable size
  if (stats.size < 1000) {
    console.log('⚠️  Warning: Logo file seems very small (< 1KB)');
    return false;
  }
  
  if (stats.size > 500000) {
    console.log('⚠️  Warning: Logo file is quite large (> 500KB)');
    console.log('   Consider optimizing for better app performance');
  }
  
  return true;
}

function testAssetIndex() {
  console.log('\n📋 Testing Asset Index...');
  console.log('==========================');
  
  const indexPath = path.join(__dirname, '../src/assets/index.js');
  
  if (!fs.existsSync(indexPath)) {
    console.log('❌ Asset index file not found');
    return false;
  }
  
  const content = fs.readFileSync(indexPath, 'utf8');
  
  if (content.includes('taekwondo-logo.jpg')) {
    console.log('✅ Logo properly referenced in asset index');
  } else {
    console.log('❌ Logo not found in asset index');
    return false;
  }
  
  if (content.includes('require(')) {
    console.log('✅ Using require() for reliable APK bundling');
  } else {
    console.log('⚠️  Warning: Not using require() - may cause APK issues');
  }
  
  return true;
}

function testAPKAssets() {
  console.log('\n📱 Testing APK Assets...');
  console.log('=========================');
  
  const apkAssetsPath = path.join(__dirname, '../android/app/src/main/assets/assets/taekwondo-logo.jpg');
  
  if (!fs.existsSync(apkAssetsPath)) {
    console.log('❌ Logo not found in APK assets directory');
    console.log('💡 Run: npm run link-assets');
    return false;
  }
  
  const stats = fs.statSync(apkAssetsPath);
  const fileSizeKB = (stats.size / 1024).toFixed(2);
  
  console.log('✅ Logo found in APK assets');
  console.log(`📊 Size: ${fileSizeKB} KB`);
  
  return true;
}

function testComponentUsage() {
  console.log('\n🧩 Testing Component Usage...');
  console.log('==============================');
  
  const componentsToCheck = [
    '../src/screens/auth/StudentLoginScreen.jsx',
    '../src/components/common/Navbar.jsx',
    '../src/screens/DashboardScreen.jsx'
  ];
  
  let usageFound = false;
  
  componentsToCheck.forEach(componentPath => {
    const fullPath = path.join(__dirname, componentPath);
    
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes('taekwondo-logo.jpg') || content.includes('taekwondo')) {
        console.log(`✅ Logo used in: ${path.basename(componentPath)}`);
        usageFound = true;
      }
    }
  });
  
  if (!usageFound) {
    console.log('❌ Logo not found in any components');
    return false;
  }
  
  return true;
}

function generateReport() {
  console.log('\n📊 LOGO DISPLAY TEST REPORT');
  console.log('============================');
  
  const logoFileOK = testLogoFile();
  const assetIndexOK = testAssetIndex();
  const apkAssetsOK = testAPKAssets();
  const componentUsageOK = testComponentUsage();
  
  console.log('\n📋 Summary:');
  console.log('===========');
  console.log(`Logo File: ${logoFileOK ? '✅ OK' : '❌ FAIL'}`);
  console.log(`Asset Index: ${assetIndexOK ? '✅ OK' : '❌ FAIL'}`);
  console.log(`APK Assets: ${apkAssetsOK ? '✅ OK' : '❌ FAIL'}`);
  console.log(`Component Usage: ${componentUsageOK ? '✅ OK' : '❌ FAIL'}`);
  
  if (logoFileOK && assetIndexOK && apkAssetsOK && componentUsageOK) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('Your logo should display properly in the APK.');
    console.log('\n🚀 Next steps:');
    console.log('1. Build APK: npm run build-apk');
    console.log('2. Install: npm run install-apk');
    console.log('3. Test on device to confirm logo displays');
  } else {
    console.log('\n⚠️  ISSUES FOUND!');
    console.log('Please fix the issues above before building APK.');
  }
}

if (require.main === module) {
  generateReport();
}

module.exports = { testLogoFile, testAssetIndex, testAPKAssets, testComponentUsage };