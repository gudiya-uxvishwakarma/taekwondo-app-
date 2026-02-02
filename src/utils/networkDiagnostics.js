// Network diagnostics for troubleshooting backend connection
import API_CONFIG from '../config/api';

export const runNetworkDiagnostics = async () => {
  console.log('🔍 Running network diagnostics...');
  
  const results = {
    timestamp: new Date().toISOString(),
    tests: {},
    recommendations: [],
  };

  // Test 1: Local development IP
  console.log('📡 Testing Local development IP...');
  try {
    const response = await fetch('https://taekwon-frontend.onrender.com/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    results.tests.localDevelopment = {
      success: response.ok,
      status: response.status,
      url: 'https://taekwon-frontend.onrender.com/api/health',
    };
    if (response.ok) {
      console.log('✅ Local development works!');
    } else {
      console.log('❌ Local development failed:', response.status);
    }
  } catch (error) {
    results.tests.localDevelopment = {
      success: false,
      error: error.message,
      url: 'https://taekwon-frontend.onrender.com/api/health',
    };
    console.log('❌ Local development error:', error.message);
  }

  // Test 2: Localhost (with ADB reverse)
  console.log('📡 Testing localhost (with ADB reverse)...');
  try {
    const response = await fetch('https://taekwon-frontend.onrender.com/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    results.tests.localhost = {
      success: response.ok,
      status: response.status,
      url: 'https://taekwon-frontend.onrender.com/api/health',
    };
    if (response.ok) {
      console.log('✅ Localhost works!');
    } else {
      console.log('❌ Localhost failed:', response.status);
    }
  } catch (error) {
    results.tests.localhost = {
      success: false,
      error: error.message,
      url: 'https://taekwon-frontend.onrender.com/api/health',
    };
    console.log('❌ Localhost error:', error.message);
  }

  // Test 3: Android Emulator IP (10.0.2.2)
  console.log('📡 Testing Android emulator IP (10.0.2.2)...');
  try {
    const response = await fetch('https://taekwon-frontend.onrender.com/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    results.tests.emulatorIP = {
      success: response.ok,
      status: response.status,
      url: 'https://taekwon-frontend.onrender.com/api/health',
    };
    if (response.ok) {
      console.log('✅ Emulator IP works!');
    } else {
      console.log('❌ Emulator IP failed:', response.status);
    }
  } catch (error) {
    results.tests.emulatorIP = {
      success: false,
      error: error.message,
      url: 'https://taekwon-frontend.onrender.com/api/health',
    };
    console.log('❌ Emulator IP error:', error.message);
  }

  // Test 3: Auth endpoint test
  console.log('📡 Testing auth endpoint...');
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      }),
      timeout: 10000,
    });
    
    // We expect this to fail with 401, but if we get a response, the endpoint is reachable
    results.tests.authEndpoint = {
      success: response.status === 401, // 401 means endpoint is working but credentials are wrong
      status: response.status,
      url: `${API_CONFIG.BASE_URL}/auth/login`,
      note: response.status === 401 ? 'Endpoint reachable (expected 401)' : 'Unexpected response'
    };
    
    if (response.status === 401) {
      console.log('✅ Auth endpoint reachable (got expected 401)');
    } else {
      console.log('⚠️ Auth endpoint responded with:', response.status);
    }
  } catch (error) {
    results.tests.authEndpoint = {
      success: false,
      error: error.message,
      url: `${API_CONFIG.BASE_URL}/auth/login`,
    };
    console.log('❌ Auth endpoint error:', error.message);
  }

  // Generate recommendations
  const workingConnections = Object.values(results.tests).filter(test => test.success);
  
  if (workingConnections.length === 0) {
    results.recommendations = [
      '🔴 No backend connections working',
      '1. Make sure backend server is running: cd Taekwondo_backend && npm start',
      '2. Run ADB port forwarding: adb reverse tcp:5000 tcp:5000',
      '3. Check Windows Firewall settings',
      '4. Verify backend is accessible at https://taekwon-frontend.onrender.com/api/health',
      '5. Try restarting the Android emulator',
    ];
  } else if (results.tests.localDevelopment?.success) {
    results.recommendations = [
      '✅ Local development URL working',
      'Your app should connect to the local backend successfully',
      'All features should work with the local development API',
    ];
  } else if (results.tests.localhost?.success) {
    results.recommendations = [
      '✅ Localhost connection working with ADB reverse',
      'Your app should be able to connect to the local backend',
      'If login still fails, check backend logs for authentication errors',
    ];
  } else if (results.tests.emulatorIP?.success) {
    results.recommendations = [
      '✅ Emulator IP (10.0.2.2) is working',
      'Consider updating API config to use 10.0.2.2 instead of localhost',
    ];
  } else {
    results.recommendations = [
      '⚠️ Mixed results - some connections working',
      'Check individual test results above',
      'Try running ADB port forwarding: adb reverse tcp:5000 tcp:5000',
    ];
  }

  console.log('📊 Network diagnostics complete:', results);
  return results;
};

export const getRecommendedApiUrl = async () => {
  const diagnostics = await runNetworkDiagnostics();
  
  if (diagnostics.tests.localDevelopment?.success) {
    return 'https://taekwon-frontend.onrender.com/api';
  } else if (diagnostics.tests.localhost?.success) {
    return 'https://taekwon-frontend.onrender.com/api';
  } else if (diagnostics.tests.emulatorIP?.success) {
    return 'https://taekwon-frontend.onrender.com/api';
  } else {
    return null; // No working connection found
  }
};