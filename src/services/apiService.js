import axios from 'axios';
import API_CONFIG from '../config/api';
import { getToken, removeToken } from '../utils/tokenStorage';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.workingUrl = null; // Cache for working URL
    this.fallbackUrls = API_CONFIG.FALLBACK_URLS || [
      'https://taekwon-frontend.onrender.com/api',  // Render production URL - Primary
      'http://192.168.1.48:5000/api',  // Local development IP - Fallback
      'http://10.0.2.2:5000/api',      // Android emulator mapping - Fallback
      'http://localhost:5000/api',     // Localhost (iOS simulator) - Fallback
    ];

    // Create axios instance
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('🔐 Authorization header added');
        } else {
          console.log('⚠️ No token found - request will be unauthorized');
        }
        console.log('📤 Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle auth errors
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log('✅ Response:', response.status, response.config.url);
        return response;
      },
      async (error) => {
        console.error('❌ Response error:', error.response?.status, error.message);
        
        if (error.response?.status === 401) {
          console.log('❌ 401 Unauthorized - Token expired or invalid');
          await removeToken();
          throw new Error('Authentication failed');
        }
        
        return Promise.reject(error);
      }
    );
  }

  async findWorkingUrl() {
    console.log('🔍 Finding working backend URL...');
    
    for (const url of this.fallbackUrls) {
      try {
        console.log(`📡 Testing: ${url}`);
        const response = await axios.get(`${url}/health`, {
          timeout: 10000,
        });
        
        if (response.status === 200) {
          console.log(`✅ Working URL found: ${url}`);
          this.baseURL = url;
          this.workingUrl = url;
          this.axiosInstance.defaults.baseURL = url;
          return url;
        }
      } catch (error) {
        console.log(`❌ Failed: ${url} - ${error.message}`);
      }
    }
    
    console.log('❌ No working backend URL found');
    return null;
  }

  async makeRequest(method, endpoint, data = null, config = {}) {
    try {
      // First, try to find a working URL if we haven't already
      if (!this.workingUrl) {
        console.log('🔍 No working URL cached, finding one...');
        this.workingUrl = await this.findWorkingUrl();
        if (this.workingUrl) {
          console.log('✅ Updated base URL to:', this.workingUrl);
        }
      }

      let response;
      switch (method.toLowerCase()) {
        case 'get':
          response = await this.axiosInstance.get(endpoint, config);
          break;
        case 'post':
          response = await this.axiosInstance.post(endpoint, data, config);
          break;
        case 'put':
          response = await this.axiosInstance.put(endpoint, data, config);
          break;
        case 'delete':
          response = await this.axiosInstance.delete(endpoint, config);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return response.data;
    } catch (error) {
      console.error('💥 API Request failed:', error);
      
      // If it's a network error, try to find working URL and retry once
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        console.log('🔄 Network error detected, trying fallback URLs...');
        
        // Reset the working URL cache and try to find a new one
        this.workingUrl = null;
        const workingUrl = await this.findWorkingUrl();
        
        if (workingUrl && workingUrl !== this.baseURL) {
          console.log('🔄 Retrying with new URL:', workingUrl);
          
          try {
            let retryResponse;
            switch (method.toLowerCase()) {
              case 'get':
                retryResponse = await this.axiosInstance.get(endpoint, config);
                break;
              case 'post':
                retryResponse = await this.axiosInstance.post(endpoint, data, config);
                break;
              case 'put':
                retryResponse = await this.axiosInstance.put(endpoint, data, config);
                break;
              case 'delete':
                retryResponse = await this.axiosInstance.delete(endpoint, config);
                break;
            }
            
            console.log('✅ Retry successful with fallback URL');
            return retryResponse.data;
          } catch (retryError) {
            console.log('❌ Retry also failed:', retryError.message);
          }
        }
      }
      
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    return this.makeRequest('get', endpoint, null, { params });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.makeRequest('post', endpoint, data);
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.makeRequest('put', endpoint, data);
  }

  // DELETE request
  async delete(endpoint) {
    return this.makeRequest('delete', endpoint);
  }
}

export default new ApiService();