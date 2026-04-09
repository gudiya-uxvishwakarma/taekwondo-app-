import axios from 'axios';
import API_CONFIG from '../config/api';
import { getToken, removeToken } from '../utils/tokenStorage';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;

  
    // Create axios instance
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'bypass-tunnel-reminder': 'true',
      },
    });

    // Add request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      async config => {
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
      error => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      },
    );

    // Add response interceptor to handle auth errors
    this.axiosInstance.interceptors.response.use(
      response => {
        console.log('✅ Response:', response.status, response.config.url);
        return response;
      },
      async error => {
        const status = error.response?.status;

        if (status !== 404) {
          console.error('❌ Response error:', status, error.message);
        }

        if (error.response?.status === 401) {
          const url = error.config?.url || '';
          const isLoginRequest = url.includes('/auth/login') || url.includes('/login');

          if (isLoginRequest) {
            const message = error.response?.data?.message || 'Invalid email or password';
            throw new Error(message);
          }

          console.log('❌ 401 Unauthorized - Token expired or invalid');
          await removeToken();
          throw new Error('Authentication failed');
        }

        // For all other errors, extract backend message if available
        if (error.response?.data?.message) {
          const backendError = new Error(error.response.data.message);
          backendError.response = error.response;
          return Promise.reject(backendError);
        }

        return Promise.reject(error);
      },
    );
  }

  async findWorkingUrl() {
    // Skip health check probing — just use the configured base URL directly
    console.log('✅ Using configured base URL:', this.baseURL);
    this.workingUrl = this.baseURL;
    return this.baseURL;
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
      // Only log in development, reduce noise
      if (__DEV__ && error.response?.status !== 404) {
        console.log('⚠️ API Request failed:', error.message);
      }

      // If it's a network error, try to find working URL and retry once
      if (
        error.code === 'NETWORK_ERROR' ||
        error.message.includes('Network Error')
      ) {
        console.log('🔄 Network error, skipping retry to avoid long wait');
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
