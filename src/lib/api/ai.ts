import { apiClient } from './client';
import { AiResultResponse, PostRecommendationResponse } from '@/types/ai';

export const aiApi = {
  requestFeedback: (postId: number) =>
    apiClient.post<AiResultResponse>(`/api/posts/${postId}/ai-feedback`),

  refreshRecommendation: (postId: number) =>
    apiClient.post<void>(`/api/posts/${postId}/ai-recommendation/refresh`),

  getResults: (postId: number, type?: string) => {
    const params = type ? `?type=${type}` : '';
    return apiClient.get<AiResultResponse[]>(`/api/posts/${postId}/ai-results${params}`);
  },

  getRecommendations: (postId: number) =>
    apiClient.get<PostRecommendationResponse[]>(`/api/posts/${postId}/recommendations`),
};
