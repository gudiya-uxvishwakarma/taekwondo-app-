// Real AsyncStorage implementation
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Token management
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    console.log('💾 Token saved successfully');
  } catch (error) {
    console.error('Failed to save token:', error);
    throw error;
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    console.log('📖 Token retrieved:', !!token);
    return token;
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    console.log('🗑️ Token removed');
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

// User data management
export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    console.log('💾 User data saved successfully');
  } catch (error) {
    console.error('Failed to save user data:', error);
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    const parsed = userData ? JSON.parse(userData) : null;
    console.log('📖 User data retrieved:', !!parsed);
    return parsed;
  } catch (error) {
    console.error('Failed to get user data:', error);
    return null;
  }
};

export const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
    console.log('🗑️ User data removed');
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