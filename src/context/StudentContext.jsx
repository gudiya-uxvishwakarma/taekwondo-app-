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

export const StudentProvider = ({ children }) => {
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
        const userData = await getUserData();
        if (userData) {
          setStudent(userData);
        } else {
          // If no user data but token exists, clear everything
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
      // Direct backend authentication
      console.log('🔐 Attempting login with backend...');
      console.log('📧 Email:', credentials.email);
      
      const response = await AuthService.login(credentials);
      
      if (response && response.user && response.token) {
        console.log('✅ Login successful:', response.user);
        console.log('🎫 Token received:', !!response.token);
        
        // Save token separately and user data
        await saveUserData(response.user);
        await saveToken(response.token);
        
        setStudent(response.user);
        return true;
      }
      
      console.log('❌ Login failed - invalid response structure');
      return false;
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      
      // Reset state on error
      setStudent(null);
      
      // Clear any corrupted data
      try {
        await clearAllData();
      } catch (clearError) {
        console.log('⚠️ Failed to clear data after login error:', clearError);
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
      // Continue with local cleanup even if API call fails
    } finally {
      // Always clear local data and reset state
      try {
        await clearAllData();
        setStudent(null);
      } catch (clearError) {
        console.log('❌ Failed to clear data during logout:', clearError);
        // Force reset state even if clear fails
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