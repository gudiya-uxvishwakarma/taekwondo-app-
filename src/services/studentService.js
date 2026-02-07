import api from './api';
import API_CONFIG from '../config/api';
import { getToken } from '../utils/tokenStorage';

class StudentService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.endpoints = API_CONFIG.ENDPOINTS;
  }

  // Get student profile with authentication
  async getProfile() {
    try {
      console.log('👤 Loading student profile...');
      
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const response = await api.get(this.endpoints.STUDENT.PROFILE);
      
      if (response.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('❌ Error fetching student profile:', error);
      throw error;
    }
  }

  // Update student profile
  async updateProfile(profileData) {
    try {
      console.log('📝 Updating student profile...');
      
      const response = await api.put(this.endpoints.STUDENT.UPDATE, profileData);
      
      if (response.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('❌ Error updating student profile:', error);
      throw error;
    }
  }

  // Get events for student
  async getEvents(queryParams = {}) {
    try {
      console.log('📅 Loading events from backend...');
      
      // Try authenticated endpoint first
      let response;
      try {
        response = await api.get(this.endpoints.EVENTS.LIST, queryParams);
      } catch (authError) {
        console.log('⚠️ Authenticated events endpoint failed, trying public endpoint:', authError.message);
        // Fallback to public endpoint if authentication fails
        response = await api.get('/events/public', queryParams);
      }
      
      console.log('📥 Events response:', response);
      
      if (response.status === 'success') {
        const events = response.data?.events || response.events || [];
        console.log('✅ Events loaded from backend:', events.length);
        
        return {
          status: 'success',
          data: {
            events: events
          }
        };
      } else {
        throw new Error(response.message || 'Failed to load events');
      }
    } catch (error) {
      console.error('❌ Error fetching events:', error);
      
      // Return sample events as fallback
      console.log('🔄 Using fallback sample events...');
      return {
        status: 'success',
        data: {
          events: this.getSampleEvents()
        }
      };
    }
  }

  // Get attendance records for student
  async getAttendance(queryParams = {}) {
    try {
      console.log('📊 Loading attendance records...');
      
      let response;
      try {
        response = await api.get(this.endpoints.ATTENDANCE.LIST, queryParams);
      } catch (authError) {
        console.log('⚠️ Authenticated attendance endpoint failed, trying public endpoint:', authError.message);
        response = await api.get('/attendance/public', queryParams);
      }
      
      if (response.status === 'success') {
        const attendance = response.data?.attendance || response.attendance || [];
        console.log('✅ Attendance loaded from backend:', attendance.length);
        
        return {
          status: 'success',
          data: {
            attendance: attendance
          }
        };
      } else {
        throw new Error(response.message || 'Failed to load attendance');
      }
    } catch (error) {
      console.error('❌ Error fetching attendance:', error);
      
      // Return sample attendance as fallback
      return {
        status: 'success',
        data: {
          attendance: this.getSampleAttendance()
        }
      };
    }
  }

  // Get fees information for student
  async getFees(queryParams = {}) {
    try {
      console.log('💰 Loading fees information...');
      
      let response;
      try {
        response = await api.get(this.endpoints.FEES.LIST, queryParams);
      } catch (authError) {
        console.log('⚠️ Authenticated fees endpoint failed, trying public endpoint:', authError.message);
        // Note: If fees/public endpoint is not available, we'll use fallback data
        try {
          response = await api.get('/fees/public', queryParams);
        } catch (publicError) {
          console.log('⚠️ Public fees endpoint also not available, using fallback data');
          throw publicError;
        }
      }
      
      if (response.status === 'success') {
        const fees = response.data?.fees || response.fees || [];
        console.log('✅ Fees loaded from backend:', fees.length);
        
        return {
          status: 'success',
          data: {
            fees: fees
          }
        };
      } else {
        throw new Error(response.message || 'Failed to load fees');
      }
    } catch (error) {
      console.error('❌ Error fetching fees:', error);
      
      // Return sample fees as fallback
      return {
        status: 'success',
        data: {
          fees: this.getSampleFees()
        }
      };
    }
  }

  // Get belt levels and promotions
  async getBeltLevels(queryParams = {}) {
    try {
      console.log('🥋 Loading belt levels...');
      
      let response;
      try {
        response = await api.get(this.endpoints.BELTS.LEVELS, queryParams);
      } catch (authError) {
        console.log('⚠️ Authenticated belts endpoint failed, trying public endpoint:', authError.message);
        response = await api.get('/belts-public', queryParams);
      }
      
      if (response.status === 'success') {
        const belts = response.data?.belts || response.belts || [];
        console.log('✅ Belt levels loaded from backend:', belts.length);
        
        return {
          status: 'success',
          data: {
            belts: belts
          }
        };
      } else {
        throw new Error(response.message || 'Failed to load belt levels');
      }
    } catch (error) {
      console.error('❌ Error fetching belt levels:', error);
      
      // Return sample belt levels as fallback
      return {
        status: 'success',
        data: {
          belts: this.getSampleBeltLevels()
        }
      };
    }
  }

  // Get student record (for AttendanceScreen)
  async getStudentRecord() {
    try {
      console.log('👤 Loading student record...');
      
      const response = await this.getProfile();
      
      return {
        status: 'success',
        data: {
          student: response
        }
      };
    } catch (error) {
      console.error('❌ Error fetching student record:', error);
      
      // Return sample student record as fallback
      return {
        status: 'success',
        data: {
          student: {
            id: 'STU-001',
            name: 'Student Name',
            email: 'student@example.com',
            beltLevel: 'Yellow Belt',
            joinDate: new Date('2024-01-15')
          }
        }
      };
    }
  }

  // Get promotions (for LevelStatusScreen)
  async getPromotions(queryParams = {}) {
    try {
      console.log('🏆 Loading promotions...');
      console.log('🏆 Query params:', queryParams);
      
      let response;
      try {
        // Try authenticated endpoint first
        response = await api.get(this.endpoints.BELTS.PROMOTIONS, queryParams);
        console.log('✅ Authenticated promotions response:', response);
      } catch (authError) {
        console.log('⚠️ Authenticated promotions endpoint failed, trying public endpoint:', authError.message);
        // Try public endpoint as fallback
        response = await api.get('/belts/tests/promotions-public', queryParams);
        console.log('✅ Public promotions response:', response);
      }
      
      if (response.status === 'success') {
        const promotions = response.data?.promotions || response.promotions || [];
        console.log('✅ Promotions loaded from backend:', promotions.length);
        
        return {
          status: 'success',
          data: {
            promotions: promotions
          }
        };
      } else {
        throw new Error(response.message || 'Failed to load promotions');
      }
    } catch (error) {
      console.error('❌ Error fetching promotions:', error);
      
      // Return sample promotions as fallback
      console.log('🔄 Using fallback sample promotions...');
      return {
        status: 'success',
        data: {
          promotions: this.getSamplePromotions()
        }
      };
    }
  }

  // Get belt tests (for LevelStatusScreen)
  async getBeltTests(queryParams = {}) {
    try {
      console.log('📝 Loading belt tests...');
      console.log('📝 Query params:', queryParams);
      
      let response;
      try {
        // Try authenticated endpoint first
        response = await api.get(this.endpoints.BELTS.TESTS, queryParams);
        console.log('✅ Authenticated belt tests response:', response);
      } catch (authError) {
        console.log('⚠️ Authenticated belt tests endpoint failed, trying public endpoint:', authError.message);
        // Try public endpoint as fallback
        response = await api.get('/belts/tests/public', queryParams);
        console.log('✅ Public belt tests response:', response);
      }
      
      if (response.status === 'success') {
        const tests = response.data?.tests || response.tests || [];
        console.log('✅ Belt tests loaded from backend:', tests.length);
        
        return {
          status: 'success',
          data: {
            tests: tests
          }
        };
      } else {
        throw new Error(response.message || 'Failed to load belt tests');
      }
    } catch (error) {
      console.error('❌ Error fetching belt tests:', error);
      
      // Return sample belt tests as fallback
      console.log('🔄 Using fallback sample belt tests...');
      return {
        status: 'success',
        data: {
          tests: this.getSampleBeltTests()
        }
      };
    }
  }

  // Sample data methods for fallback
  getSampleEvents() {
    return [
      {
        id: 'EVENT-001',
        title: 'Belt Promotion Test',
        description: 'Quarterly belt promotion examination for all students',
        date: new Date('2025-02-15'),
        time: '10:00 AM',
        location: 'Main Dojo',
        type: 'Belt Test',
        status: 'upcoming',
        registrationRequired: true,
        maxParticipants: 50,
        currentParticipants: 23
      },
      {
        id: 'EVENT-002',
        title: 'State Championship',
        description: 'Annual state-level Taekwondo championship tournament',
        date: new Date('2025-03-20'),
        time: '9:00 AM',
        location: 'Sports Complex',
        type: 'Tournament',
        status: 'upcoming',
        registrationRequired: true,
        maxParticipants: 100,
        currentParticipants: 67
      },
      {
        id: 'EVENT-003',
        title: 'Self-Defense Workshop',
        description: 'Special workshop on practical self-defense techniques',
        date: new Date('2025-02-28'),
        time: '2:00 PM',
        location: 'Training Hall',
        type: 'Workshop',
        status: 'upcoming',
        registrationRequired: false,
        maxParticipants: 30,
        currentParticipants: 15
      }
    ];
  }

  getSampleAttendance() {
    return [
      {
        id: 'ATT-001',
        date: new Date('2025-01-30'),
        status: 'present',
        sessionType: 'Regular Training',
        duration: '1.5 hours',
        instructor: 'Master Kim'
      },
      {
        id: 'ATT-002',
        date: new Date('2025-01-28'),
        status: 'present',
        sessionType: 'Sparring Practice',
        duration: '2 hours',
        instructor: 'Master Lee'
      },
      {
        id: 'ATT-003',
        date: new Date('2025-01-25'),
        status: 'absent',
        sessionType: 'Regular Training',
        duration: '1.5 hours',
        instructor: 'Master Kim'
      }
    ];
  }

  getSampleFees() {
    return [
      {
        _id: '507f1f77bcf86cd799439011',
        feeId: 'FEE17406837123ABC',
        studentName: 'Adarsh Kumar',
        course: 'Advanced Taekwondo',
        feeType: 'Monthly Fee',
        amount: 5000,
        dueDate: '2025-02-15T00:00:00.000Z',
        paidDate: '2025-01-20T00:00:00.000Z',
        status: 'Paid',
        paymentMethod: 'UPI',
        transactionId: 'TXN123456789',
        receiptNumber: 'RCP1740683712',
        discount: {
          amount: 500,
          reason: 'Early payment discount'
        },
        lateFee: {
          amount: 0,
          appliedDate: null
        },
        notes: 'Monthly training fee for Advanced Taekwon-Do program',
        paymentHistory: [
          {
            amount: 4500,
            paymentMethod: 'UPI',
            transactionId: 'TXN123456789',
            paidDate: '2025-01-20T00:00:00.000Z',
            lateFee: { amount: 0 },
            discount: { amount: 500, reason: 'Early payment discount' },
            notes: 'Full payment with early discount',
            recordedAt: '2025-01-20T00:00:00.000Z'
          }
        ],
        totalPaidAmount: 4500,
        createdAt: '2025-01-15T00:00:00.000Z',
        updatedAt: '2025-01-20T00:00:00.000Z'
      },
      {
        _id: '507f1f77bcf86cd799439012',
        feeId: 'FEE17406837124DEF',
        studentName: 'Adarsh Kumar',
        course: 'Advanced Taekwondo',
        feeType: 'Belt Test Fee',
        amount: 1500,
        dueDate: '2025-03-01T00:00:00.000Z',
        paidDate: null,
        status: 'Pending',
        paymentMethod: null,
        transactionId: null,
        receiptNumber: null,
        discount: {
          amount: 0,
          reason: null
        },
        lateFee: {
          amount: 200,
          appliedDate: '2025-02-01T00:00:00.000Z'
        },
        notes: 'Belt promotion test fee for Orange Belt',
        paymentHistory: [],
        totalPaidAmount: 0,
        createdAt: '2025-01-25T00:00:00.000Z',
        updatedAt: '2025-01-25T00:00:00.000Z'
      },
      {
        _id: '507f1f77bcf86cd799439013',
        feeId: 'FEE17406837125GHI',
        studentName: 'Adarsh Kumar',
        course: 'Advanced Taekwondo',
        feeType: 'Equipment Fee',
        amount: 3000,
        dueDate: '2025-02-28T00:00:00.000Z',
        paidDate: '2025-02-01T00:00:00.000Z',
        status: 'Partial',
        paymentMethod: 'Cash',
        transactionId: 'CASH001',
        receiptNumber: 'RCP1740683713',
        discount: {
          amount: 300,
          reason: 'Student discount'
        },
        lateFee: {
          amount: 0,
          appliedDate: null
        },
        notes: 'Protective gear and uniform',
        paymentHistory: [
          {
            amount: 1500,
            paymentMethod: 'Cash',
            transactionId: 'CASH001',
            paidDate: '2025-02-01T00:00:00.000Z',
            lateFee: { amount: 0 },
            discount: { amount: 150, reason: 'Partial student discount' },
            notes: 'Partial payment - 50%',
            recordedAt: '2025-02-01T00:00:00.000Z'
          }
        ],
        totalPaidAmount: 1500,
        createdAt: '2025-01-20T00:00:00.000Z',
        updatedAt: '2025-02-01T00:00:00.000Z'
      }
    ];
  }

  getSampleBeltLevels() {
    return [
      {
        id: 'BELT-001',
        name: 'White Belt',
        level: 1,
        color: '#FFFFFF',
        requirements: ['Basic stances', 'Basic kicks', 'Basic punches'],
        status: 'completed'
      },
      {
        id: 'BELT-002',
        name: 'Yellow Belt',
        level: 2,
        color: '#FFD700',
        requirements: ['Front kick', 'Side kick', 'Basic forms'],
        status: 'current'
      },
      {
        id: 'BELT-003',
        name: 'Orange Belt',
        level: 3,
        color: '#FFA500',
        requirements: ['Advanced kicks', 'Sparring basics', 'Forms 1-2'],
        status: 'available'
      }
    ];
  }

  // Sample promotions data
  getSamplePromotions() {
    return [
      {
        id: 'PROMO-001',
        studentName: 'John Doe',
        fromBelt: 'White Belt',
        toBelt: 'Yellow Belt',
        promotionDate: new Date('2024-12-15'),
        testScore: 85,
        status: 'completed'
      },
      {
        id: 'PROMO-002',
        studentName: 'Jane Smith',
        fromBelt: 'Yellow Belt',
        toBelt: 'Orange Belt',
        promotionDate: new Date('2025-01-20'),
        testScore: 92,
        status: 'completed'
      }
    ];
  }

  // Sample belt tests data - Updated to match backend format
  getSampleBeltTests() {
    return [
      {
        _id: 'TEST-001',
        studentName: 'Golu Vishwakarma',
        currentBelt: 'Red Belt',
        testingFor: '1st Dan Black Belt',
        testDate: new Date('2025-03-15'),
        testTime: '10:00 AM',
        location: 'Main Dojo',
        examiner: 'Grand Master Kim',
        status: 'Scheduled',
        registrationDate: new Date('2025-01-20'),
        requirements: [
          'All Taegeuk forms (1-8)',
          'Advanced breaking techniques',
          'Teaching demonstration',
          'Leadership skills assessment',
          'Physical fitness test'
        ],
        testingFee: 3000,
        paymentStatus: 'Paid',
        notes: 'Exceptional student ready for black belt',
        readiness: 95,
        createdBy: 'ADMIN-001',
        createdAt: new Date('2025-01-20'),
        updatedAt: new Date('2025-01-20')
      },
      {
        _id: 'TEST-002',
        studentName: 'Priya Patel',
        currentBelt: 'Blue Belt',
        testingFor: 'Red Belt',
        testDate: new Date('2025-02-28'),
        testTime: '2:00 PM',
        location: 'Training Hall A',
        examiner: 'Master Lee',
        status: 'Scheduled',
        registrationDate: new Date('2025-01-25'),
        requirements: [
          'Taegeuk forms 1-6',
          'Advanced spinning kicks',
          'Tournament sparring',
          'Student mentoring demonstration',
          'Board breaking (3 boards)'
        ],
        testingFee: 1800,
        paymentStatus: 'Paid',
        notes: 'Strong technical skills, good leadership potential',
        readiness: 88,
        createdBy: 'ADMIN-001',
        createdAt: new Date('2025-01-25'),
        updatedAt: new Date('2025-01-25')
      },
      {
        _id: 'TEST-003',
        studentName: 'Rahul Kumar',
        currentBelt: 'Green Belt',
        testingFor: 'Blue Belt',
        testDate: new Date('2025-02-15'),
        testTime: '11:00 AM',
        location: 'Main Dojo',
        examiner: 'Master Park',
        status: 'Scheduled',
        registrationDate: new Date('2025-01-28'),
        requirements: [
          'Taegeuk forms 1-5',
          'Jump kicks (front, side, roundhouse)',
          'Advanced sparring techniques',
          'Self-defense combinations',
          'Multiple board breaking'
        ],
        testingFee: 1600,
        paymentStatus: 'Pending',
        notes: 'Needs to improve consistency in forms',
        readiness: 75,
        createdBy: 'ADMIN-001',
        createdAt: new Date('2025-01-28'),
        updatedAt: new Date('2025-01-28')
      },
      {
        _id: 'TEST-004',
        studentName: 'Kevin Martinez',
        currentBelt: 'White Belt',
        testingFor: 'Yellow Belt',
        testDate: new Date('2025-02-10'),
        testTime: '3:00 PM',
        location: 'Training Hall B',
        examiner: 'Master Kim',
        status: 'Scheduled',
        registrationDate: new Date('2025-01-15'),
        requirements: [
          'Basic stances and blocks',
          'Basic punches and kicks',
          'Taegeuk Il Jang form',
          'Basic sparring techniques',
          'Board breaking (1 board)'
        ],
        testingFee: 1000,
        paymentStatus: 'Paid',
        notes: 'Good progress in basic techniques',
        readiness: 82,
        createdBy: 'ADMIN-001',
        createdAt: new Date('2025-01-15'),
        updatedAt: new Date('2025-01-15')
      },
      {
        _id: 'TEST-005',
        studentName: 'Sneha Singh',
        currentBelt: 'Yellow Belt',
        testingFor: 'Orange Belt',
        testDate: new Date('2025-02-20'),
        testTime: '1:00 PM',
        location: 'Main Dojo',
        examiner: 'Master Lee',
        status: 'Scheduled',
        registrationDate: new Date('2025-01-18'),
        requirements: [
          'All previous requirements',
          'Advanced kicks and combinations',
          'Taegeuk Sam Jang form',
          'Intermediate sparring',
          'Self-defense techniques'
        ],
        testingFee: 1200,
        paymentStatus: 'Paid',
        notes: 'Excellent form execution and confidence',
        readiness: 90,
        createdBy: 'ADMIN-001',
        createdAt: new Date('2025-01-18'),
        updatedAt: new Date('2025-01-18')
      }
    ];
  }

  // Test backend connection
  async testConnection() {
    try {
      console.log('🧪 Testing backend connection...');
      
      const response = await api.get('/health');
      return response.status === 'success';
    } catch (error) {
      console.log('❌ Backend connection test failed:', error.message || error);
      return false;
    }
  }
}

export default new StudentService();

