#!/usr/bin/env node

/**
 * Quick APK Build Script
 * Essential steps for building APK with proper logo bundling
 */

const { execSync } = require('child_process');

console.log('🚀 Quick APK build with logo fix...');

const commands = [
  {
    cmd: 'npx react-native start --reset-cache',
    desc: 'Reset Metro cache',
    timeout: 10000
  },
  {
    cmd: 'cd android && ./gradlew clean',
    desc: 'Clean Android build'
  },
  {
    cmd: 'cd android && ./gradlew assembleRelease',
    desc: 'Build release APK'
  }
];

async function runCommand(command, description, timeout = 0) {
  console.log(`\n📋 ${description}`);
  console.log(`🔧 ${command}`);
  
  try {
    const options = { 
      stdio: 'inherit',
      timeout: timeout || undefined
    };
    
    execSync(command, options);
    console.log(`✅ ${description} completed`);
  } catch (error) {
    if (timeout && error.signal === 'SIGTERM') {
      console.log(`⏰ ${description} timed out (this is expected for cache reset)`);
    } else {
      console.error(`❌ ${description} failed:`, error.message);
      throw error;
    }
  }
}

async function main() {
  try {
    for (const { cmd, desc, timeout } of commands) {
      await runCommand(cmd, desc, timeout);
      
      // Small delay between commands
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎉 APK build completed!');
    console.log('📱 Check: android/app/build/outputs/apk/release/app-release.apk');
    console.log('✅ Logo should now be properly bundled in the APK');
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

main();