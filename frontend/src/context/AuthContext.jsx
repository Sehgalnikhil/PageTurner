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
          let parsed = JSON.parse(stored);

          // If session is using demo user, seamlessly upgrade to real registered database user
          if (parsed.username === 'Admin Demo' || parsed.email === 'admin@pageturner.io' || parsed.username === 'Reader Demo') {
            try {
              const res = await authService.switchAccount({ email: 'nikhilsehgal1806@gmail.com' });
              if (res.data) {
                parsed = res.data;
              }
            } catch (switchErr) {
              console.warn('Could not auto-switch demo to real user:', switchErr);
            }
          }

          setUser(parsed);
          localStorage.setItem('userInfo', JSON.stringify(parsed));

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
      } else {
        // Automatically default visitor to the real primary user from database
        try {
          const res = await authService.switchAccount({ email: 'nikhilsehgal1806@gmail.com' });
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('userInfo', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Could not initialize real default user:', err);
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

  const updateAvatar = async (newAvatar) => {
    // 1. Optimistic instant local update
    const updated = {
      ...(user || {}),
      avatar: newAvatar,
    };
    setUser(updated);
    localStorage.setItem('userInfo', JSON.stringify(updated));

    // 2. Persist to backend if token exists
    if (user?.token) {
      try {
        await authService.updateAvatar(newAvatar);
      } catch (err) {
        console.error('Failed to sync avatar with backend:', err);
      }
    }
    return true;
  };

  const switchToRealUser = async (targetEmailOrUsername) => {
    try {
      const res = await authService.switchAccount({
        email: targetEmailOrUsername || 'nikhilsehgal1806@gmail.com',
      });
      if (res.data) {
        setUser(res.data);
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        return res.data;
      }
    } catch (err) {
      console.error('Failed to switch to real user:', err);
    }
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
        updateAvatar,
        switchToRealUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
