import { apiClient } from './client';
import { CategoryResponse, CategoryCreateRequest } from '@/types/category';

export const categoryApi = {
  getList: () =>
    apiClient.get<CategoryResponse[]>('/api/categories'),

  getById: (id: number) =>
    apiClient.get<CategoryResponse>(`/api/categories/${id}`),

  create: (data: CategoryCreateRequest) =>
    apiClient.post<CategoryResponse>('/api/categories', data),

  update: (id: number, data: CategoryCreateRequest) =>
    apiClient.put<CategoryResponse>(`/api/categories/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<void>(`/api/categories/${id}`),
};
