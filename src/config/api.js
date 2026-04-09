// API Configuration
const API_CONFIG = {
  BASE_URL: 'http://192.168.1.22:9000/api',
  TIMEOUT: 50000,
  FALLBACK_URLS: [
    'http://192.168.1.22:9000/api',
  ],
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/login/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      SEND_OTP: '/auth/send-otp',
      VERIFY_OTP: '/auth/verify-otp',
    },
    STUDENT: {
      PROFILE: '/auth/profile', // Profile is in auth routes, not student routes
      UPDATE: '/auth/profile',
      LIST: '/students', // Students list endpoint
    },
    CERTIFICATES: {
      LIST: '/certificates',
      DOWNLOAD: '/certificates/download',
      QR: '/certificates/qr',
      STATS: '/certificates/stats',
      VERIFY: '/certificates/verify',
    },
    EVENTS: {
      LIST: '/events',
      REGISTER: '/events/register',
    },
    ATTENDANCE: {
      LIST: '/attendance',
      MARK: '/attendance/mark',
    },
    FEES: {
      LIST: '/fees',
      PAY: '/fees/pay',
    },
    BELTS: {
      LEVELS: '/belts/levels',
      PROMOTIONS: '/belts/promotions',
      TESTS: '/belts/tests',
    },
    ONBOARDING: {
      LIST: '/onboarding',
    },
    PROGRAMS: {
      LIST: '/programs',
      EXERCISES: '/programs/exercises/all',
    },
    THEORY_QUESTIONS: {
      LIST: '/theory-questions',
    },
  },
};

export default API_CONFIG;
