// React Native compatible API service using fetch
import { getToken, removeToken } from '../utils/tokenStorage';
import API_CONFIG from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.fallbackUrls = API_CONFIG.FALLBACK_URLS || [];
    this.workingUrl = null;
    this.retryCount = 3;
  }

  // Helper method to create request config
  async createRequestConfig(method = 'GET', data = null, customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    // Add auth token if available and not skipping auth
    if (!customHeaders.skipAuth) {
      try {
        const token = await getToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
          console.log('🔐 Authorization header added');
        } else {
          console.log('⚠️ No token available for authentication');
        }
      } catch (error) {
        console.log('⚠️ Token retrieval failed:', error.message);
      }
    } else {
      console.log('🔓 Skipping authentication for public endpoint');
    }

    const config = {
      method,
      headers,
      timeout: this.timeout,
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    return config;
  }

  // Helper method to find working URL with retry logic
  async findWorkingUrl() {
    console.log('🔍 Finding working backend URL...');
    
    const urlsToTry = [this.baseURL, ...this.fallbackUrls];
    
    for (const url of urlsToTry) {
      try {
        console.log(`📡 Testing: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${url}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log(`✅ Working URL found: ${url}`);
          this.workingUrl = url;
          this.baseURL = url;
          return url;
        }
      } catch (error) {
        console.log(`❌ Failed: ${url} - ${error.message}`);
      }
    }
    
    console.log('❌ No working backend URL found');
    return null;
  }

  // Enhanced request method with retry and fallback logic
  async makeRequestWithRetry(method, endpoint, data = null, options = {}) {
    let lastError;
    
    // Try with current working URL first
    if (this.workingUrl) {
      try {
        return await this.makeRequest(method, endpoint, data, options);
      } catch (error) {
        console.log('⚠️ Request failed with working URL, trying fallbacks...');
        lastError = error;
        this.workingUrl = null; // Reset working URL
      }
    }
    
    // If authentication failed, try without auth for public endpoints
    if (lastError && lastError.message.includes('Authentication failed')) {
      console.log('🔄 Authentication failed, trying public endpoints...');
      
      // Map authenticated endpoints to public endpoints
      const publicEndpointMap = {
        '/students': '/students/public',
        '/certificates': '/certificates/public',
        '/events': '/events/public',
        '/attendance': '/attendance/public',
        '/belts/levels': '/belts-public',
        '/belts/promotions': '/promotions-public',
        '/belts/tests': '/belt-tests-public'
      };
      
      const publicEndpoint = publicEndpointMap[endpoint];
      if (publicEndpoint) {
        try {
          console.log(`🔄 Trying public endpoint: ${publicEndpoint}`);
          return await this.makeRequest(method, publicEndpoint, data, { ...options, skipAuth: true });
        } catch (publicError) {
          console.log('❌ Public endpoint also failed:', publicError.message);
        }
      }
    }
    
    // Try to find working URL and retry
    const workingUrl = await this.findWorkingUrl();
    if (workingUrl) {
      try {
        return await this.makeRequest(method, endpoint, data, options);
      } catch (error) {
        lastError = error;
      }
    }
    
    // If all fails, throw the last error
    throw lastError || new Error('All API endpoints failed');
  }

  // Core request method
  async makeRequest(method, endpoint, data = null, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log(`📤 ${method.toUpperCase()} Request:`, url);

    const config = await this.createRequestConfig(method, data, options.headers);
    
    // Add timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return await this.handleResponse(response, url);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  // Helper method to handle response
  async handleResponse(response, url) {
    console.log('📥 API Response:', response.status, url);

    if (response.status === 401) {
      console.log('❌ 401 Unauthorized - Token expired or invalid');
      try {
        await removeToken();
      } catch (tokenError) {
        console.log('⚠️ Token removal failed:', tokenError.message);
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  // GET request with retry logic
  async get(endpoint, params = {}) {
    try {
      let url = endpoint;
      
      // Add query parameters
      if (Object.keys(params).length > 0) {
        const queryString = new URLSearchParams(params).toString();
        url += `?${queryString}`;
      }

      return await this.makeRequestWithRetry('GET', url);
    } catch (error) {
      console.error('❌ GET Request failed:', error.message);
      throw error;
    }
  }

  // POST request with retry logic
  async post(endpoint, data = {}) {
    try {
      return await this.makeRequestWithRetry('POST', endpoint, data);
    } catch (error) {
      console.error('❌ POST Request failed:', error.message);
      throw error;
    }
  }

  // PUT request with retry logic
  async put(endpoint, data = {}) {
    try {
      return await this.makeRequestWithRetry('PUT', endpoint, data);
    } catch (error) {
      console.error('❌ PUT Request failed:', error.message);
      throw error;
    }
  }

  // DELETE request with retry logic
  async delete(endpoint) {
    try {
      return await this.makeRequestWithRetry('DELETE', endpoint);
    } catch (error) {
      console.error('❌ DELETE Request failed:', error.message);
      throw error;
    }
  }
}

// Create and export instance
const api = new ApiService();
export default api;