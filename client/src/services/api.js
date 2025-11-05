import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/`,
});

// Helper function to get the appropriate token
const getAuthToken = () => {
  // Check if on admin route
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    return localStorage.getItem('adminToken');
  }
  return localStorage.getItem('token');
};

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Reset Password API functions
export const sendResetCode = async (email) => {
  try {
    const response = await api.post('/api/auth/send-reset-code', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send reset code');
  }
};

export const verifyResetCode = async (email, code) => {
  try {
    const response = await api.post('/api/auth/verify-reset-code', { email, code });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify reset code');
  }
};

export const resetPassword = async (email, code, newPassword) => {
  try {
    const response = await api.post('/api/auth/reset-password', { email, code, newPassword });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};

export default api;