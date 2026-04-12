export interface AttachmentResponse {
  id: number;
  postId: number;
  type: string;
  url: string;
  originalFilename: string | null;
  fileSize: number | null;
  displayOrder: number;
  createdAt: string;
}

export interface AttachmentCreateRequest {
  type: string;
  url: string;
  originalFilename?: string;
  fileSize?: number;
  displayOrder: number;
}
