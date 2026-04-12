import { apiClient } from './client';
import { VisitorStatsResponse } from '@/types/visitor';

export const visitorApi = {
  getStats: () =>
    apiClient.get<VisitorStatsResponse>('/api/visitors/stats'),
};
