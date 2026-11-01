import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const stored = localStorage.getItem('userInfo');
      const savedCustomAvatar = localStorage.getItem('sanctuary_custom_avatar');

      if (stored) {
        try {
          let parsed = JSON.parse(stored);

          // Guarantee persistent user avatar from dedicated storage
          if (savedCustomAvatar && (!parsed.avatar || parsed.avatar.includes('photo-1544717305-2782549b5136'))) {
            parsed.avatar = savedCustomAvatar;
          }

          // If session was using demo user, upgrade to primary database user, but PRESERVE user customizations
          if (parsed.username === 'Admin Demo' || parsed.email === 'admin@pageturner.io' || parsed.username === 'Reader Demo') {
            try {
              const res = await authService.switchAccount({ email: 'nikhilsehgal1806@gmail.com' });
              if (res.data) {
                parsed = {
                  ...res.data,
                  avatar: savedCustomAvatar || parsed.avatar || res.data.avatar,
                };
              }
            } catch (switchErr) {
              console.warn('Could not auto-switch demo to real user:', switchErr);
            }
          }

          // Immediate optimistic state hydration
          setUser(parsed);
          localStorage.setItem('userInfo', JSON.stringify(parsed));

          // Verify token and refresh user info from backend
          if (parsed.token) {
            try {
              const { data } = await authService.getProfile();
              if (data) {
                const finalAvatar = savedCustomAvatar || parsed.avatar || data.avatar;
                const updated = {
                  ...parsed,
                  ...data,
                  avatar: finalAvatar,
                };
                setUser(updated);
                localStorage.setItem('userInfo', JSON.stringify(updated));
                if (finalAvatar) {
                  localStorage.setItem('sanctuary_custom_avatar', finalAvatar);
                }
              }
            } catch (profileErr) {
              console.warn('Profile fetch warning (retaining cached session):', profileErr.message);
            }
          }
        } catch (error) {
          console.error('Session parsing error:', error);
          localStorage.removeItem('userInfo');
          setUser(null);
        }
      } else {
        // Automatically default visitor to the real primary user from database
        try {
          const res = await authService.switchAccount({ email: 'nikhilsehgal1806@gmail.com' });
          if (res.data) {
            const initialUser = {
              ...res.data,
              avatar: savedCustomAvatar || res.data.avatar,
            };
            setUser(initialUser);
            localStorage.setItem('userInfo', JSON.stringify(initialUser));
            if (initialUser.avatar) {
              localStorage.setItem('sanctuary_custom_avatar', initialUser.avatar);
            }
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
    const savedCustomAvatar = localStorage.getItem('sanctuary_custom_avatar');
    const finalUserData = {
      ...userData,
      avatar: userData.avatar || savedCustomAvatar,
    };
    localStorage.setItem('userInfo', JSON.stringify(finalUserData));
    if (finalUserData.avatar) {
      localStorage.setItem('sanctuary_custom_avatar', finalUserData.avatar);
    }
    setUser(finalUserData);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    // Note: We retain sanctuary_custom_avatar so next login/guest uses preferred aesthetic portrait
    setUser(null);
  };

  const updateAvatar = async (newAvatar) => {
    if (!newAvatar) return false;

    // 1. Optimistic instant local update in both storage keys & state
    const updated = {
      ...(user || {}),
      avatar: newAvatar,
    };
    setUser(updated);
    localStorage.setItem('userInfo', JSON.stringify(updated));
    localStorage.setItem('sanctuary_custom_avatar', newAvatar);

    // 2. Persist to backend and sync with MongoDB
    try {
      const res = await authService.updateAvatar({
        avatar: newAvatar,
        email: user?.email,
        username: user?.username,
        userId: user?._id || user?.id,
      });

      if (res?.data) {
        const synced = {
          ...updated,
          avatar: res.data.avatar || newAvatar,
          ...(res.data.token ? { token: res.data.token } : {}),
        };
        setUser(synced);
        localStorage.setItem('userInfo', JSON.stringify(synced));
        localStorage.setItem('sanctuary_custom_avatar', res.data.avatar || newAvatar);
      }
    } catch (err) {
      console.warn('Avatar synced locally; backend sync note:', err.message);
    }
    return true;
  };

  const switchToRealUser = async (targetEmailOrUsername) => {
    try {
      const res = await authService.switchAccount({
        email: targetEmailOrUsername || 'nikhilsehgal1806@gmail.com',
      });
      if (res.data) {
        const savedCustomAvatar = localStorage.getItem('sanctuary_custom_avatar');
        const switched = {
          ...res.data,
          avatar: res.data.avatar || savedCustomAvatar,
        };
        setUser(switched);
        localStorage.setItem('userInfo', JSON.stringify(switched));
        if (switched.avatar) {
          localStorage.setItem('sanctuary_custom_avatar', switched.avatar);
        }
        return switched;
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
