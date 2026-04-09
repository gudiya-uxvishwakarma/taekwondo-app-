import api from './api';
import ApiService from './apiService';
import API_CONFIG from '../config/api';
import { saveToken, removeToken } from '../utils/tokenStorage';

class AuthService {
  async login(credentials) {
    try {
      const response = await ApiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
      
      if (response.status === 'success' && response.data && response.data.token) {
        await saveToken(response.data.token);
        return response.data; // Return the data object containing user and token
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      // Only log in development
      if (__DEV__) {
        console.log('⚠️ Login failed:', error.message);
      }
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await ApiService.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
      
      if (response.status === 'success' && response.data && response.data.token) {
        await saveToken(response.data.token);
        return response.data;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      // JWT is stateless — just clear the token locally, no server call needed
    } catch (error) {
      // silent
    } finally {
      await removeToken();
    }
  }

  async refreshToken() {
    try {
      const response = await ApiService.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH);
      
      if (response.token) {
        await saveToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await removeToken();
      throw error;
    }
  }

  async changePassword(passwordData) {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      
      if (response.status === 'success') {
        return response;
      }
      
      throw new Error(response.message || 'Password change failed');
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  }
}

export default new AuthService();