// Test network connection for React Native
const fetch = require('node-fetch');

const testUrls = [
  'http://10.0.2.2:5000/api/health',      // Android emulator mapping
  'http://192.168.1.22:5000/api/health',  // Computer's IP
  'http://localhost:5000/api/health',     // Localhost
  'http://127.0.0.1:5000/api/health'      // Loopback
];

async function testNetworkConnection() {
  console.log('🧪 Testing Network Connection for React Native...\n');

  for (const url of testUrls) {
    try {
      console.log(`📡 Testing: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        timeout: 5000,
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ SUCCESS: ${url}`);
        console.log(`   Response:`, data);
        console.log(`   This URL should work for React Native\n`);
        
        // Test certificate endpoint too
        try {
          const certUrl = url.replace('/health', '/certificates/public');
          const certResponse = await fetch(certUrl);
          if (certResponse.ok) {
            const certData = await certResponse.json();
            console.log(`✅ Certificate endpoint also working: ${certData.data?.certificates?.length || 0} certificates\n`);
          }
        } catch (certError) {
          console.log(`⚠️  Certificate endpoint failed for this URL\n`);
        }
        
        return url.replace('/health', '');
      } else {
        console.log(`❌ FAILED: ${url} - HTTP ${response.status}\n`);
      }
    } catch (error) {
      console.log(`❌ FAILED: ${url} - ${error.message}\n`);
    }
  }
  
  console.log('❌ No working URLs found!');
  console.log('\n🔧 Troubleshooting steps:');
  console.log('1. Make sure your backend server is running:');
  console.log('   cd Taekwondo_backend && npm start');
  console.log('2. If using Android emulator, set up port forwarding:');
  console.log('   adb reverse tcp:5000 tcp:5000');
  console.log('3. If using physical device, use your computer\'s IP address');
  console.log('4. Make sure Windows Firewall allows the connection');
  
  return null;
}

// Run the test
testNetworkConnection().then(workingUrl => {
  if (workingUrl) {
    console.log(`\n🎉 RECOMMENDED BASE_URL for React Native: ${workingUrl}`);
    console.log('\nUpdate your src/config/api.js file with this URL');
  }
}).catch(console.error);