// Simple authentication test
import API_CONFIG from '../config/api';
import { saveToken, getToken } from './tokenStorage';

export const testDirectLogin = async () => {
  console.log('🧪 Testing direct login...');
  
  try {
    const loginData = {
      email: 'admin@combatwarrior.com',
      password: 'admin123'
    };
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    
    console.log('📥 Login response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful:', data);
      
      if (data.data && data.data.token) {
        await saveToken(data.data.token);
        console.log('💾 Token saved successfully');
        return { success: true, user: data.data.user, token: data.data.token };
      }
    } else {
      const errorData = await response.json();
      console.log('❌ Login failed:', errorData);
      return { success: false, error: errorData.message };
    }
  } catch (error) {
    console.error('💥 Login test failed:', error);
    return { success: false, error: error.message };
  }
};

export const testAuthenticatedRequest = async () => {
  console.log('🧪 Testing authenticated request...');
  
  try {
    const token = await getToken();
    console.log('🔑 Using token:', !!token);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/attendance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('📥 Authenticated request status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Authenticated request successful:', data);
      return { success: true, data };
    } else {
      const errorData = await response.json();
      console.log('❌ Authenticated request failed:', errorData);
      return { success: false, error: errorData };
    }
  } catch (error) {
    console.error('💥 Authenticated request failed:', error);
    return { success: false, error: error.message };
  }
};