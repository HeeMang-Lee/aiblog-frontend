import type { MetadataRoute } from 'next';
import { getCategories, getPublishedPosts } from '@/lib/notion';
import { categoryUrl, postUrl, siteUrl } from '@/lib/site';

/** 글이 늘거나 바뀌면 sitemap 도 따라 바뀌어야 한다. 페이지와 같은 주기로 둔다. */
export const revalidate = 900;

/**
 * 크롤러에게 "이 주소들이 전부다"라고 알려준다. 링크를 타고 발견되기를
 * 기다리는 것보다 훨씬 빠르고, 서치 콘솔에 제출하면 색인 상태를 주소
 * 단위로 볼 수 있다.
 *
 * lastModified 는 글의 발행일을 쓴다. 빌드 시각을 넣으면 배포할 때마다
 * 모든 글이 수정된 것처럼 보여서 신호가 무의미해진다.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
  ]);

  const latest = posts[0]?.date ?? new Date().toISOString();

  return [
    {
      url: siteUrl,
      lastModified: new Date(latest),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...posts.map((post) => ({
      url: postUrl(post.slug),
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...categories.map((category) => ({
      url: categoryUrl(category.slug),
      lastModified: new Date(latest),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ];
}
