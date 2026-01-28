// Temporary storage solution - replace with AsyncStorage when Metro issue is resolved
// import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple in-memory storage for development (will be lost on app restart)
const tempStorage = {
  data: {},
  setItem: async (key, value) => {
    tempStorage.data[key] = value;
    console.log(`💾 Stored ${key}:`, value);
    return Promise.resolve();
  },
  getItem: async (key) => {
    const value = tempStorage.data[key] || null;
    console.log(`📖 Retrieved ${key}:`, value);
    return Promise.resolve(value);
  },
  removeItem: async (key) => {
    delete tempStorage.data[key];
    console.log(`🗑️ Removed ${key}`);
    return Promise.resolve();
  },
};

const TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Token management
export const saveToken = async (token) => {
  try {
    await tempStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save token:', error);
    throw error;
  }
};

export const getToken = async () => {
  try {
    return await tempStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await tempStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

// User data management
export const saveUserData = async (userData) => {
  try {
    await tempStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    
    // Also save the token if it's included in userData
    if (userData.token) {
      await saveToken(userData.token);
      console.log('💾 Token saved from user data');
    }
  } catch (error) {
    console.error('Failed to save user data:', error);
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const userData = await tempStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Failed to get user data:', error);
    return null;
  }
};

export const removeUserData = async () => {
  try {
    await tempStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Failed to remove user data:', error);
  }
};

// Clear all stored data
export const clearAllData = async () => {
  try {
    await Promise.all([
      removeToken(),
      removeUserData(),
    ]);
  } catch (error) {
    console.error('Failed to clear all data:', error);
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const token = await getToken();
    return !!token;
  } catch (error) {
    console.error('Failed to check authentication:', error);
    return false;
  }
};