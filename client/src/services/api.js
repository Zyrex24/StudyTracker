import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (userData) => api.post('/api/users', userData),
  login: (credentials) => api.post('/api/users/login', credentials),
  getProfile: () => api.get('/api/users/me'),
  updateProfile: (userData) => api.put('/api/users', userData),
  updatePreferences: (preferences) => api.put('/api/users/preferences', preferences),
};

export const tasks = {
  getAll: () => api.get('/api/tasks'),
  getById: (id) => api.get(`/api/tasks/${id}`),
  create: (taskData) => api.post('/api/tasks', taskData),
  update: (id, taskData) => api.put(`/api/tasks/${id}`, taskData),
  delete: (id) => api.delete(`/api/tasks/${id}`),
  getBySubject: (subjectId) => api.get(`/api/tasks/subject/${subjectId}`),
  updateProgress: (id, progressData) => api.put(`/api/tasks/${id}/progress`, progressData),
};

export const subjects = {
  getAll: () => api.get('/api/subjects'),
  getById: (id) => api.get(`/api/subjects/${id}`),
  create: (subjectData) => api.post('/api/subjects', subjectData),
  update: (id, subjectData) => api.put(`/api/subjects/${id}`, subjectData),
  delete: (id) => api.delete(`/api/subjects/${id}`),
  updateProgress: (id, progressData) => api.put(`/api/subjects/${id}/progress`, progressData),
};

export const stats = {
  getDaily: () => api.get('/api/stats/daily'),
  getWeekly: () => api.get('/api/stats/weekly'),
  getMonthly: () => api.get('/api/stats/monthly'),
  updateStudyTime: (timeData) => api.put('/api/stats/study-time', timeData),
  getProductivity: () => api.get('/api/stats/productivity'),
};

export default api;
