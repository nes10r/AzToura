import api from './api';
import { ApiResponse, User } from '@/types';

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { name: string; email: string; password: string; phone?: string }
export interface AuthData { user: User; accessToken: string; refreshToken: string }

export const authService = {
  register: async (payload: RegisterPayload) => {
    const { data } = await api.post<ApiResponse<AuthData>>('/auth/register', payload);
    return data;
  },

  login: async (payload: LoginPayload) => {
    const { data } = await api.post<ApiResponse<AuthData>>('/auth/login', payload);
    return data;
  },

  logout: async () => {
    const { data } = await api.post<ApiResponse<null>>('/auth/logout');
    return data;
  },

  me: async () => {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    return data;
  },

  refreshToken: async (refreshToken: string) => {
    const { data } = await api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      '/auth/refresh-token',
      { refreshToken },
    );
    return data;
  },
};
