import { apiClient } from './client';
import { PostResponse, PostCreateRequest, PostUpdateRequest } from '@/types/post';

export const postApi = {
  getList: (categoryId?: number) => {
    const params = categoryId ? `?categoryId=${categoryId}` : '';
    return apiClient.get<PostResponse[]>(`/api/posts${params}`);
  },

  getById: (id: number) =>
    apiClient.get<PostResponse>(`/api/posts/${id}`),

  create: (data: PostCreateRequest) =>
    apiClient.post<PostResponse>('/api/posts', data),

  update: (id: number, data: PostUpdateRequest) =>
    apiClient.put<PostResponse>(`/api/posts/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<void>(`/api/posts/${id}`),

  publish: (id: number) =>
    apiClient.put<PostResponse>(`/api/posts/${id}/publish`),
};
