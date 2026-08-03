import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ApiResponse } from '@/types/api';
import { PostResponse } from '@/types/post';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import RecommendedPosts from '@/components/blog/RecommendedPosts';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { formatDate } from '@/lib/utils/date';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getPost(id: string): Promise<PostResponse | null> {
  try {
    const res = await fetch(`${API_URL}/api/posts/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const body: ApiResponse<PostResponse> = await res.json();
    return body.success ? body.data : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: '게시글을 찾을 수 없습니다' };

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.content.substring(0, 160),
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.content.substring(0, 160),
      images: post.ogImage ? [post.ogImage] : [],
    },
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <Header />
      <main className="mx-auto w-full max-w-[720px] flex-1 px-5 py-10">
        <article>
          {/* Header */}
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-sm font-medium text-accent">
                {post.categoryName}
              </span>
            </div>
            <h1 className="text-3xl font-bold leading-tight text-text-primary">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center gap-3 text-sm text-text-tertiary">
              <time>{formatDate(post.createdAt)}</time>
              <span className="text-border-primary">|</span>
              <span>조회 {post.viewCount}</span>
            </div>
          </div>

          {/* Thumbnail */}
          {post.ogImage && (
            <div className="mb-10 overflow-hidden rounded-2xl bg-bg-hero">
              <img
                src={post.ogImage}
                alt={post.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <MarkdownRenderer content={post.content} />
        </article>

        <RecommendedPosts postId={post.id} />
      </main>
      <Footer />
    </div>
  );
}
