// Test backend connection
import API_CONFIG from '../config/api';

export const testBackendConnection = async () => {
  try {
    console.log('🧪 Testing backend connection...');
    console.log('🔗 Backend URL:', API_CONFIG.BASE_URL);
    
    // Test simple endpoint without authentication
    const testUrl = `${API_CONFIG.BASE_URL.replace('/api', '')}/api/simple-test`;
    console.log('📡 Testing URL:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
    
    console.log('📥 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend connection successful:', data);
      return { success: true, data };
    } else {
      console.log('❌ Backend connection failed:', response.status, response.statusText);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error('💥 Backend connection test failed:', error);
    
    // Provide more specific error messages
    let errorMessage = error.message;
    if (error.message.includes('Network request failed')) {
      errorMessage = 'Cannot reach backend server. Make sure:\n1. Backend is running on port 5000\n2. Using correct emulator IP (10.0.2.2)\n3. No firewall blocking connection';
    }
    
    return { success: false, error: errorMessage };
  }
};

export const testAuthEndpoint = async () => {
  try {
    console.log('🧪 Testing auth endpoint...');
    
    const testUrl = `${API_CONFIG.BASE_URL}/auth/test`;
    console.log('📡 Testing auth URL:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
    
    console.log('📥 Auth endpoint response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Auth endpoint accessible:', data);
      return { success: true, data };
    } else {
      console.log('❌ Auth endpoint failed:', response.status);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error('💥 Auth endpoint test failed:', error);
    return { success: false, error: error.message };
  }
};

// Test multiple connection methods
export const testAllConnections = async () => {
  const results = {
    emulatorIP: null,
    localhost: null,
    networkIP: null,
  };
  
  // Test Android emulator IP
  try {
    const response = await fetch('http://10.0.2.2:5000/api/simple-test', { timeout: 3000 });
    results.emulatorIP = response.ok;
  } catch (e) {
    results.emulatorIP = false;
  }
  
  // Test localhost
  try {
    const response = await fetch('http://localhost:5000/api/simple-test', { timeout: 3000 });
    results.localhost = response.ok;
  } catch (e) {
    results.localhost = false;
  }
  
  // Test 127.0.0.1
  try {
    const response = await fetch('http://127.0.0.1:5000/api/simple-test', { timeout: 3000 });
    results.networkIP = response.ok;
  } catch (e) {
    results.networkIP = false;
  }
  
  console.log('🔍 Connection test results:', results);
  return results;
};