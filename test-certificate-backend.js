// Test script to verify certificate backend integration
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';

async function testCertificateEndpoints() {
  console.log('🧪 Testing Certificate Backend Integration...\n');

  // Test 1: Health check
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  // Test 2: Get certificates
  try {
    console.log('\n2. Testing certificates endpoint...');
    const certResponse = await fetch(`${API_BASE_URL}/certificates`);
    const certData = await certResponse.json();
    console.log('✅ Certificates endpoint:', certData.status);
    console.log('📋 Certificates count:', certData.data?.certificates?.length || 0);
    
    if (certData.data?.certificates?.length > 0) {
      console.log('📄 First certificate:', {
        id: certData.data.certificates[0].id,
        title: certData.data.certificates[0].title,
        student: certData.data.certificates[0].student
      });
    }
  } catch (error) {
    console.log('❌ Certificates endpoint failed:', error.message);
  }

  // Test 3: Certificate verification
  try {
    console.log('\n3. Testing certificate verification...');
    const verifyResponse = await fetch(`${API_BASE_URL}/certificates/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        verificationCode: 'CERT-2026-00123'
      })
    });
    const verifyData = await verifyResponse.json();
    console.log('✅ Verification endpoint:', verifyData.status);
    
    if (verifyData.data) {
      console.log('🔍 Verified certificate:', {
        id: verifyData.data.id,
        title: verifyData.data.title,
        student: verifyData.data.student
      });
    }
  } catch (error) {
    console.log('❌ Verification endpoint failed:', error.message);
  }

  // Test 4: Certificate stats
  try {
    console.log('\n4. Testing certificate stats...');
    const statsResponse = await fetch(`${API_BASE_URL}/certificates/stats`);
    const statsData = await statsResponse.json();
    console.log('✅ Stats endpoint:', statsData.status);
    console.log('📊 Total certificates:', statsData.data?.totalCertificates || 0);
  } catch (error) {
    console.log('❌ Stats endpoint failed:', error.message);
  }

  console.log('\n🎉 Certificate backend integration test completed!');
}

// Run the test
testCertificateEndpoints().catch(console.error);