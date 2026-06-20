import axios from 'axios';

const BASE = (typeof process.env.NEXT_PUBLIC_API_URL === 'string' &&
  process.env.NEXT_PUBLIC_API_URL &&
  process.env.NEXT_PUBLIC_API_URL !== 'undefined')
  ? process.env.NEXT_PUBLIC_API_URL
  : '/api';

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${BASE}/auth/refresh-token`,
            { refreshToken },
          );
          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          error.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(error.config);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
