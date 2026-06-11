import api from '@/utils/api';
import { Listing } from '@/types';

export const listingsService = {
  async getAll(params?: {
    category?: number;
    city?: string;
    min_price?: number;
    max_price?: number;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/listings', { params });
    return response.data;
  },

  async getById(id: string): Promise<Listing> {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },

  async create(data: any): Promise<Listing> {
    const response = await api.post('/listings', data);
    return response.data;
  },

  async update(id: string, data: any): Promise<Listing> {
    const response = await api.put(`/listings/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/listings/${id}`);
  },

  async uploadPhotos(id: string, files: File[]): Promise<any> {
    const formData = new FormData();
    files.forEach((file) => formData.append('photos', file));
    const response = await api.post(`/listings/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async addToFavorite(id: string): Promise<void> {
    await api.post(`/listings/${id}/favorite`);
  },

  async removeFromFavorite(id: string): Promise<void> {
    await api.delete(`/listings/${id}/favorite`);
  },
};
