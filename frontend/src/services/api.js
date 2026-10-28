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
  getExportCsvUrl: () => `${API_BASE_URL}/books/export/csv`,
};

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
};

export const systemService = {
  getInfo: () => api.get('/system/info'),
  getEvents: () => api.get('/system/events'),
  getFsDemo: () => api.get('/system/fs-demo'),
  getHealth: () => api.get('/health'),
};
