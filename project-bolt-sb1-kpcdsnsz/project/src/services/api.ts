import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Session expired
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      // Get error message from server
      const errorMessage = error.response.data.message || 'Something went wrong';
      error.message = errorMessage;
    }
    return Promise.reject(error);
  }
);

export default api;