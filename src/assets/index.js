// Asset management for React Native
// This ensures proper bundling in both debug and release modes

export const images = {
  // Primary logo - PNG for better quality
  logo: require('./logo.png'),
  
  // Fallback logo - JPG alternative
  logoJpg: require('./logo.jpg'),
  
  // Legacy support
  taekwondoLogo: require('./taekwondo-logo.jpg'),
};

// Export individual images for direct import if needed
export const logo = images.logo;
export const logoJpg = images.logoJpg;
export const taekwondoLogo = images.taekwondoLogo;

// Default export
export default images;