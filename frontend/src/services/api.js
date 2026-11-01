import axios from 'axios';

// Centralized Axios Instance with Interceptors
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token into Authorization header if available
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (e) {
        console.error('Error parsing userInfo from localStorage', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardize error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';

    // If unauthorized, could notify or clear expired token
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - session may be expired');
    }

    return Promise.reject({ ...error, customMessage: message });
  }
);

export default api;

// In-memory instant LRU cache for 0ms hover-prefetched book details
const bookDetailCache = new Map();

// Modular API Services
export const bookService = {
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => {
    if (bookDetailCache.has(id)) {
      return Promise.resolve({ data: bookDetailCache.get(id), fromCache: true });
    }
    return api.get(`/books/${id}`).then((res) => {
      bookDetailCache.set(id, res.data);
      return res;
    });
  },
  prefetchById: (id) => {
    if (!id || bookDetailCache.has(id)) return;
    api.get(`/books/${id}`)
      .then((res) => {
        bookDetailCache.set(id, res.data);
      })
      .catch(() => { });
  },
  create: (formData) =>
    api.post('/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, formData) =>
    api.put(`/books/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/books/${id}`),
  addReview: (id, reviewData) => api.post(`/books/${id}/reviews`, reviewData),
  updateReview: (id, reviewId, reviewData) => api.put(`/books/${id}/reviews/${reviewId}`, reviewData),
  deleteReview: (id, reviewId) => api.delete(`/books/${id}/reviews/${reviewId}`),
  getExportCsvUrl: () => `${API_BASE_URL}/books/export/csv`,
};

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  sendWelcomeEmail: (data) => api.post('/auth/send-welcome-email', data),
  sendLoginAlert: (data) => api.post('/auth/send-login-alert', data),
  updateAvatar: (payload) => {
    const data = typeof payload === 'string' ? { avatar: payload } : payload;
    return api.put('/auth/avatar', data);
  },
  getRealUsers: () => api.get('/auth/real-users'),
  switchAccount: (data) => api.post('/auth/switch-account', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getEmailPreviewUrl: (username, email) =>
    `${API_BASE_URL}/auth/email/preview?username=${encodeURIComponent(username || '')}&email=${encodeURIComponent(email || '')}&frontendUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`,
  getLoginEmailPreviewUrl: (username, email) =>
    `${API_BASE_URL}/auth/email/login-preview?username=${encodeURIComponent(username || '')}&email=${encodeURIComponent(email || '')}&frontendUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`,
  getResetEmailPreviewUrl: (username, email) =>
    `${API_BASE_URL}/auth/email/reset-preview?username=${encodeURIComponent(username || '')}&email=${encodeURIComponent(email || '')}&frontendUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`,
};

export const systemService = {
  getInfo: () => api.get('/system/info'),
  getEvents: () => api.get('/system/events'),
  getFsDemo: () => api.get('/system/fs-demo'),
  getHealth: () => api.get('/health'),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getReviews: () => api.get('/admin/reviews'),
  deleteReview: (bookId, reviewId) => api.delete(`/admin/reviews/${bookId}/${reviewId}`),
  bulkDeleteReviews: (items) => api.post('/admin/reviews/bulk-delete', { items }),
  sendWelcomeEmail: (id) => api.post(`/admin/users/${id}/welcome-email`),
  toggleFeatureBook: (id) => api.put(`/admin/books/${id}/toggle-feature`),
  quickEditBook: (id, data) => api.put(`/admin/books/${id}/quick-edit`, data),
  bulkDeleteBooks: (ids) => api.post('/admin/books/bulk-delete', { ids }),
  bulkUpdateCategory: (ids, category) => api.post('/admin/books/bulk-category', { ids, category }),
  getAuditLogs: () => api.get('/admin/audit-logs'),
  getAnnouncement: () => api.get('/admin/announcement'),
  getPublicAnnouncement: () => api.get('/admin/announcement/public'),
  updateAnnouncement: (data) => api.put('/admin/announcement', data),
  reseedCatalog: () => api.post('/admin/reseed'),
  getBackupJsonUrl: () => `${API_BASE_URL}/admin/backup/json`,
  getExportCsvUrl: () => `${API_BASE_URL}/books/export/csv`,
};

export const communityService = {
  getParlours: (params) => api.get('/community/parlours', { params }),
  getParlourBySlug: (slug) => api.get(`/community/parlours/${slug}`),
  createParlour: (data) => api.post('/community/parlours', data),
  toggleJoinParlour: (slug, username) => api.post(`/community/parlours/${slug}/join`, { username }),
  getPosts: (params) => api.get('/community/posts', { params }),
  createPost: (data) => api.post('/community/posts', data),
  toggleLikePost: (id, username) => api.post(`/community/posts/${id}/like`, { username }),
  toggleBookmarkPost: (id, username) => api.post(`/community/posts/${id}/bookmark`, { username }),
  addComment: (id, data) => api.post(`/community/posts/${id}/comments`, data),
  getCommunityReaders: () => api.get('/community/readers'),
  // 1. Marginalia Exchange
  getMarginalia: (params) => api.get('/community/marginalia', { params }),
  createMarginalia: (data) => api.post('/community/marginalia', data),
  reactMarginalia: (id, reactionType, userIdentifier) =>
    api.post(`/community/marginalia/${id}/react`, { reactionType, userIdentifier }),
  // 2. Literary Mailbox & Letters
  getLetters: (email) => api.get('/community/letters', { params: { email } }),
  sendLetter: (data) => api.post('/community/letters', data),
  openLetter: (id) => api.patch(`/community/letters/${id}/open`),
  // 3. Socratic Debate
  getDebate: () => api.get('/community/debate'),
  voteDebate: (side, userIdentifier) =>
    api.post('/community/debate/vote', { side, userIdentifier }),
  addDebateArgument: (data) => api.post('/community/debate/argument', data),
  // 4. Silent Reading Sprints
  getSprint: (slug) => api.get(`/community/sprint/${slug}`),
  joinSprint: (slug, data) => api.post(`/community/sprint/${slug}/join`, data),
  completeSprint: (slug, data) => api.post(`/community/sprint/${slug}/complete`, data),
  // 5. Sanctuary XP & Progression
  claimDailyXp: (data) => api.post('/community/claim-daily-xp', data),
  getUserProgress: (email) => api.get(`/community/user-progress/${encodeURIComponent(email)}`),
};
