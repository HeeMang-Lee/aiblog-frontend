import { apiClient } from './client';
import { AttachmentResponse, AttachmentCreateRequest } from '@/types/attachment';

export const attachmentApi = {
  getList: (postId: number) =>
    apiClient.get<AttachmentResponse[]>(`/api/posts/${postId}/attachments`),

  create: (postId: number, data: AttachmentCreateRequest) =>
    apiClient.post<AttachmentResponse>(`/api/posts/${postId}/attachments`, data),

  delete: (id: number) =>
    apiClient.delete<void>(`/api/attachments/${id}`),
};
