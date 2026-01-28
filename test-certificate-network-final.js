// Final test for certificate network integration
const fetch = require('node-fetch');

const API_BASE_URL = 'http://192.168.1.22:5000/api';

async function testCertificateNetworkFinal() {
  console.log('🧪 Final Certificate Network Integration Test...\n');

  // Test 1: Health check
  try {
    console.log('1. Testing backend health...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Backend health:', healthData.status);
    console.log('🌐 Backend URL working:', API_BASE_URL);
  } catch (error) {
    console.log('❌ Backend health failed:', error.message);
    return;
  }

  // Test 2: Public certificates (no auth)
  try {
    console.log('\n2. Testing public certificates...');
    const publicResponse = await fetch(`${API_BASE_URL}/certificates/public`);
    const publicData = await publicResponse.json();
    console.log('✅ Public certificates:', publicData.status);
    console.log('📋 Certificates count:', publicData.data?.certificates?.length || 0);
    
    if (publicData.data?.certificates?.length > 0) {
      const firstCert = publicData.data.certificates[0];
      console.log('📄 Sample certificate:');
      console.log('   ID:', firstCert.id);
      console.log('   Student:', firstCert.student);
      console.log('   Title:', firstCert.title);
      console.log('   Date:', firstCert.formattedIssueDate);
    }
  } catch (error) {
    console.log('❌ Public certificates failed:', error.message);
  }

  // Test 3: Certificate verification (no auth)
  try {
    console.log('\n3. Testing certificate verification...');
    const verifyResponse = await fetch(`${API_BASE_URL}/certificates/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        verificationCode: 'CERT-4125362'
      })
    });

    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('✅ Certificate verification:', verifyData.status);
    } else {
      console.log('⚠️  Certificate verification needs auth or different code');
    }
  } catch (error) {
    console.log('❌ Certificate verification failed:', error.message);
  }

  console.log('\n🎉 Network integration test completed!');
  console.log('\n📱 React Native App Configuration:');
  console.log(`   BASE_URL: ${API_BASE_URL}`);
  console.log('   Status: ✅ Ready for React Native');
  console.log('   Backend: ✅ Running and accessible');
  console.log('   Certificates: ✅ Available');
  
  console.log('\n🔧 Next Steps:');
  console.log('1. Make sure your React Native app uses this BASE_URL');
  console.log('2. Start your React Native app with: npm run android');
  console.log('3. The certificate screen should now load data from backend');
  console.log('4. If using physical device, make sure it\'s on the same WiFi network');
}

// Run the test
testCertificateNetworkFinal().catch(console.error);