import { getPostMarkdown, getPublishedPosts } from '@/lib/notion';
import { postUrl, siteDescription, siteName, siteUrl } from '@/lib/site';
import { excerpt } from '@/lib/utils/words';

export const revalidate = 900;

/** XML 안에서는 이 다섯 글자가 마크업으로 읽힌다. */
function xml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * RSS 피드. 검색 순위에 직접 영향을 주지는 않지만, 개발 블로그를 구독으로
 * 읽는 사람들이 실제로 쓰고 피드 수집기가 새 글을 빨리 물어 간다.
 * 유입 경로를 하나 더 두는 셈이다.
 */
export async function GET() {
  const posts = await getPublishedPosts();

  const items = await Promise.all(
    posts.slice(0, 20).map(async (post) => {
      const description = post.summary || excerpt(await getPostMarkdown(post.id));
      return [
        '    <item>',
        `      <title>${xml(post.title)}</title>`,
        `      <link>${xml(postUrl(post.slug))}</link>`,
        `      <guid isPermaLink="true">${xml(postUrl(post.slug))}</guid>`,
        `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        `      <description>${xml(description)}</description>`,
        post.category ? `      <category>${xml(post.category)}</category>` : '',
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
  );

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${xml(siteName)}</title>`,
    `    <link>${xml(siteUrl)}</link>`,
    `    <description>${xml(siteDescription)}</description>`,
    '    <language>ko</language>',
    `    <atom:link href="${xml(`${siteUrl}/feed.xml`)}" rel="self" type="application/rss+xml" />`,
    ...items,
    '  </channel>',
    '</rss>',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=900, stale-while-revalidate',
    },
  });
}
