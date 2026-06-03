import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  const isPublicRoute = config.url?.startsWith('/auth/');
  if (token && !isPublicRoute) {
    config.headers.Authorization = `Basic ${token}`;
  }
  return config;
});

export default api;