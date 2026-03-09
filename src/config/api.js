// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://taekwondo-backend-j8w4.onrender.com/api', // Local network IP - Primary for development
  TIMEOUT: 30000, // 30 seconds timeout
  FALLBACK_URLS: [
    'https://taekwondo-backend-j8w4.onrender.com/api',  // Local network IP - Primary
    'http://10.0.2.2:5000/api',      // Android emulator mapping
    'https://taekwondo-backend-j8w4.onrender.com/api',     // Localhost
    'https://taekwondo-backend-j8w4.onrender.com/api',  // Render production - Fallback
  ],
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/login/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
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
  
  },
};

export default API_CONFIG;