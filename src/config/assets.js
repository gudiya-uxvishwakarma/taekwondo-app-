// Comprehensive asset configuration for React Native
// Ensures proper logo display in all build types (debug/release)

import { logo } from '../assets';

// Logo configuration with fallback handling
export const LogoConfig = {
  // Primary logo source
  source: logo,
  
  // Default dimensions for different use cases
  dimensions: {
    navbar: { width: 60, height: 60, borderRadius: 30 },
    menu: { width: 82, height: 82, borderRadius: 41 },
    login: { width: 90, height: 90, borderRadius: 45 },
    dashboard: { width: 44, height: 44, borderRadius: 22 },
    profile: { width: 100, height: 100, borderRadius: 50 },
  },
  
  // Container styles for different contexts
  containerStyles: {
    navbar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#ffffff',
      borderWidth: 3,
      borderColor: '#ffd700',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    },
    menu: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: '#ffffff',
      borderWidth: 4,
      borderColor: '#ffd700',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 12,
    },
    login: {
      width: 110,
      height: 110,
      borderRadius: 55,
      backgroundColor: '#ffffff',
      borderWidth: 4,
      borderColor: '#ffffff',
      shadowColor: '#ef4444',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 15,
      elevation: 10,
    },
  },
  
  // Resize modes for different contexts
  resizeMode: {
    navbar: 'cover',
    menu: 'contain',
    login: 'contain',
    dashboard: 'contain',
    profile: 'cover',
  },
};

// Helper function to get logo props for specific context
export const getLogoProps = (context = 'default') => {
  const config = LogoConfig;
  
  return {
    source: config.source,
    style: config.dimensions[context] || config.dimensions.dashboard,
    resizeMode: config.resizeMode[context] || 'contain',
  };
};

// Helper function to get container style for specific context
export const getLogoContainerStyle = (context = 'default') => {
  return LogoConfig.containerStyles[context] || LogoConfig.containerStyles.navbar;
};

export default LogoConfig;