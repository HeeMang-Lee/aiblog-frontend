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

/**
 * 검색엔진 소유권 확인 토큰. HTML 에 그대로 나가는 공개 값이라 환경변수로
 * 숨길 이유가 없다.
 *
 * 루트 레이아웃에서만 쓴다. Next 는 이 필드를 루트 metadata 에서만 내보내고
 * 하위 라우트에 같이 넣어도 무시한다. 확인해 봤고, 그래도 상관없다 -
 * 서치 콘솔과 네이버는 등록한 주소(여기서는 루트)만 가져가서 태그를 찾는다.
 * 하위 페이지에 있어 봐야 아무도 읽지 않는다.
 *
 * 네이버를 같이 두는 이유: 한국어 기술 검색은 네이버 유입 비중이 낮지 않다.
 * 구글만 등록하면 절반을 버린다.
 */
export const verification = {
  google: 'XeehbOS3PH51puL9wHS8bLGbbpMjd48OciJ51QwbXkg',
  other: {
    'naver-site-verification': '36856108e951971915e309ca707ca959e3e2b61d',
  },
};
