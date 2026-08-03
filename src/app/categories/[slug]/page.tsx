import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ApiResponse } from '@/types/api';
import { PostResponse } from '@/types/post';
import { CategoryResponse } from '@/types/category';
import PostList from '@/components/blog/PostList';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getCategory(id: string): Promise<CategoryResponse | null> {
  try {
    const res = await fetch(`${API_URL}/api/categories/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const body: ApiResponse<CategoryResponse> = await res.json();
    return body.success ? body.data : null;
  } catch {
    return null;
  }
}

async function getPostsByCategory(categoryId: string): Promise<PostResponse[]> {
  try {
    const res = await fetch(`${API_URL}/api/posts?categoryId=${categoryId}`, { cache: 'no-store' });
    const body: ApiResponse<PostResponse[]> = await res.json();
    return body.success ? body.data : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const category = await getCategory(id);
  if (!category) return { title: '카테고리를 찾을 수 없습니다' };

  return {
    title: `${category.name} - AI Blog`,
    description: category.description || `${category.name} 카테고리의 게시글 목록`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { id } = await params;
  const [category, posts] = await Promise.all([
    getCategory(id),
    getPostsByCategory(id),
  ]);

  if (!category) notFound();

  const publishedPosts = posts.filter((p) => p.status === 'PUBLISHED');

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <Header />
      <main className="mx-auto w-full max-w-[720px] flex-1 px-5 py-10">
        <div className="mb-10">
          <span className="text-sm font-medium text-accent">{category.name}</span>
          <h1 className="mt-2 text-2xl font-bold text-text-primary">{category.name}</h1>
          {category.description && (
            <p className="mt-2 text-text-secondary">{category.description}</p>
          )}
        </div>
        <PostList posts={publishedPosts} />
      </main>
      <Footer />
    </div>
  );
}
