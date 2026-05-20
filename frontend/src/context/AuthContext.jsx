import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (cachedUser && token) {
      setUser(JSON.parse(cachedUser));
    }
    setLoading(false);

    // Watch for automatic refresh token expirations
    const handleAuthExpired = () => {
      setUser(null);
      localStorage.clear();
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const register = async (name, email, password) => {
    try {
      const res = await API.post('/auth/register', { name, email, password });
      return res.data.message;
    } catch (err) {
      throw err.response?.data?.message || err.response?.data?.error || 'Registration failed';
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const res = await API.post('/auth/verify-otp', { email, otp });
      return res.data.message;
    } catch (err) {
      throw err.response?.data?.message || err.response?.data?.error || 'OTP verification failed';
    }
  };

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const { accessToken, refreshToken, name, role, loyaltyPoints } = res.data;
      
      const sessionUser = { email, name, role, loyaltyPoints };
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(sessionUser));
      
      setUser(sessionUser);
      return sessionUser;
    } catch (err) {
      throw err.response?.data?.message || err.response?.data?.error || 'Login failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      const res = await API.post('/auth/forgot-password', { email });
      return res.data.message;
    } catch (err) {
      throw err.response?.data?.message || err.response?.data?.error || 'Forgot password failed';
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const res = await API.post('/auth/reset-password', { token, newPassword });
      return res.data.message;
    } catch (err) {
      throw err.response?.data?.message || err.response?.data?.error || 'Password reset failed';
    }
  };

  const updateLoyaltyPoints = (points) => {
    if (user) {
      const updated = { ...user, loyaltyPoints: points };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, verifyOtp, login, logout, forgotPassword, resetPassword, updateLoyaltyPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
