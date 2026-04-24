// Comprehensive API diagnostics tool
export const runApiDiagnostics = async () => {
  console.log('🔍 Starting API Diagnostics...\n');

  const results = {
    timestamp: new Date().toISOString(),
    tests: [],
  };

  // Test 1: Basic connectivity
  console.log('Test 1: Basic Server Connectivity');
  try {
    const response = await fetch('http://192.168.1.22:9000', {
      method: 'HEAD',
      timeout: 5000,
    });
    results.tests.push({
      name: 'Server Reachable',
      status: response.status,
      success: response.status < 500,
      message: `Server responded with ${response.status}`,
    });
    console.log(`✅ Server reachable: ${response.status}\n`);
  } catch (error) {
    results.tests.push({
      name: 'Server Reachable',
      success: false,
      error: error.message,
    });
    console.log(`❌ Server unreachable: ${error.message}\n`);
  }

  // Test 2: API endpoint
  console.log('Test 2: API Endpoint Check');
  try {
    const response = await fetch('http://192.168.1.22:9000/api', {
      method: 'GET',
      timeout: 5000,
    });
    results.tests.push({
      name: 'API Endpoint',
      status: response.status,
      success: response.status < 500,
      message: `API responded with ${response.status}`,
    });
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const text = await response.text();
      console.log(`Response: ${text.substring(0, 200)}\n`);
    } else {
      console.log(`❌ API returned error: ${response.status}\n`);
    }
  } catch (error) {
    results.tests.push({
      name: 'API Endpoint',
      success: false,
      error: error.message,
    });
    console.log(`❌ API error: ${error.message}\n`);
  }

  // Test 3: Specific endpoints
  const endpoints = [
    '/auth/check-phone',
    '/onboarding',
    '/simple-test',
    '/health',
    '/status',
  ];

  console.log('Test 3: Testing Specific Endpoints');
  for (const endpoint of endpoints) {
    try {
      const url = `http://192.168.1.22:9000/api${endpoint}`;
      console.log(`Testing: ${endpoint}`);
      
      const response = await fetch(url, {
        method: 'GET',
        timeout: 5000,
      });

      results.tests.push({
        name: `Endpoint ${endpoint}`,
        status: response.status,
        success: response.status < 500,
      });

      console.log(`  Status: ${response.status}`);
    } catch (error) {
      results.tests.push({
        name: `Endpoint ${endpoint}`,
        success: false,
        error: error.message,
      });
      console.log(`  Error: ${error.message}`);
    }
  }

  // Summary
  console.log('\n📊 Diagnostic Summary:');
  const successCount = results.tests.filter(t => t.success).length;
  const totalCount = results.tests.length;
  console.log(`Passed: ${successCount}/${totalCount}`);
  
  if (successCount === 0) {
    console.log('\n⚠️ CRITICAL: Server appears to be completely down');
    console.log('Recommendations:');
    console.log('1. Check if the server is running');
    console.log('2. Verify the domain is correct');
    console.log('3. Check server logs for errors');
    console.log('4. Contact server administrator');
  } else if (successCount < totalCount) {
    console.log('\n⚠️ WARNING: Some endpoints are failing');
    console.log('Recommendations:');
    console.log('1. Check server logs for specific endpoint errors');
    console.log('2. Verify API routes are properly configured');
    console.log('3. Check for server resource issues');
  } else {
    console.log('\n✅ All tests passed!');
  }

  return results;
};

// Test with retry logic
export const testWithRetry = async (url, options = {}, maxRetries = 3) => {
  const { method = 'GET', body, headers = {}, timeout = 5000 } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries} for ${url}`);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        timeout,
      });

      console.log(`📥 Response: ${response.status}`);

      if (response.status === 503) {
        console.log('⏳ Server unavailable (503), retrying...');
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        continue;
      }

      return {
        success: response.ok,
        status: response.status,
        data: response.ok ? await response.json() : null,
        error: !response.ok ? await response.text() : null,
      };
    } catch (error) {
      console.log(`❌ Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      } else {
        return {
          success: false,
          error: error.message,
        };
      }
    }
  }

  return {
    success: false,
    error: 'Max retries reached',
  };
};
