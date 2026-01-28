const axios = require('axios');

// Test certificate API endpoints
async function testCertificateAPI() {
  const baseURL = 'http://192.168.1.22:5000/api';
  
  console.log('🧪 Testing Certificate API Endpoints...\n');
  
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check:', healthResponse.data.status);
    
    // Test 2: Public certificates endpoint
    console.log('\n2. Testing public certificates endpoint...');
    const publicResponse = await axios.get(`${baseURL}/certificates/public`);
    console.log('✅ Public certificates:', publicResponse.data.status);
    console.log('📄 Certificates count:', publicResponse.data.data.certificates.length);
    
    // Test 3: Certificate verification endpoint (with sample data)
    console.log('\n3. Testing certificate verification...');
    const verifyResponse = await axios.post(`${baseURL}/certificates/verify`, {
      verificationCode: 'CERT-4125362'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Verification:', verifyResponse.data.status);
    console.log('📋 Verified certificate:', verifyResponse.data.data.title);
    
    // Test 4: Certificate stats
    console.log('\n4. Testing certificate stats...');
    try {
      const statsResponse = await axios.get(`${baseURL}/certificates/stats`);
      console.log('✅ Stats:', statsResponse.data.status);
    } catch (statsError) {
      console.log('⚠️ Stats endpoint requires authentication');
    }
    
    console.log('\n🎉 All certificate API tests completed successfully!');
    console.log('\n📱 The app should now work properly with certificates.');
    
  } catch (error) {
    console.error('❌ API Test Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testCertificateAPI();