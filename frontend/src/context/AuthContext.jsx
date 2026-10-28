import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const stored = localStorage.getItem('userInfo');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);

          // Verify token and refresh user info from backend
          if (parsed.token) {
            const { data } = await authService.getProfile();
            if (data) {
              const updated = { ...parsed, ...data };
              setUser(updated);
              localStorage.setItem('userInfo', JSON.stringify(updated));
            }
          }
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          localStorage.removeItem('userInfo');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
