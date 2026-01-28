import API_CONFIG from '../config/api';
import { getToken, removeToken } from '../utils/tokenStorage';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.workingUrl = null; // Cache for working URL
    this.fallbackUrls = API_CONFIG.FALLBACK_URLS || [
      'http://192.168.1.22:5000/api',  // Your computer's IP - Primary (WORKING)
      'http://10.0.2.2:5000/api',      // Android emulator mapping
      'http://localhost:5000/api',     // Localhost (iOS simulator)
      'http://127.0.0.1:5000/api'      // Loopback
    ];
  }

  async findWorkingUrl() {
    console.log('🔍 Finding working backend URL...');
    
    for (const url of this.fallbackUrls) {
      try {
        console.log(`📡 Testing: ${url}`);
        const response = await fetch(`${url}/health`, {
          method: 'GET',
          timeout: 5000,
        });
        
        if (response.ok) {
          console.log(`✅ Working URL found: ${url}`);
          this.baseURL = url;
          this.workingUrl = url;
          return url;
        }
      } catch (error) {
        console.log(`❌ Failed: ${url} - ${error.message}`);
      }
    }
    
    console.log('❌ No working backend URL found');
    return null;
  }

  async makeRequest(endpoint, options = {}) {
    // First, try to find a working URL if we haven't already
    if (!this.workingUrl) {
      console.log('🔍 No working URL cached, finding one...');
      this.workingUrl = await this.findWorkingUrl();
      if (this.workingUrl) {
        this.baseURL = this.workingUrl;
        console.log('✅ Updated base URL to:', this.baseURL);
      }
    }

    let url = `${this.baseURL}${endpoint}`;
    const token = await getToken();
    
    console.log('🔗 Making API request to:', url);
    console.log('🔑 Token available:', !!token);
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
      console.log('🔐 Authorization header added');
    } else {
      console.log('⚠️ No token found - request will be unauthorized');
    }

    const config = {
      method: 'GET',
      headers: defaultHeaders,
      timeout: this.timeout,
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      console.log('📤 Request config:', { method: config.method, url: url });
      let response = await fetch(url, config);
      
      console.log('📥 Response status:', response.status);
      
      if (response.status === 401) {
        console.log('❌ 401 Unauthorized - Token expired or invalid');
        await removeToken();
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        console.log('❌ HTTP Error:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Request successful:', data);
      return data;
    } catch (error) {
      console.error('💥 API Request failed:', error);
      
      // If it's a network error, try to find working URL and retry once
      if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
        console.log('🔄 Network error detected, trying fallback URLs...');
        
        // Reset the working URL cache and try to find a new one
        this.workingUrl = null;
        const workingUrl = await this.findWorkingUrl();
        
        if (workingUrl && workingUrl !== this.baseURL) {
          console.log('🔄 Retrying with new URL:', workingUrl);
          this.baseURL = workingUrl;
          this.workingUrl = workingUrl;
          
          try {
            const retryUrl = `${workingUrl}${endpoint}`;
            console.log('🔄 Retry URL:', retryUrl);
            const retryResponse = await fetch(retryUrl, config);
            
            if (retryResponse.ok) {
              const data = await retryResponse.json();
              console.log('✅ Retry successful with fallback URL');
              return data;
            } else {
              console.log('❌ Retry failed with status:', retryResponse.status);
            }
          } catch (retryError) {
            console.log('❌ Retry also failed:', retryError.message);
          }
        } else {
          console.log('❌ No working URL found for retry');
        }
      }
      
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.makeRequest(url, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.makeRequest(endpoint, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();