// API Wrapper with automatic fallback handling
import api from '../services/api';
import { handleAuthError, logApiCall, logApiSuccess, logApiFallback } from './authErrorHandler';

export class ApiWrapper {
  static async safeApiCall(endpoint, params = {}, screenName = 'Unknown', fallbackData = null) {
    try {
      logApiCall(endpoint, 'GET', params);
      
      const result = await api.get(endpoint, params);
      
      if (result && result.status === 'success') {
        const dataLength = result.data ? Object.keys(result.data).length : 0;
        logApiSuccess(endpoint, dataLength);
        return {
          success: true,
          data: result.data,
          source: 'backend'
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      const errorInfo = handleAuthError(error, screenName);
      
      if (errorInfo.shouldUseFallback) {
        logApiFallback(screenName, errorInfo.message);
        return {
          success: true,
          data: fallbackData,
          source: 'fallback',
          message: errorInfo.message
        };
      } else {
        return {
          success: false,
          error: error.message,
          source: 'error'
        };
      }
    }
  }

  static async safePostCall(endpoint, data = {}, screenName = 'Unknown') {
    try {
      logApiCall(endpoint, 'POST', data);
      
      const result = await api.post(endpoint, data);
      
      if (result && result.status === 'success') {
        logApiSuccess(endpoint);
        return {
          success: true,
          data: result.data,
          source: 'backend'
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      const errorInfo = handleAuthError(error, screenName);
      
      return {
        success: false,
        error: errorInfo.message,
        source: 'error',
        isAuthError: errorInfo.isAuthError
      };
    }
  }
}

export default ApiWrapper;