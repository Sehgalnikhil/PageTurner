import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

const isDefaultOrPlaceholderAvatar = (url) => {
  if (!url || typeof url !== 'string') return true;
  if (url.includes('photo-1544717305-2782549b5136')) return true;
  return false;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const stored = localStorage.getItem('userInfo');
      const savedCustomAvatar = localStorage.getItem('sanctuary_custom_avatar');
      const hadExplicitChoice = localStorage.getItem('sanctuary_avatar_explicit_choice') === 'true';

      if (stored) {
        try {
          let parsed = JSON.parse(stored);
          const userEmail = parsed?.email;
          const userSpecific = userEmail ? localStorage.getItem(`sanctuary_custom_avatar_${userEmail}`) : null;
          const preferredAvatar = userSpecific || savedCustomAvatar;

          // Guarantee persistent user avatar from dedicated storage
          if (preferredAvatar && (isDefaultOrPlaceholderAvatar(parsed.avatar) || hadExplicitChoice)) {
            parsed.avatar = preferredAvatar;
          }

          // If session was using demo user, upgrade to primary database user, but PRESERVE user customizations
          if (parsed.username === 'Admin Demo' || parsed.email === 'admin@pageturner.io' || parsed.username === 'Reader Demo') {
            try {
              const res = await authService.switchAccount({ email: 'nikhilsehgal1806@gmail.com' });
              if (res.data) {
                parsed = {
                  ...res.data,
                  avatar: preferredAvatar || res.data.avatar || parsed.avatar,
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
                // If backend returns default or user had explicit avatar preference, keep preferredAvatar
                const finalAvatar = (preferredAvatar && (hadExplicitChoice || isDefaultOrPlaceholderAvatar(data.avatar)))
                  ? preferredAvatar
                  : (data.avatar || preferredAvatar || parsed.avatar);

                const updated = {
                  ...parsed,
                  ...data,
                  avatar: finalAvatar,
                };
                setUser(updated);
                localStorage.setItem('userInfo', JSON.stringify(updated));
                if (finalAvatar) {
                  localStorage.setItem('sanctuary_custom_avatar', finalAvatar);
                  if (userEmail) {
                    localStorage.setItem(`sanctuary_custom_avatar_${userEmail}`, finalAvatar);
                  }
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
            const userEmail = res.data.email;
            const userSpecific = userEmail ? localStorage.getItem(`sanctuary_custom_avatar_${userEmail}`) : null;
            const preferredAvatar = userSpecific || savedCustomAvatar;

            const finalAvatar = (preferredAvatar && (hadExplicitChoice || isDefaultOrPlaceholderAvatar(res.data.avatar)))
              ? preferredAvatar
              : (res.data.avatar || preferredAvatar || '/images/eleanor-avatar.jpg');

            const initialUser = {
              ...res.data,
              avatar: finalAvatar,
            };
            setUser(initialUser);
            localStorage.setItem('userInfo', JSON.stringify(initialUser));
            if (finalAvatar) {
              localStorage.setItem('sanctuary_custom_avatar', finalAvatar);
              if (userEmail) {
                localStorage.setItem(`sanctuary_custom_avatar_${userEmail}`, finalAvatar);
              }
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
    const userEmail = userData?.email;
    const userSpecific = userEmail ? localStorage.getItem(`sanctuary_custom_avatar_${userEmail}`) : null;
    const globalCustom = localStorage.getItem('sanctuary_custom_avatar');
    const preferredAvatar = userSpecific || globalCustom;
    const hadExplicitChoice = localStorage.getItem('sanctuary_avatar_explicit_choice') === 'true';

    // Prioritize user's new custom chosen avatar over older or default avatar
    let finalAvatar = userData?.avatar;
    if (preferredAvatar) {
      if (!userData?.avatar || isDefaultOrPlaceholderAvatar(userData.avatar) || hadExplicitChoice) {
        finalAvatar = preferredAvatar;
      }
    }

    if (!finalAvatar) {
      finalAvatar = '/images/eleanor-avatar.jpg';
    }

    const finalUserData = {
      ...userData,
      avatar: finalAvatar,
    };

    localStorage.setItem('userInfo', JSON.stringify(finalUserData));
    localStorage.setItem('sanctuary_custom_avatar', finalAvatar);
    if (userEmail) {
      localStorage.setItem(`sanctuary_custom_avatar_${userEmail}`, finalAvatar);
    }
    setUser(finalUserData);

    // If local preferred avatar differs from server data (e.g. server had old avatar), sync to MongoDB live
    if (finalAvatar && finalAvatar !== userData?.avatar) {
      authService
        .updateAvatar({
          avatar: finalAvatar,
          email: userEmail,
          userId: userData?._id || userData?.id,
        })
        .catch((err) => {
          console.warn('Live avatar sync to database note:', err.message);
        });
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    // Note: We deliberately PRESERVE sanctuary_custom_avatar, sanctuary_avatar_explicit_choice,
    // and user-specific avatar keys so when the reader logs back in, their new portrait is restored!
    setUser(null);
  };

  const updateAvatar = async (newAvatar) => {
    if (!newAvatar) return false;

    const userEmail = user?.email;

    // 1. Optimistic instant local update in both storage keys & state
    const updated = {
      ...(user || {}),
      avatar: newAvatar,
    };
    setUser(updated);
    localStorage.setItem('userInfo', JSON.stringify(updated));
    localStorage.setItem('sanctuary_custom_avatar', newAvatar);
    localStorage.setItem('sanctuary_avatar_explicit_choice', 'true');
    if (userEmail) {
      localStorage.setItem(`sanctuary_custom_avatar_${userEmail}`, newAvatar);
    }

    // 2. Persist to backend and sync with MongoDB
    try {
      const res = await authService.updateAvatar({
        avatar: newAvatar,
        email: userEmail,
        username: user?.username,
        userId: user?._id || user?.id,
      });

      if (res?.data) {
        const syncedAvatar = res.data.avatar || newAvatar;
        const synced = {
          ...updated,
          avatar: syncedAvatar,
          ...(res.data.token ? { token: res.data.token } : {}),
        };
        setUser(synced);
        localStorage.setItem('userInfo', JSON.stringify(synced));
        localStorage.setItem('sanctuary_custom_avatar', syncedAvatar);
        if (userEmail) {
          localStorage.setItem(`sanctuary_custom_avatar_${userEmail}`, syncedAvatar);
        }
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
        const userEmail = res.data.email;
        const userSpecific = userEmail ? localStorage.getItem(`sanctuary_custom_avatar_${userEmail}`) : null;
        const savedCustomAvatar = userSpecific || localStorage.getItem('sanctuary_custom_avatar');
        const hadExplicitChoice = localStorage.getItem('sanctuary_avatar_explicit_choice') === 'true';

        const finalAvatar = (savedCustomAvatar && (hadExplicitChoice || isDefaultOrPlaceholderAvatar(res.data.avatar)))
          ? savedCustomAvatar
          : (res.data.avatar || savedCustomAvatar || '/images/eleanor-avatar.jpg');

        const switched = {
          ...res.data,
          avatar: finalAvatar,
        };
        setUser(switched);
        localStorage.setItem('userInfo', JSON.stringify(switched));
        if (finalAvatar) {
          localStorage.setItem('sanctuary_custom_avatar', finalAvatar);
          if (userEmail) {
            localStorage.setItem(`sanctuary_custom_avatar_${userEmail}`, finalAvatar);
          }
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
