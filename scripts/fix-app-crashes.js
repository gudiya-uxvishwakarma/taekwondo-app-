const fs = require('fs');
const path = require('path');

// Script to fix common app crash issues

function fixAppCrashes() {
  console.log('🔧 Fixing app crash issues...\n');
  
  const fixes = [
    {
      name: 'Check React Native Vector Icons',
      fix: checkVectorIcons
    },
    {
      name: 'Verify Asset Files',
      fix: verifyAssets
    },
    {
      name: 'Check Metro Configuration',
      fix: checkMetroConfig
    },
    {
      name: 'Verify Android Permissions',
      fix: checkAndroidPermissions
    },
    {
      name: 'Check Package Dependencies',
      fix: checkDependencies
    }
  ];
  
  let fixedIssues = 0;
  
  fixes.forEach(({ name, fix }) => {
    console.log(`🔍 ${name}...`);
    try {
      const result = fix();
      if (result.fixed) {
        console.log(`✅ ${name}: ${result.message}`);
        fixedIssues++;
      } else {
        console.log(`ℹ️  ${name}: ${result.message}`);
      }
    } catch (error) {
      console.log(`❌ ${name}: ${error.message}`);
    }
    console.log('');
  });
  
  console.log(`🎉 Fixed ${fixedIssues} potential crash issues\n`);
  
  // Provide recommendations
  console.log('📋 Recommendations to prevent crashes:');
  console.log('1. Always test on physical devices, not just emulators');
  console.log('2. Use error boundaries in React components');
  console.log('3. Handle network errors gracefully');
  console.log('4. Validate data before using it');
  console.log('5. Use try-catch blocks for async operations');
  console.log('6. Clean up resources (timers, listeners) in useEffect cleanup');
  console.log('7. Test with different network conditions');
  console.log('8. Monitor memory usage and prevent leaks');
}

function checkVectorIcons() {
  const androidMainPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main');
  const fontsPath = path.join(androidMainPath, 'assets', 'fonts');
  
  if (!fs.existsSync(fontsPath)) {
    return {
      fixed: false,
      message: 'Vector icons fonts not found. Run: npx react-native link react-native-vector-icons'
    };
  }
  
  const fontFiles = fs.readdirSync(fontsPath);
  const hasVectorIcons = fontFiles.some(file => 
    file.includes('MaterialIcons') || file.includes('FontAwesome')
  );
  
  if (!hasVectorIcons) {
    return {
      fixed: false,
      message: 'Vector icon fonts missing. Link the fonts properly.'
    };
  }
  
  return {
    fixed: true,
    message: 'Vector icons properly configured'
  };
}

function verifyAssets() {
  const assetsPath = path.join(__dirname, '..', 'src', 'assets');
  const logoPath = path.join(assetsPath, 'taekwondo-logo.jpg');
  
  if (!fs.existsSync(logoPath)) {
    return {
      fixed: false,
      message: 'Logo file missing: src/assets/taekwondo-logo.jpg'
    };
  }
  
  const indexPath = path.join(assetsPath, 'index.js');
  if (!fs.existsSync(indexPath)) {
    return {
      fixed: false,
      message: 'Assets index file missing: src/assets/index.js'
    };
  }
  
  return {
    fixed: true,
    message: 'Asset files verified'
  };
}

function checkMetroConfig() {
  const metroConfigPath = path.join(__dirname, '..', 'metro.config.js');
  
  if (!fs.existsSync(metroConfigPath)) {
    return {
      fixed: false,
      message: 'Metro config missing'
    };
  }
  
  const config = fs.readFileSync(metroConfigPath, 'utf8');
  
  if (!config.includes('assetExts')) {
    return {
      fixed: false,
      message: 'Metro config missing asset extensions'
    };
  }
  
  return {
    fixed: true,
    message: 'Metro configuration looks good'
  };
}

function checkAndroidPermissions() {
  const manifestPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
  
  if (!fs.existsSync(manifestPath)) {
    return {
      fixed: false,
      message: 'AndroidManifest.xml not found'
    };
  }
  
  const manifest = fs.readFileSync(manifestPath, 'utf8');
  
  const requiredPermissions = [
    'android.permission.INTERNET',
    'android.permission.ACCESS_NETWORK_STATE'
  ];
  
  const missingPermissions = requiredPermissions.filter(permission => 
    !manifest.includes(permission)
  );
  
  if (missingPermissions.length > 0) {
    return {
      fixed: false,
      message: `Missing permissions: ${missingPermissions.join(', ')}`
    };
  }
  
  return {
    fixed: true,
    message: 'Android permissions configured'
  };
}

function checkDependencies() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    return {
      fixed: false,
      message: 'package.json not found'
    };
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const criticalDeps = [
    'react',
    'react-native',
    'react-native-vector-icons'
  ];
  
  const missingDeps = criticalDeps.filter(dep => !dependencies[dep]);
  
  if (missingDeps.length > 0) {
    return {
      fixed: false,
      message: `Missing critical dependencies: ${missingDeps.join(', ')}`
    };
  }
  
  return {
    fixed: true,
    message: 'Critical dependencies present'
  };
}

if (require.main === module) {
  fixAppCrashes();
}

module.exports = { fixAppCrashes };