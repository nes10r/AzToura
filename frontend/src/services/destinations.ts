import api from './api';
import { ApiResponse, Destination } from '@/types';

export interface DestinationFilters {
  page?: number;
  limit?: number;
  region?: string;
  category?: string;
  featured?: boolean;
  search?: string;
}

export const destinationsService = {
  getAll: async (filters?: DestinationFilters) => {
    const { data } = await api.get<ApiResponse<Destination[]>>('/destinations', { params: filters });
    return data;
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get<ApiResponse<Destination>>(`/destinations/${slug}`);
    return data;
  },

  create: async (payload: Partial<Destination>) => {
    const { data } = await api.post<ApiResponse<Destination>>('/destinations', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Destination>) => {
    const { data } = await api.patch<ApiResponse<Destination>>(`/destinations/${id}`, payload);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<null>>(`/destinations/${id}`);
    return data;
  },
};
