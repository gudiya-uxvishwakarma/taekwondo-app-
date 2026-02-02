// Simple network connectivity test
export const testNetworkConnection = async () => {
  console.log('🧪 Testing network connectivity...');
  
  const testUrls = [
    'https://taekwon-frontend.onrender.com/api/simple-test', // Local development IP - Original
    'https://taekwon-frontend.onrender.com/api/simple-test',     // Emulator mapping
    'https://taekwon-frontend.onrender.com/api/simple-test',    // Localhost
  ];
  
  for (const url of testUrls) {
    try {
      console.log(` Testing: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        timeout: 5000,
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Success with ${url}:`, data);
        return { success: true, workingUrl: url, data };
      } else {
        console.log(`❌ Failed with ${url}: HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error with ${url}:`, error.message);
    }
  }
  
  console.log('❌ All network tests failed');
  return { success: false, error: 'No working connection found' };
};

export const testLogin = async (credentials) => {
  console.log('🔐 Testing direct login...');
  
  const testUrls = [
    'https://taekwon-frontend.onrender.com/api/logins', // Local development IP - Original
    'https://taekwon-frontend.onrender.com/api/logins',     // Emulator mapping
    'https://taekwon-frontend.onrender.com/api/logins'     // Localhost
  ];
  
  for (const url of testUrls) {
    try {
      console.log(`📡 Testing login with: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        timeout: 10000,
      });
      
      console.log(`📥 Response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Login success with ${url}:`, data);
        return { success: true, workingUrl: url, data };
      } else {
        const errorData = await response.json();
        console.log(`❌ Login failed with ${url}:`, errorData);
      }
    } catch (error) {
      console.log(`❌ Login error with ${url}:`, error.message);
    }
  }
  
  console.log('❌ All login tests failed');
  return { success: false, error: 'Login failed with all URLs' };
};