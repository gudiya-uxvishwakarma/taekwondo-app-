/**
 * Utility functions for the app
 */

/**
 * Handle API errors and return user-friendly messages
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (!error) {
    return 'An unknown error occurred';
  }
  
  // Network errors
  if (error.message && error.message.includes('Network')) {
    return 'Network connection failed. Please check your internet connection.';
  }
  
  // Authentication errors
  if (error.message && (error.message.includes('401') || error.message.includes('Authentication'))) {
    return 'Authentication failed. Please login again.';
  }
  
  // Authorization errors
  if (error.message && (error.message.includes('403') || error.message.includes('Forbidden'))) {
    return 'Access denied. You do not have permission to perform this action.';
  }
  
  // Not found errors
  if (error.message && error.message.includes('404')) {
    return 'The requested resource was not found.';
  }
  
  // Server errors
  if (error.message && error.message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  
  // Return the original error message if it's user-friendly
  if (error.message && typeof error.message === 'string') {
    return error.message;
  }
  
  // Default fallback
  return 'Something went wrong. Please try again.';
};

/**
 * Format date to readable string
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone number
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Generate a random ID
 * @param {number} length - Length of the ID
 * @returns {string} - Random ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} - Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

export default {
  handleApiError,
  formatDate,
  isValidEmail,
  isValidPhone,
  capitalizeWords,
  generateId,
  debounce,
  deepClone,
};