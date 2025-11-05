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

export default api;