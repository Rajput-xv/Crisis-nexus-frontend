import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => {
        setUser(response.data);
        setLoading(false);
      }).catch(() => {
        localStorage.removeItem('token'); // Clear the invalid token
        setUser(null); // Ensure user is set to null
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${response.data.token}` }
      });
      setUser(userResponse.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      // Extract meaningful error message
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/'); // Redirect to home page
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}