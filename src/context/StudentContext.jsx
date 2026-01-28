import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services';
import { getToken, getUserData, saveUserData, clearAllData, isAuthenticated as checkAuth, saveToken } from '../utils/tokenStorage';

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
        }
      }
    } catch (error) {
      console.log('Session check error:', error);
      // Clear corrupted data
      await clearAllData();
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
        setLoading(false);
        return true;
      }
      
      console.log('❌ Login failed - invalid response structure');
      setLoading(false);
      return false;
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setStudent(null);
    } catch (error) {
      console.log('Logout error:', error);
      // Clear local data even if API call fails
      await clearAllData();
      setStudent(null);
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