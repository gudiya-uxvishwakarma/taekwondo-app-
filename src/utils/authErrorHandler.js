// Authentication Error Handler
// Centralized handling for authentication errors across all screens

export const handleAuthError = (error, screenName = 'Unknown') => {
  console.log(`🔐 Authentication error in ${screenName}:`, error.message);
  
  // Check if it's an authentication error
  if (error.message.includes('Authentication failed') || 
      error.message.includes('401') || 
      error.message.includes('Unauthorized')) {
    
    console.log('⚠️ Authentication failed - using fallback data');
    return {
      isAuthError: true,
      shouldUseFallback: true,
      message: 'Authentication required. Using offline data.'
    };
  }
  
  // Check if it's a network error
  if (error.message.includes('Network') || 
      error.message.includes('fetch') || 
      error.message.includes('timeout')) {
    
    console.log('🌐 Network error - using fallback data');
    return {
      isAuthError: false,
      shouldUseFallback: true,
      message: 'Network unavailable. Using offline data.'
    };
  }
  
  // Generic error
  console.log('❌ Generic error - using fallback data');
  return {
    isAuthError: false,
    shouldUseFallback: true,
    message: 'Service unavailable. Using offline data.'
  };
};

export const logApiCall = (endpoint, method = 'GET', params = {}) => {
  console.log(`📡 API Call: ${method} ${endpoint}`, params);
};

export const logApiSuccess = (endpoint, dataLength = 0) => {
  console.log(`✅ API Success: ${endpoint} - ${dataLength} records`);
};

export const logApiFallback = (screenName, reason = 'API unavailable') => {
  console.log(`🔄 ${screenName}: ${reason} - using fallback data`);
};