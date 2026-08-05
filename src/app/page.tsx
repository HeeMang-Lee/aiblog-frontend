import type { Metadata } from 'next';
import { getCategories, getPublishedPosts, isNotionConfigured } from '@/lib/notion';
import { siteDescription, siteUrl } from '@/lib/site';
import { toISODate } from '@/lib/utils/date';
import Shell from '@/components/ide/Shell';
import PostRows from '@/components/ide/PostRows';

/**
 * Notion serves uploaded files through signed URLs that expire in about an
 * hour, so pages are rebuilt well inside that window.
 */
export const revalidate = 900;

export const metadata: Metadata = {
  alternates: {
    canonical: siteUrl,
    types: { 'application/rss+xml': `${siteUrl}/feed.xml` },
  },
  description: siteDescription,
};

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
  ]);

  return (
    <Shell
      tab="README.md"
      command="blog --list --status=published"
      result={
        <>
          <span className="text-string">{posts.length}</span> posts ·{' '}
          <span className="text-string">{categories.length}</span> categories
        </>
      }
      properties={[
        ['posts', String(posts.length)],
        ['categories', String(categories.length)],
        ['updated', posts[0] ? toISODate(posts[0].date) : '-'],
      ]}
    >
      <div className="border-b border-rule px-4 py-6 md:px-6">
        <div className="flex gap-4">
          <span className="w-6 shrink-0 select-none text-right font-mono text-[11px] text-gutter">
            1
          </span>
          <h1 className="text-[22px] font-semibold leading-[1.3] tracking-[-0.02em] text-ink">
            <span className="font-mono text-keyword"># </span>
            백엔드와 AI 협업
          </h1>
        </div>
        <div className="mt-1.5 flex gap-4">
          <span className="w-6 shrink-0 select-none text-right font-mono text-[11px] text-gutter">
            2
          </span>
          <p className="max-w-[68ch] text-[14px] leading-[1.7] text-body">
            만들면서 배운 것을 기록합니다. 실측한 숫자와 그때 내린 판단을 남겨
            둡니다.
          </p>
        </div>
      </div>

      <PostRows
        posts={posts}
        emptyMessage={
          isNotionConfigured
            ? '노션에서 글의 상태를 게시됨으로 바꾸면 여기에 나옵니다'
            : 'NOTION_TOKEN과 NOTION_DATABASE_ID를 .env.local에 넣어 주세요'
        }
      />
    </Shell>
  );
}
