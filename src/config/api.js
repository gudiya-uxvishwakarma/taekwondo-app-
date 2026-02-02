// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://taekwon-frontend.onrender.com/api', // Local development IP - Original
  TIMEOUT: 10000,
  FALLBACK_URLS: [
    'https://taekwon-frontend.onrender.com/api',  // Local development IP - Primary
    'https://taekwon-frontend.onrender.com/api',      // Android emulator mapping
    'https://taekwon-frontend.onrender.com/api',  
      // Localhost (for iOS simulator)
  ],
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/login', // Using the correct login endpoint
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