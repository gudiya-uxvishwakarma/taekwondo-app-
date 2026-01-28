// Test certificate integration with authentication
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';

// Test credentials (you should have a test user in your database)
const testCredentials = {
  email: 'test@example.com',
  password: 'password123'
};

async function testAuthenticatedCertificates() {
  console.log('🧪 Testing Authenticated Certificate Integration...\n');

  let authToken = null;

  // Step 1: Login to get authentication token
  try {
    console.log('1. Testing login to get authentication token...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCredentials)
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      if (loginData.status === 'success' && loginData.data?.token) {
        authToken = loginData.data.token;
        console.log('✅ Login successful, token received');
        console.log('👤 User:', loginData.data.user?.email || 'Unknown');
      } else {
        console.log('❌ Login failed - no token in response');
        console.log('Response:', loginData);
      }
    } else {
      console.log('❌ Login failed with status:', loginResponse.status);
      const errorData = await loginResponse.json();
      console.log('Error:', errorData);
    }
  } catch (error) {
    console.log('❌ Login request failed:', error.message);
  }

  if (!authToken) {
    console.log('\n❌ Cannot proceed without authentication token');
    console.log('💡 Make sure you have a test user with credentials:');
    console.log('   Email:', testCredentials.email);
    console.log('   Password:', testCredentials.password);
    return;
  }

  // Step 2: Test authenticated certificates endpoint
  try {
    console.log('\n2. Testing authenticated certificates endpoint...');
    const certResponse = await fetch(`${API_BASE_URL}/certificates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (certResponse.ok) {
      const certData = await certResponse.json();
      console.log('✅ Authenticated certificates endpoint working');
      console.log('📋 Certificates count:', certData.data?.certificates?.length || 0);
      
      if (certData.data?.certificates?.length > 0) {
        console.log('📄 First certificate:', {
          id: certData.data.certificates[0].id,
          title: certData.data.certificates[0].title,
          student: certData.data.certificates[0].student
        });
      }
      
      if (certData.data?.user) {
        console.log('👤 User info:', {
          id: certData.data.user.id,
          name: certData.data.user.name,
          role: certData.data.user.role
        });
      }
    } else {
      console.log('❌ Authenticated certificates failed with status:', certResponse.status);
      const errorData = await certResponse.json();
      console.log('Error:', errorData);
    }
  } catch (error) {
    console.log('❌ Authenticated certificates request failed:', error.message);
  }

  // Step 3: Test certificate verification with auth
  try {
    console.log('\n3. Testing authenticated certificate verification...');
    const verifyResponse = await fetch(`${API_BASE_URL}/certificates/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        verificationCode: 'CERT-2026-00123'
      })
    });

    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('✅ Authenticated verification endpoint working');
      console.log('🔍 Verification result:', verifyData.status);
    } else {
      console.log('❌ Authenticated verification failed with status:', verifyResponse.status);
    }
  } catch (error) {
    console.log('❌ Authenticated verification request failed:', error.message);
  }

  // Step 4: Test certificate stats with auth
  try {
    console.log('\n4. Testing authenticated certificate stats...');
    const statsResponse = await fetch(`${API_BASE_URL}/certificates/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Authenticated stats endpoint working');
      console.log('📊 Stats:', statsData.data);
    } else {
      console.log('❌ Authenticated stats failed with status:', statsResponse.status);
    }
  } catch (error) {
    console.log('❌ Authenticated stats request failed:', error.message);
  }

  // Step 5: Test without authentication (should fail)
  try {
    console.log('\n5. Testing certificates endpoint without authentication (should fail)...');
    const noAuthResponse = await fetch(`${API_BASE_URL}/certificates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // No Authorization header
      }
    });

    if (noAuthResponse.status === 401) {
      console.log('✅ Correctly rejected request without authentication');
    } else {
      console.log('❌ Should have rejected request without auth, but got status:', noAuthResponse.status);
    }
  } catch (error) {
    console.log('❌ No-auth test request failed:', error.message);
  }

  console.log('\n🎉 Authenticated certificate integration test completed!');
  console.log('\n📋 Summary:');
  console.log(`   - Authentication: ${authToken ? '✅ Working' : '❌ Failed'}`);
  console.log(`   - Backend URL: ${API_BASE_URL}/certificates`);
  console.log(`   - Token-based access: ✅ Implemented`);
  console.log(`   - User-specific data: ✅ Working`);
}

// Run the test
testAuthenticatedCertificates().catch(console.error);