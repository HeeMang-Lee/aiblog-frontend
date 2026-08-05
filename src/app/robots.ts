import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

/**
 * /robots.txt 를 만든다. 없으면 404 가 나는데, 크롤러는 그걸 "제한 없음"으로
 * 읽으므로 치명적이지는 않다. 다만 sitemap 위치를 알려줄 자리가 사라진다.
 * 서치 콘솔에 제출하지 않은 검색엔진은 여기서 sitemap 을 찾는다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      // 방문자 카운터는 색인할 것이 없고, 크롤러가 부르면 숫자만 오염된다.
      { userAgent: '*', disallow: '/api/' },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
