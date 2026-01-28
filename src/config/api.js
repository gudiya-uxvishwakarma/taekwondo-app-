// API Configuration
const API_CONFIG = {
  BASE_URL: 'http://192.168.1.22:5000/api', // Working IP address for React Native
  TIMEOUT: 30000, // Increased timeout for better reliability
  FALLBACK_URLS: [
    'http://192.168.1.22:5000/api',  // Your computer's IP - Primary (WORKING)
    'http://10.0.2.2:5000/api',      // Android emulator mapping
    'http://localhost:5000/api',     // Localhost (for iOS simulator)
    'http://127.0.0.1:5000/api'      // Loopback
  ],
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login', // Correct auth endpoint
      REGISTER: '/auth/register',
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
      VERIFY: '/certificates/verify',
      DOWNLOAD: '/certificates/download',
      QR: '/certificates/qr',
      STATS: '/certificates/stats',
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
  },
};

export default API_CONFIG;