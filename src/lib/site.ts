/**
 * 사이트의 절대 주소. 검색엔진에 주는 canonical, sitemap, OG 태그가 전부
 * 여기에 걸린다.
 *
 * 환경변수가 없으면 Vercel 이 주는 배포 주소로 떨어진다. 이게 없으면
 * localhost 가 canonical 로 나가서 색인이 통째로 망가진다 - 사람 눈에는
 * 안 보이고 검색 결과에서만 티가 나는 종류의 사고라 폴백을 둔다.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
).replace(/\/$/, '');

export const siteName = '이희망 기술 블로그';

export const siteDescription =
  '백엔드와 AI 협업에 대해 쓰는 개인 기술 블로그입니다. 동시성 제어, 메시징, 외부 API 신뢰성 설계와 머신러닝 기초를 다룹니다.';

/** 한글이 들어간 슬러그는 그대로 두면 유효한 URL 이 아니다. */
export function postUrl(slug: string): string {
  return `${siteUrl}/posts/${encodeURIComponent(slug)}`;
}

export function categoryUrl(slug: string): string {
  return `${siteUrl}/categories/${encodeURIComponent(slug)}`;
}
