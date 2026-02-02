// API Helper utilities for consistent error handling and loading states
import API_CONFIG from '../config/api';

/**
 * Standardized API error handler
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @returns {Object} - Formatted error response
 */
export const handleApiError = (error, context = 'API Request') => {
  console.error(`❌ ${context} failed:`, error);
  
  // Check for specific error types
  if (error.message.includes('Authentication failed') || error.message.includes('401')) {
    return {
      type: 'AUTH_ERROR',
      message: 'Authentication required. Please login again.',
      shouldRetry: false
    };
  }
  
  if (error.message.includes('timeout') || error.message.includes('Network Error')) {
    return {
      type: 'NETWORK_ERROR',
      message: 'Network connection failed. Please check your internet connection.',
      shouldRetry: true
    };
  }
  
  if (error.message.includes('404')) {
    return {
      type: 'NOT_FOUND',
      message: 'Requested resource not found.',
      shouldRetry: false
    };
  }
  
  if (error.message.includes('500')) {
    return {
      type: 'SERVER_ERROR',
      message: 'Server error occurred. Please try again later.',
      shouldRetry: true
    };
  }
  
  // Generic error
  return {
    type: 'GENERIC_ERROR',
    message: error.message || 'An unexpected error occurred.',
    shouldRetry: true
  };
};

/**
 * Retry wrapper for API calls
 * @param {Function} apiCall - The API call function
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {Promise} - API call result
 */
export const withRetry = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 API attempt ${attempt}/${maxRetries}`);
      const result = await apiCall();
      console.log(`✅ API call succeeded on attempt ${attempt}`);
      return result;
    } catch (error) {
      lastError = error;
      console.log(`❌ API attempt ${attempt} failed:`, error.message);
      
      // Don't retry for authentication errors
      if (error.message.includes('Authentication failed') || error.message.includes('401')) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
};

/**
 * Loading state manager
 */
export class LoadingManager {
  constructor() {
    this.loadingStates = new Map();
    this.listeners = new Set();
  }
  
  setLoading(key, isLoading) {
    this.loadingStates.set(key, isLoading);
    this.notifyListeners();
  }
  
  isLoading(key) {
    return this.loadingStates.get(key) || false;
  }
  
  isAnyLoading() {
    return Array.from(this.loadingStates.values()).some(loading => loading);
  }
  
  addListener(listener) {
    this.listeners.add(listener);
  }
  
  removeListener(listener) {
    this.listeners.delete(listener);
  }
  
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.loadingStates));
  }
}

/**
 * Create a standardized API service wrapper
 * @param {Object} api - The API service instance
 * @returns {Object} - Wrapped API service with consistent error handling
 */
export const createApiWrapper = (api) => {
  return {
    async get(endpoint, params = {}, options = {}) {
      const { retries = 3, context = 'GET Request' } = options;
      
      return withRetry(async () => {
        try {
          return await api.get(endpoint, params);
        } catch (error) {
          const errorInfo = handleApiError(error, context);
          if (!errorInfo.shouldRetry) {
            throw error;
          }
          throw error;
        }
      }, retries);
    },
    
    async post(endpoint, data = {}, options = {}) {
      const { retries = 3, context = 'POST Request' } = options;
      
      return withRetry(async () => {
        try {
          return await api.post(endpoint, data);
        } catch (error) {
          const errorInfo = handleApiError(error, context);
          if (!errorInfo.shouldRetry) {
            throw error;
          }
          throw error;
        }
      }, retries);
    },
    
    async put(endpoint, data = {}, options = {}) {
      const { retries = 3, context = 'PUT Request' } = options;
      
      return withRetry(async () => {
        try {
          return await api.put(endpoint, data);
        } catch (error) {
          const errorInfo = handleApiError(error, context);
          if (!errorInfo.shouldRetry) {
            throw error;
          }
          throw error;
        }
      }, retries);
    },
    
    async delete(endpoint, options = {}) {
      const { retries = 3, context = 'DELETE Request' } = options;
      
      return withRetry(async () => {
        try {
          return await api.delete(endpoint);
        } catch (error) {
          const errorInfo = handleApiError(error, context);
          if (!errorInfo.shouldRetry) {
            throw error;
          }
          throw error;
        }
      }, retries);
    }
  };
};

/**
 * Validate API response structure
 * @param {Object} response - API response
 * @param {Array} requiredFields - Required fields in response.data
 * @returns {boolean} - Whether response is valid
 */
export const validateApiResponse = (response, requiredFields = []) => {
  if (!response || typeof response !== 'object') {
    console.log('❌ Invalid response: not an object');
    return false;
  }
  
  if (response.status !== 'success') {
    console.log('❌ Invalid response: status not success');
    return false;
  }
  
  if (!response.data) {
    console.log('❌ Invalid response: no data field');
    return false;
  }
  
  // Check required fields
  for (const field of requiredFields) {
    if (!(field in response.data)) {
      console.log(`❌ Invalid response: missing required field '${field}'`);
      return false;
    }
  }
  
  console.log('✅ Response validation passed');
  return true;
};

/**
 * Create endpoint URL with base URL from config
 * @param {string} endpoint - The endpoint path
 * @returns {string} - Full URL
 */
export const createEndpointUrl = (endpoint) => {
  const baseUrl = API_CONFIG.BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Format query parameters for URL
 * @param {Object} params - Query parameters
 * @returns {string} - Formatted query string
 */
export const formatQueryParams = (params) => {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Global loading manager instance
export const globalLoadingManager = new LoadingManager();

// Export API configuration for easy access
export { API_CONFIG };