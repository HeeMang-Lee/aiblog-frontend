import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getPostBySlug,
  getPostMarkdown,
  getPublishedPosts,
  getRelatedPosts,
} from '@/lib/notion';
import Shell from '@/components/ide/Shell';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import RelatedPosts from '@/components/ide/RelatedPosts';
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

  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  // 한국어 성인 평균 묵독 속도는 분당 500~600자 근처다. 공백 기준 어절이
  // 아니라 글자 수로 재야 한글에서 값이 맞는다.
  const charCount = markdown.replace(/\s/g, '').length;
  const readingMinutes = charCount ? Math.max(1, Math.round(charCount / 500)) : 0;

  return (
    <Shell
      tab={`${post.slug}.md`}
      slug={post.slug}
      command={`cat posts/${post.slug}.md`}
      result={
        <>
          <span className="text-string">{wordCount}</span> words ·{' '}
          {post.category ?? 'uncategorized'}
        </>
      }
      properties={[
        ['status', post.status === 'PUBLISHED' ? '게시됨' : '초안'],
        ['category', post.category ?? '-'],
        ['date', toISODate(post.date) || '-'],
        ['tags', post.tags.length ? post.tags.join(', ') : '-'],
        ['reading', readingMinutes ? `${readingMinutes} min` : '-'],
      ]}
    >
      <article className="px-4 py-8 md:px-6 md:py-10">
        <header className="border-b border-rule pb-6">
          <div className="flex gap-4">
            <span className="w-6 shrink-0 select-none pt-2 text-right font-mono text-[11px] text-gutter">
              1
            </span>
            <h1 className="max-w-[24ch] text-[clamp(1.6rem,3.6vw,2.15rem)] font-semibold leading-[1.3] tracking-[-0.025em] text-ink">
              <span className="font-mono text-keyword"># </span>
              {post.title}
            </h1>
          </div>

          <div className="mt-3 flex gap-4">
            <span className="w-6 shrink-0 select-none text-right font-mono text-[11px] text-gutter">
              2
            </span>
            <p className="flex flex-wrap items-center gap-x-3 font-mono text-[11px] text-meta">
              <time dateTime={toISODate(post.date)} className="tnum">
                {formatDate(post.date)}
              </time>
              {post.category && <span className="text-string">{post.category}</span>}
              {post.tags.map((tag) => (
                <span key={tag} className="text-gutter">
                  #{tag}
                </span>
              ))}
            </p>
          </div>

          {post.summary && (
            <div className="mt-3 flex gap-4">
              <span className="w-6 shrink-0 select-none text-right font-mono text-[11px] text-gutter">
                3
              </span>
              <p className="max-w-[68ch] text-[14px] leading-[1.7] text-body">
                {post.summary}
              </p>
            </div>
          )}
        </header>

        {post.cover && (
          <img
            src={post.cover}
            alt=""
            className="mt-8 w-full rounded-xs border border-rule object-cover"
          />
        )}

        {/* The article itself is prose, not source. The editor language stays
            in the chrome so the reading experience is not sacrificed to it. */}
        <div className="mt-8">
          {markdown ? (
            <MarkdownRenderer content={markdown} />
          ) : (
            <p className="text-[14px] text-meta">
              <span className="font-mono">{'// '}</span>
              본문이 비어 있습니다
            </p>
          )}
        </div>
      </article>

      <RelatedPosts posts={related} />
    </Shell>
  );
}
