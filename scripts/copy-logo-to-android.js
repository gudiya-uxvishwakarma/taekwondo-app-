const fs = require('fs');
const path = require('path');

// Script to copy logo to Android drawable resources for release build compatibility

const sourceLogoPath = path.join(__dirname, '..', 'src', 'assets', 'taekwondo-logo.jpg');
const androidDrawablePaths = [
  path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'drawable'),
  path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'drawable-hdpi'),
  path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'drawable-mdpi'),
  path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'drawable-xhdpi'),
  path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'drawable-xxhdpi'),
  path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'drawable-xxxhdpi'),
];

function copyLogoToAndroid() {
  console.log('🔄 Copying logo to Android drawable resources...');
  
  // Check if source logo exists
  if (!fs.existsSync(sourceLogoPath)) {
    console.error('❌ Source logo not found:', sourceLogoPath);
    process.exit(1);
  }
  
  let copiedCount = 0;
  
  androidDrawablePaths.forEach(drawablePath => {
    try {
      // Create directory if it doesn't exist
      if (!fs.existsSync(drawablePath)) {
        fs.mkdirSync(drawablePath, { recursive: true });
        console.log('📁 Created directory:', drawablePath);
      }
      
      const targetPath = path.join(drawablePath, 'taekwondo_logo.jpg');
      
      // Copy the logo
      fs.copyFileSync(sourceLogoPath, targetPath);
      console.log('✅ Copied logo to:', targetPath);
      copiedCount++;
      
    } catch (error) {
      console.warn('⚠️  Failed to copy to:', drawablePath, error.message);
    }
  });
  
  console.log(`🎉 Successfully copied logo to ${copiedCount} Android drawable directories`);
  
  // Also copy to assets directory
  const assetsPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'assets');
  try {
    if (!fs.existsSync(assetsPath)) {
      fs.mkdirSync(assetsPath, { recursive: true });
    }
    
    const assetsLogoPath = path.join(assetsPath, 'taekwondo-logo.jpg');
    fs.copyFileSync(sourceLogoPath, assetsLogoPath);
    console.log('✅ Copied logo to assets:', assetsLogoPath);
  } catch (error) {
    console.warn('⚠️  Failed to copy to assets:', error.message);
  }
}

if (require.main === module) {
  copyLogoToAndroid();
}

module.exports = { copyLogoToAndroid };