export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
}

export interface CategoryCreateRequest {
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
}
