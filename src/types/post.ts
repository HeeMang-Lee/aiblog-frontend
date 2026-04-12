export type PostStatus = 'DRAFT' | 'PUBLISHED';

export interface PostResponse {
  id: number;
  categoryId: number;
  categoryName: string;
  title: string;
  content: string;
  slug: string;
  status: PostStatus;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostCreateRequest {
  categoryId: number;
  title: string;
  content: string;
  slug: string;
}

export interface PostUpdateRequest {
  categoryId: number;
  title: string;
  content: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}
