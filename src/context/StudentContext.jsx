import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserData, saveUserData, clearAllData, isAuthenticated as checkAuth, saveToken } from '../utils/tokenStorage';

// Import AuthService with error handling
let AuthService;
try {
  AuthService = require('../services').AuthService;
} catch (e) {
  console.warn('AuthService not found, using mock:', e);
  AuthService = {
    login: async (credentials) => {
      // Mock login for development
      if (credentials.email && credentials.password) {
        return {
          user: { id: 1, email: credentials.email, name: 'Test User' },
          token: 'mock-token-' + Date.now()
        };
      }
      throw new Error('Invalid credentials');
    },
    logout: async () => {
      console.log('Mock logout');
    }
  };
}

const StudentContext = createContext(undefined);

export const StudentProvider = ({ children, onGoToSelection }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app start
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      setLoading(true);
      const isAuth = await checkAuth();
      
      if (isAuth) {
        // Check if token is a real JWT (not a fake local OTP token)
        const { getToken } = require('../utils/tokenStorage');
        const token = await getToken();
        if (token && token.startsWith('otp_token_')) {
          console.log('⚠️ Fake OTP token found, clearing session — please login again');
          await clearAllData();
          setStudent(null);
          setLoading(false);
          return;
        }

        const userData = await getUserData();
        if (userData) {
          setStudent(userData);
        } else {
          console.log('⚠️ Token exists but no user data, clearing session');
          await clearAllData();
        }
      }
    } catch (error) {
      console.log('❌ Session check error:', error);
      // Clear corrupted data and reset state
      try {
        await clearAllData();
        setStudent(null);
      } catch (clearError) {
        console.log('❌ Failed to clear corrupted data:', clearError);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    
    try {
      // Handle OTP login — data already verified, just set state
      if (credentials._otpLoginData) {
        const { user, token } = credentials._otpLoginData;
        await saveUserData(user);
        await saveToken(token);
        setStudent(user);
        return true;
      }

      // Direct backend authentication
      console.log('🔐 Attempting login...');
      
      const response = await AuthService.login(credentials);
      
      if (response && response.user && response.token) {
        console.log('✅ Login successful');
        
        // Save token separately and user data
        await saveUserData(response.user);
        await saveToken(response.token);
        
        setStudent(response.user);
        return true;
      }
      
      console.log('⚠️ Login failed - invalid response');
      return false;
    } catch (error) {
      // Only log in development
      if (__DEV__) {
        console.log('⚠️ Login error:', error.message);
      }
      
      // Reset state on error
      setStudent(null);
      
      // Clear any corrupted data
      try {
        await clearAllData();
      } catch (clearError) {
        // Silent fail
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
    } catch (error) {
      console.log('❌ Logout API error:', error);
    } finally {
      try {
        await clearAllData();
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.removeItem('loginSource');
        setStudent(null);
      } catch (clearError) {
        console.log('❌ Failed to clear data during logout:', clearError);
        setStudent(null);
      }
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock password reset
    if (email && email.includes('@')) {
      return {
        success: true,
        message: 'Password reset link sent to your email',
      };
    }
    
    return {
      success: false,
      message: 'Invalid email address',
    };
  };

  const value = {
    student,
    isAuthenticated: !!student,
    loading,
    login,
    logout,
    forgotPassword,
    goToSelection: onGoToSelection || (() => {}),
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};