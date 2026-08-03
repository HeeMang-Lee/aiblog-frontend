import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  getPostBySlug,
  getPostMarkdown,
  getPublishedPosts,
  getRelatedPosts,
} from '@/lib/notion';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import RecommendedPosts from '@/components/blog/RecommendedPosts';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { formatDate, toISODate } from '@/lib/utils/date';

export const revalidate = 900;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: '글을 찾을 수 없습니다' };

  return {
    title: post.title,
    description: post.summary || undefined,
    openGraph: {
      title: post.title,
      description: post.summary || undefined,
      type: 'article',
      publishedTime: post.date,
      images: post.cover ? [post.cover] : [],
    },
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [markdown, related] = await Promise.all([
    getPostMarkdown(post.id),
    getRelatedPosts(post),
  ]);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header />
      <main className="mx-auto w-full max-w-[760px] flex-1 px-5 py-14 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.02em] text-meta transition-colors hover:text-ink"
        >
          <ArrowLeft size={13} strokeWidth={1.5} />
          목록
        </Link>

        <article className="mt-8">
          <header className="border-b border-rule pb-8">
            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] tracking-[0.02em] text-meta">
              {post.category && <span>{post.category}</span>}
              {post.category && (
                <span aria-hidden className="text-rule-strong">
                  ·
                </span>
              )}
              <time
                dateTime={toISODate(post.date)}
                className="font-mono tnum tracking-[0.08em]"
              >
                {formatDate(post.date)}
              </time>
            </p>

            <h1 className="mt-3 max-w-[24ch] text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.25] tracking-[-0.025em] text-ink">
              {post.title}
            </h1>

            {post.summary && (
              <p className="mt-4 max-w-[68ch] text-[16px] leading-[1.7] text-body">
                {post.summary}
              </p>
            )}

            {post.tags.length > 0 && (
              <p className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[11px] tracking-[0.02em] text-meta">
                {post.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </p>
            )}
          </header>

          {post.cover && (
            <img
              src={post.cover}
              alt=""
              className="mt-10 w-full rounded-xs border border-rule object-cover"
            />
          )}

          <div className="mt-10">
            {markdown ? (
              <MarkdownRenderer content={markdown} />
            ) : (
              <p className="text-[15px] text-meta">본문이 비어 있습니다.</p>
            )}
          </div>
        </article>

        <RecommendedPosts posts={related} />
      </main>
      <Footer />
    </div>
  );
}
