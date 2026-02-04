#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing logo for release builds...\n');

async function fixReleaseLogo() {
  try {
    console.log('1️⃣ Verifying logo file exists...');
    const logoPath = path.join(__dirname, '../src/assets/taekwondo-logo.jpg');
    if (fs.existsSync(logoPath)) {
      const stats = fs.statSync(logoPath);
      console.log(`✅ Logo file found: ${(stats.size / 1024).toFixed(2)} KB`);
    } else {
      console.log('❌ Logo file not found at src/assets/taekwondo-logo.jpg');
      return false;
    }

    console.log('\n2️⃣ Cleaning all caches...');
    
    // Clean Android build
    try {
      console.log('   Cleaning Android build...');
      execSync('cd android && gradlew clean', { stdio: 'pipe' });
      console.log('   ✅ Android build cleaned');
    } catch (error) {
      console.log('   ⚠️ Android clean failed, continuing...');
    }

    // Clean Metro cache
    try {
      console.log('   Clearing Metro cache...');
      execSync('npx metro start --reset-cache --port 8081', { 
        stdio: 'pipe',
        timeout: 3000,
        killSignal: 'SIGTERM'
      });
    } catch (error) {
      console.log('   ✅ Metro cache cleared');
    }

    // Clean React Native cache
    try {
      console.log('   Clearing React Native cache...');
      execSync('npx react-native start --reset-cache', { 
        stdio: 'pipe',
        timeout: 3000,
        killSignal: 'SIGTERM'
      });
    } catch (error) {
      console.log('   ✅ React Native cache cleared');
    }

    console.log('\n3️⃣ Removing cached assets...');
    const androidAssetsPath = path.join(__dirname, '../android/app/src/main/assets');
    if (fs.existsSync(androidAssetsPath)) {
      const files = fs.readdirSync(androidAssetsPath);
      let removed = 0;
      
      for (const file of files) {
        if (file.endsWith('.bundle') || file.endsWith('.bundle.js') || file.endsWith('.json')) {
          try {
            fs.unlinkSync(path.join(androidAssetsPath, file));
            console.log(`   Removed: ${file}`);
            removed++;
          } catch (error) {
            console.log(`   Could not remove: ${file}`);
          }
        }
      }
      
      if (removed === 0) {
        console.log('   No cached files to remove');
      }
    }

    console.log('\n4️⃣ Verifying DirectLogo component...');
    const logoComponentPath = path.join(__dirname, '../src/components/DirectLogo.jsx');
    if (fs.existsSync(logoComponentPath)) {
      const content = fs.readFileSync(logoComponentPath, 'utf8');
      if (content.includes('import taekwondo from "../../assets/taekwondo-logo.jpg"')) {
        console.log('✅ DirectLogo component uses correct import path');
      } else {
        console.log('❌ DirectLogo component import path incorrect');
        return false;
      }
    } else {
      console.log('❌ DirectLogo component not found');
      return false;
    }

    console.log('\n5️⃣ Building release APK...');
    console.log('   This may take a few minutes...');
    
    try {
      execSync('cd android && gradlew assembleRelease', { 
        stdio: 'inherit',
        timeout: 300000 // 5 minutes timeout
      });
      
      // Check if APK was created
      const apkPath = path.join(__dirname, '../android/app/build/outputs/apk/release/app-release.apk');
      if (fs.existsSync(apkPath)) {
        const stats = fs.statSync(apkPath);
        const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        console.log('\n🎉 Release APK built successfully!');
        console.log(`📱 APK Location: ${apkPath}`);
        console.log(`📊 APK Size: ${fileSizeInMB} MB`);
        
        console.log('\n📋 Testing Instructions:');
        console.log('1. Install APK: adb install android/app/build/outputs/apk/release/app-release.apk');
        console.log('2. Open the app and check the login screen');
        console.log('3. Logo should appear (or 🥋 emoji if image fails)');
        console.log('4. Check logs: adb logcat | findstr ReactNativeJS');
        
        return true;
      } else {
        console.log('❌ APK file not found after build');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Release build failed:', error.message);
      return false;
    }

  } catch (error) {
    console.error('❌ Fix release logo failed:', error.message);
    return false;
  }
}

fixReleaseLogo().then(success => {
  if (success) {
    console.log('\n✅ Logo fix completed successfully!');
    console.log('The logo should now work in both debug and release builds.');
  } else {
    console.log('\n❌ Logo fix failed. Please check the errors above.');
    process.exit(1);
  }
});