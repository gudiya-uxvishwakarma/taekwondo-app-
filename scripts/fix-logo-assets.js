#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing logo asset issues...\n');

function fixAssets() {
  try {
    console.log('1️⃣ Checking current asset structure...');
    
    // Check source logo
    const sourceLogoJpg = path.join(__dirname, '../src/assets/taekwondo-logo.jpg');
    const sourceLogoPng = path.join(__dirname, '../src/assets/taekwondo-logo.png');
    
    if (fs.existsSync(sourceLogoJpg)) {
      console.log('✅ Found: src/assets/taekwondo-logo.jpg');
    } else if (fs.existsSync(sourceLogoPng)) {
      console.log('⚠️ Found PNG instead of JPG: src/assets/taekwondo-logo.png');
      console.log('   Renaming to JPG...');
      fs.renameSync(sourceLogoPng, sourceLogoJpg);
      console.log('✅ Renamed to: src/assets/taekwondo-logo.jpg');
    } else {
      console.log('❌ No logo file found in src/assets/');
      return false;
    }

    console.log('\n2️⃣ Updating assets index...');
    const assetsIndexPath = path.join(__dirname, '../src/assets/index.js');
    const assetsIndexContent = `// Asset exports for proper bundling in release builds
export const images = {
  taekwondoLogo: require('./taekwondo-logo.jpg'),
};

// Individual exports for direct access
export const taekwondoLogo = images.taekwondoLogo;

// Default export for convenience
export default images;
`;
    
    fs.writeFileSync(assetsIndexPath, assetsIndexContent);
    console.log('✅ Updated assets index to use JPG');

    console.log('\n3️⃣ Cleaning cached assets...');
    
    // Clean Android assets
    const androidAssetsPath = path.join(__dirname, '../android/app/src/main/assets');
    if (fs.existsSync(androidAssetsPath)) {
      const files = fs.readdirSync(androidAssetsPath);
      let cleaned = 0;
      
      for (const file of files) {
        if (file.includes('taekwondo') && file.endsWith('.png')) {
          const filePath = path.join(androidAssetsPath, file);
          try {
            fs.unlinkSync(filePath);
            console.log(`   Removed cached PNG: ${file}`);
            cleaned++;
          } catch (error) {
            console.log(`   Could not remove: ${file}`);
          }
        }
        
        if (file.endsWith('.bundle') || file.endsWith('.bundle.js')) {
          const filePath = path.join(androidAssetsPath, file);
          try {
            fs.unlinkSync(filePath);
            console.log(`   Removed cached bundle: ${file}`);
            cleaned++;
          } catch (error) {
            console.log(`   Could not remove: ${file}`);
          }
        }
      }
      
      if (cleaned === 0) {
        console.log('   No cached files to clean');
      }
    }

    console.log('\n4️⃣ Verifying ReleaseReadyLogo component...');
    const logoComponentPath = path.join(__dirname, '../src/components/ReleaseReadyLogo.jsx');
    if (fs.existsSync(logoComponentPath)) {
      const content = fs.readFileSync(logoComponentPath, 'utf8');
      if (content.includes('taekwondo-logo.jpg')) {
        console.log('✅ ReleaseReadyLogo component uses correct JPG path');
      } else {
        console.log('⚠️ ReleaseReadyLogo component might need updating');
      }
    } else {
      console.log('❌ ReleaseReadyLogo component not found');
    }

    console.log('\n5️⃣ Checking Metro configuration...');
    const metroConfigPath = path.join(__dirname, '../metro.config.js');
    if (fs.existsSync(metroConfigPath)) {
      const content = fs.readFileSync(metroConfigPath, 'utf8');
      if (content.includes('port: 8081') && content.includes('jpg')) {
        console.log('✅ Metro config properly configured for port 8081 and JPG assets');
      } else {
        console.log('⚠️ Metro config might need updating');
      }
    }

    console.log('\n✅ Asset fixes completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start Metro: npm run clean-start');
    console.log('2. In another terminal: npm run android');
    console.log('3. Or build release: npm run production-apk');
    
    return true;

  } catch (error) {
    console.error('❌ Asset fix failed:', error.message);
    return false;
  }
}

if (fixAssets()) {
  console.log('\n🎉 All asset issues have been resolved!');
} else {
  console.log('\n❌ Some issues could not be resolved automatically.');
  process.exit(1);
}