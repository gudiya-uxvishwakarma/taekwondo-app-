const fs = require('fs');
const path = require('path');

// Script to verify the logo fix is properly implemented

function verifyLogoFix() {
  console.log('🔍 Verifying logo fix implementation...\n');
  
  const checks = [
    {
      name: 'Source logo exists',
      path: path.join(__dirname, '..', 'src', 'assets', 'taekwondo-logo.jpg'),
      required: true
    },
    {
      name: 'ReleaseSafeLogo component exists',
      path: path.join(__dirname, '..', 'src', 'components', 'ReleaseSafeLogo.jsx'),
      required: true
    },
    {
      name: 'Assets index updated',
      path: path.join(__dirname, '..', 'src', 'assets', 'index.js'),
      required: true
    },
    {
      name: 'Android drawable logo exists',
      path: path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'drawable', 'taekwondo_logo.jpg'),
      required: false
    },
    {
      name: 'Android assets logo exists',
      path: path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'assets', 'taekwondo-logo.jpg'),
      required: false
    },
    {
      name: 'Copy logo script exists',
      path: path.join(__dirname, 'copy-logo-to-android.js'),
      required: true
    },
    {
      name: 'Build script exists',
      path: path.join(__dirname, 'build-release-safe.js'),
      required: true
    }
  ];
  
  let passedChecks = 0;
  let totalChecks = 0;
  
  checks.forEach(check => {
    totalChecks++;
    const exists = fs.existsSync(check.path);
    const status = exists ? '✅' : (check.required ? '❌' : '⚠️');
    const message = exists ? 'EXISTS' : (check.required ? 'MISSING (REQUIRED)' : 'MISSING (OPTIONAL)');
    
    console.log(`${status} ${check.name}: ${message}`);
    
    if (exists) {
      passedChecks++;
      
      // Additional checks for specific files
      if (check.name === 'Assets index updated') {
        const content = fs.readFileSync(check.path, 'utf8');
        if (content.includes('taekwondoLogoImage')) {
          console.log('   ✅ Contains updated asset exports');
        } else {
          console.log('   ⚠️  May not contain updated asset exports');
        }
      }
    }
  });
  
  console.log(`\n📊 Summary: ${passedChecks}/${totalChecks} checks passed\n`);
  
  // Check package.json scripts
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const scripts = packageJson.scripts || {};
    
    console.log('📋 Available scripts:');
    if (scripts['copy-logo']) {
      console.log('✅ copy-logo script available');
    } else {
      console.log('❌ copy-logo script missing');
    }
    
    if (scripts['build-release-safe']) {
      console.log('✅ build-release-safe script available');
    } else {
      console.log('❌ build-release-safe script missing');
    }
  }
  
  console.log('\n🚀 Next steps:');
  console.log('1. Run: npm run copy-logo');
  console.log('2. Test in debug: npm start');
  console.log('3. Build release: npm run build-release-safe');
  console.log('4. Test the APK on a device');
  
  if (passedChecks >= totalChecks - 2) { // Allow 2 optional checks to fail
    console.log('\n🎉 Logo fix appears to be properly implemented!');
    return true;
  } else {
    console.log('\n⚠️  Some required components are missing. Please check the failed items above.');
    return false;
  }
}

if (require.main === module) {
  verifyLogoFix();
}

module.exports = { verifyLogoFix };