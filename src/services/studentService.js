import ApiService from './apiService';
import API_CONFIG from '../config/api';

class StudentService {
  async getProfile() {
    try {
      return await ApiService.get(API_CONFIG.ENDPOINTS.STUDENT.PROFILE);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  }

  async getStudentRecord() {
    try {
      console.log('📡 Fetching students from:', API_CONFIG.ENDPOINTS.STUDENT.LIST);
      
      // Try authenticated endpoint first
      try {
        const response = await ApiService.get(API_CONFIG.ENDPOINTS.STUDENT.LIST);
        if (response.status === 'success' && response.data.students) {
          console.log('✅ Found', response.data.students.length, 'students (authenticated)');
          const student = response.data.students[0];
          console.log('👨‍🎓 Using student:', student.fullName, 'ID:', student.id);
          return {
            status: 'success',
            data: { student }
          };
        }
      } catch (authError) {
        console.log('⚠️ Authenticated request failed, trying public endpoint');
      }
      
      // Fallback to public endpoint
      const response = await ApiService.get('/students/public');
      if (response.status === 'success' && response.data.students) {
        console.log('✅ Found', response.data.students.length, 'students (public)');
        const student = response.data.students[0];
        console.log('👨‍🎓 Using student:', student.fullName, 'ID:', student._id);
        return {
          status: 'success',
          data: { student: { ...student, id: student._id } }
        };
      }
      
      throw new Error('No student record found');
    } catch (error) {
      console.error('Failed to fetch student record:', error);
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      return await ApiService.put(API_CONFIG.ENDPOINTS.STUDENT.UPDATE, profileData);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }

  async getCertificates() {
    try {
      console.log('📡 Fetching certificates from:', API_CONFIG.ENDPOINTS.CERTIFICATES.LIST);
      
      // Try authenticated endpoint first
      try {
        const response = await ApiService.get(API_CONFIG.ENDPOINTS.CERTIFICATES.LIST);
        console.log('📥 Certificates response:', response);
        
        if (response && response.status === 'success' && response.data && response.data.certificates) {
          console.log('✅ Got certificates (authenticated):', response.data.certificates.length, 'certificates');
          return this.transformCertificates(response.data.certificates);
        }
      } catch (authError) {
        console.log('⚠️ Authenticated certificates request failed, trying public endpoint');
        console.log('❌ Auth error:', authError.message);
      }
      
      // Fallback to public endpoint
      console.log('🔄 Trying public certificates endpoint...');
      const response = await ApiService.get('/certificates/public');
      console.log('📥 Public certificates response:', response);
      
      if (response && response.status === 'success' && response.data && response.data.certificates) {
        console.log('✅ Got certificates (public):', response.data.certificates.length, 'certificates');
        return this.transformCertificates(response.data.certificates);
      }
      
      // If response doesn't have expected structure, return empty array
      console.log('⚠️ Unexpected response structure, returning empty array');
      return [];
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      // Return empty array instead of throwing to prevent app crash
      return [];
    }
  }

  // Transform backend certificate data to frontend format - EXACT match to image design
  transformCertificates(backendCertificates) {
    return backendCertificates.map(cert => {
      // Use the exact data structure from backend that matches image
      const studentName = cert.student || cert.studentName || 'Unknown Student';
      const issueDate = cert.issuedDate || new Date().toISOString();
      const year = new Date(issueDate).getFullYear();
      
      console.log('📝 Transforming certificate:', cert.title, 'for', studentName);
      
      return {
        // Core fields matching image design
        id: cert.id || cert._id,
        student: studentName,
        studentName: studentName,
        title: cert.title || cert.achievementType || 'Certificate',
        achievementType: cert.achievementType || cert.title || 'Achievement',
        type: cert.type || 'Achievement',
        category: cert.category || cert.beltLevel || 'General',
        beltLevel: cert.beltLevel || cert.category || 'N/A',
        
        // Date fields
        issuedDate: issueDate,
        formattedIssueDate: cert.formattedIssueDate || this.formatDate(issueDate),
        
        // Status and verification
        status: cert.status || 'Issued',
        verificationCode: cert.verificationCode || cert.id,
        
        // Year for filtering
        year: year,
        
        // UI properties
        icon: this.getIconForType(cert.type || cert.achievementType),
        color: this.getColorForType(cert.type || cert.achievementType),
        
        // Keep original data for reference
        _original: cert
      };
    });
  }

  // Format date to match image design
  formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit' 
    };
    return date.toLocaleDateString('en-US', options);
  }

  // Get icon based on certificate type - Match image design
  getIconForType(type) {
    const typeMap = {
      'Belt Promotion': 'military-tech',
      'Tournament': 'emoji-events',
      'Course Completion': 'school',
      'Achievement': 'star',
      'Gold Medal': 'emoji-events',
      'Silver Medal': 'emoji-events',
      'Bronze Medal': 'emoji-events',
    };
    return typeMap[type] || 'card-membership';
  }

  // Get color based on certificate type - Match image design
  getColorForType(type) {
    const colorMap = {
      'Belt Promotion': '#F59E0B', // Gold
      'Tournament': '#10B981', // Green
      'Course Completion': '#3B82F6', // Blue
      'Achievement': '#8B5CF6', // Purple
      'Gold Medal': '#F59E0B', // Gold
      'Silver Medal': '#9CA3AF', // Silver
      'Bronze Medal': '#CD7F32', // Bronze
    };
    return colorMap[type] || '#6B7280';
  }

  async getEvents(params = {}) {
    try {
      console.log('📡 Fetching events from:', API_CONFIG.ENDPOINTS.EVENTS.LIST);
      console.log('📊 With params:', params);
      
      // Try authenticated endpoint first
      try {
        const response = await ApiService.get(API_CONFIG.ENDPOINTS.EVENTS.LIST, params);
        if (response.status === 'success') {
          console.log('✅ Got events data (authenticated):', response.data.events?.length || 0, 'events');
          return response;
        }
      } catch (authError) {
        console.log('⚠️ Authenticated events request failed, trying public endpoint');
        console.log('❌ Auth error:', authError.message);
      }
      
      // Fallback to public endpoint
      console.log('🔄 Trying public events endpoint...');
      const response = await ApiService.get('/events/public', params);
      if (response.status === 'success') {
        console.log('✅ Got events data (public):', response.data.events?.length || 0, 'events');
        return response;
      }
      
      throw new Error('Failed to fetch events from both endpoints');
    } catch (error) {
      console.error('Failed to fetch events:', error);
      throw error;
    }
  }

  async registerForEvent(eventId) {
    try {
      return await ApiService.post(API_CONFIG.ENDPOINTS.EVENTS.REGISTER, { eventId });
    } catch (error) {
      console.error('Failed to register for event:', error);
      throw error;
    }
  }

  async getAttendance(params = {}) {
    try {
      console.log('📡 Fetching attendance from:', API_CONFIG.ENDPOINTS.ATTENDANCE.LIST);
      console.log('📊 With params:', params);
      
      // Try authenticated endpoint first
      try {
        const response = await ApiService.get(API_CONFIG.ENDPOINTS.ATTENDANCE.LIST, params);
        if (response.status === 'success') {
          console.log('✅ Got attendance data (authenticated):', response.data.attendance?.length || 0, 'records');
          return response;
        }
      } catch (authError) {
        console.log('⚠️ Authenticated attendance request failed, trying public endpoint');
        console.log('❌ Auth error:', authError.message);
      }
      
      // Fallback to public endpoint
      console.log('🔄 Trying public attendance endpoint...');
      const response = await ApiService.get('/attendance/public', params);
      if (response.status === 'success') {
        console.log('✅ Got attendance data (public):', response.data.attendance?.length || 0, 'records');
        return response;
      }
      
      throw new Error('Failed to fetch attendance from both endpoints');
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      throw error;
    }
  }

  async getFees() {
    try {
      return await ApiService.get(API_CONFIG.ENDPOINTS.FEES.LIST);
    } catch (error) {
      console.error('Failed to fetch fees:', error);
      throw error;
    }
  }

  async verifyCertificate(verificationCode) {
    try {
      console.log('🔍 Verifying certificate with code:', verificationCode);
      const response = await ApiService.post('/certificates/verify', {
        verificationCode: verificationCode,
      });
      console.log('✅ Verification response:', response);
      return response;
    } catch (error) {
      console.error('Failed to verify certificate:', error);
      throw error;
    }
  }
}

export default new StudentService();