// Asset management for React Native
// This ensures proper bundling in both debug and release modes
// Optimized for release build stability and performance

// Export logo.png with multiple aliases for maximum compatibility
export const logo = require('./logo.png');
export const taekwondoLogo = require('./logo.png');
export const appLogo = require('./logo.png');

// Default export with comprehensive aliases for compatibility
export default {
  logo: require('./logo.png'),
  taekwondoLogo: require('./logo.png'),
  appLogo: require('./logo.png'),
};

// Additional exports for different use cases
export const images = {
  logo: require('./logo.png'),
  taekwondoLogo: require('./logo.png'),
  appLogo: require('./logo.png'),
};