// Centralized API Service - Uses api.js config with enhanced error handling and retry logic
import api from './api';
import API_CONFIG from '../config/api';
import { handleApiError, withRetry, validateApiResponse } from '../utils/apiHelpers';

class CentralizedApiService {
  constructor() {
    this.api = api;
    this.config = API_CONFIG;
    this.endpoints = API_CONFIG.ENDPOINTS;
  }

  // Student-related API calls
  async getStudentProfile() {
    return withRetry(async () => {
      const response = await this.api.get(this.endpoints.STUDENT.PROFILE);
      if (validateApiResponse(response, ['student'])) {
        return response;
      }
      throw new Error('Invalid student profile response');
    }, 3);
  }

  async getStudentList(params = {}) {
    return withRetry(async () => {
      try {
        // Try authenticated endpoint first
        const response = await this.api.get(this.endpoints.STUDENT.LIST, params);
        if (validateApiResponse(response, ['students'])) {
          return response;
        }
      } catch (error) {
        console.log('⚠️ Authenticated student list failed, trying public endpoint');
        // Fallback to public endpoint
        const publicResponse = await this.api.get('/students/public', params);
        if (validateApiResponse(publicResponse, ['students'])) {
          return publicResponse;
        }
      }
      throw new Error('Failed to fetch student list from all endpoints');
    }, 2);
  }

  async updateStudentProfile(profileData) {
    return withRetry(async () => {
      const response = await this.api.put(this.endpoints.STUDENT.UPDATE, profileData);
      if (validateApiResponse(response)) {
        return response;
      }
      throw new Error('Invalid profile update response');
    }, 2);
  }

  // Certificate-related API calls
  async getCertificates(params = {}) {
    return withRetry(async () => {
      try {
        // Try authenticated endpoint first
        const response = await this.api.get(this.endpoints.CERTIFICATES.LIST, params);
        if (validateApiResponse(response, ['certificates'])) {
          return response;
        }
      } catch (error) {
        console.log('⚠️ Authenticated certificates failed, trying public endpoint');
        // Fallback to public endpoint
        const publicResponse = await this.api.get('/certificates/public', params);
        if (validateApiResponse(publicResponse, ['certificates'])) {
          return publicResponse;
        }
      }
      throw new Error('Failed to fetch certificates from all endpoints');
    }, 2);
  }

  async verifyCertificate(verificationCode) {
    return withRetry(async () => {
      const response = await this.api.post('/certificates/verify', {
        verificationCode: verificationCode
      });
      if (validateApiResponse(response)) {
        return response;
      }
      throw new Error('Invalid certificate verification response');
    }, 2);
  }

  async getCertificateStats(params = {}) {
    return withRetry(async () => {
      const response = await this.api.get(this.endpoints.CERTIFICATES.STATS, params);
      if (validateApiResponse(response)) {
        return response;
      }
      throw new Error('Invalid certificate stats response');
    }, 2);
  }

  // Event-related API calls
  async getEvents(params = {}) {
    return withRetry(async () => {
      try {
        // Try authenticated endpoint first
        const response = await this.api.get(this.endpoints.EVENTS.LIST, params);
        if (validateApiResponse(response, ['events'])) {
          return response;
        }
      } catch (error) {
        console.log('⚠️ Authenticated events failed, trying public endpoint');
        // Fallback to public endpoint
        const publicResponse = await this.api.get('/events/public', params);
        if (validateApiResponse(publicResponse, ['events'])) {
          return publicResponse;
        }
      }
      throw new Error('Failed to fetch events from all endpoints');
    }, 2);
  }

  async registerForEvent(eventId) {
    return withRetry(async () => {
      const response = await this.api.post(this.endpoints.EVENTS.REGISTER, { eventId });
      if (validateApiResponse(response)) {
        return response;
      }
      throw new Error('Invalid event registration response');
    }, 2);
  }

  // Attendance-related API calls
  async getAttendance(params = {}) {
    return withRetry(async () => {
      try {
        // Try authenticated endpoint first
        const response = await this.api.get(this.endpoints.ATTENDANCE.LIST, params);
        if (validateApiResponse(response, ['attendance'])) {
          return response;
        }
      } catch (error) {
        console.log('⚠️ Authenticated attendance failed, trying public endpoint');
        // Fallback to public endpoint
        const publicResponse = await this.api.get('/attendance/public', params);
        if (validateApiResponse(publicResponse, ['attendance'])) {
          return publicResponse;
        }
      }
      throw new Error('Failed to fetch attendance from all endpoints');
    }, 2);
  }

  async markAttendance(attendanceData) {
    return withRetry(async () => {
      const response = await this.api.post(this.endpoints.ATTENDANCE.MARK, attendanceData);
      if (validateApiResponse(response)) {
        return response;
      }
      throw new Error('Invalid attendance marking response');
    }, 2);
  }

  // Fees-related API calls
  async getFees(params = {}) {
    return withRetry(async () => {
      const response = await this.api.get(this.endpoints.FEES.LIST, params);
      if (validateApiResponse(response, ['fees'])) {
        return response;
      }
      throw new Error('Invalid fees response');
    }, 2);
  }

  async payFees(paymentData) {
    return withRetry(async () => {
      const response = await this.api.post(this.endpoints.FEES.PAY, paymentData);
      if (validateApiResponse(response)) {
        return response;
      }
      throw new Error('Invalid payment response');
    }, 2);
  }

  // Belt/Level-related API calls
  async getBeltLevels(params = {}) {
    return withRetry(async () => {
      try {
        // Try authenticated endpoint first
        const response = await this.api.get(this.endpoints.BELTS.LEVELS, params);
        if (validateApiResponse(response, ['belts'])) {
          return response;
        }
      } catch (error) {
        console.log('⚠️ Authenticated belt levels failed, trying public endpoint');
        // Fallback to public endpoint
        const publicResponse = await this.api.get('/belts/public', params);
        if (validateApiResponse(publicResponse, ['belts'])) {
          return publicResponse;
        }
      }
      throw new Error('Failed to fetch belt levels from all endpoints');
    }, 2);
  }

  async getPromotions(params = {}) {
    return withRetry(async () => {
      try {
        // Try authenticated endpoint first
        const response = await this.api.get(this.endpoints.BELTS.PROMOTIONS, params);
        if (validateApiResponse(response, ['promotions'])) {
          return response;
        }
      } catch (error) {
        console.log('⚠️ Authenticated promotions failed, trying public endpoint');
        // Fallback to public endpoint
        const publicResponse = await this.api.get('/promotions/public', params);
        if (validateApiResponse(publicResponse, ['promotions'])) {
          return publicResponse;
        }
      }
      throw new Error('Failed to fetch promotions from all endpoints');
    }, 2);
  }

  async getBeltTests(params = {}) {
    return withRetry(async () => {
      try {
        // Try authenticated endpoint first
        const response = await this.api.get(this.endpoints.BELTS.TESTS, params);
        if (validateApiResponse(response, ['tests'])) {
          return response;
        }
      } catch (error) {
        console.log('⚠️ Authenticated belt tests failed, trying public endpoint');
        // Fallback to public endpoint
        const publicResponse = await this.api.get('/belt-tests/public', params);
        if (validateApiResponse(publicResponse, ['tests'])) {
          return publicResponse;
        }
      }
      throw new Error('Failed to fetch belt tests from all endpoints');
    }, 2);
  }

  // Health check
  async checkHealth() {
    try {
      const response = await this.api.get('/health');
      return validateApiResponse(response);
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
      return false;
    }
  }

  // Generic API call with automatic retry and error handling
  async makeApiCall(method, endpoint, data = null, options = {}) {
    const { retries = 3, context = 'API Call' } = options;
    
    return withRetry(async () => {
      try {
        let response;
        switch (method.toLowerCase()) {
          case 'get':
            response = await this.api.get(endpoint, data || {});
            break;
          case 'post':
            response = await this.api.post(endpoint, data || {});
            break;
          case 'put':
            response = await this.api.put(endpoint, data || {});
            break;
          case 'delete':
            response = await this.api.delete(endpoint);
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }
        
        if (validateApiResponse(response)) {
          return response;
        }
        throw new Error('Invalid API response structure');
      } catch (error) {
        const errorInfo = handleApiError(error, context);
        console.error(`❌ ${context} failed:`, errorInfo);
        throw error;
      }
    }, retries);
  }
}

// Create and export singleton instance
const centralizedApiService = new CentralizedApiService();
export default centralizedApiService;