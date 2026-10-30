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

// Modular API Services
export const bookService = {
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
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
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getEmailPreviewUrl: (username, email) =>
    `${API_BASE_URL}/auth/email/preview?username=${encodeURIComponent(username || '')}&email=${encodeURIComponent(email || '')}`,
  getLoginEmailPreviewUrl: (username, email) =>
    `${API_BASE_URL}/auth/email/login-preview?username=${encodeURIComponent(username || '')}&email=${encodeURIComponent(email || '')}`,
  getResetEmailPreviewUrl: (username, email) =>
    `${API_BASE_URL}/auth/email/reset-preview?username=${encodeURIComponent(username || '')}&email=${encodeURIComponent(email || '')}`,
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
