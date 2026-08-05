import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/notion';
import { siteName } from '@/lib/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = siteName;
/** 글이 바뀌면 썸네일도 따라 바뀐다. 페이지와 같은 주기로 둔다. */
export const revalidate = 900;

/**
 * 공유 썸네일을 직접 그린다.
 *
 * 노션 커버를 쓰지 않는 이유는 두 가지다. 노션이 주는 S3 링크는 한 시간이면
 * 만료돼서 카카오톡이나 슬랙이 나중에 다시 가져올 때 깨지고, 애초에 커버를
 * 안 넣은 글에는 아무것도 안 나온다. 여기서 만들면 글 제목이 그대로 썸네일이
 * 되고 만료되지 않는다.
 *
 * 폰트를 따로 싣지 않는다. 한글 자체 호스팅 청크는 190개짜리 서브셋이라
 * 어느 청크에 어떤 글자가 들어 있는지 미리 알 수 없다. 대신 이 이미지는
 * 큰 글자와 괘선만 쓰므로 기본 폰트로도 형태가 유지된다.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // 메타 태그로 나가는 주소는 한 번 더 인코딩돼서 slug 에 %EB.. 형태로 들어온다.
  // 이미 풀린 한글이면 디코딩이 그냥 통과하고, 깨진 이스케이프면 예외가 나므로
  // 원본을 쓴다 - 썸네일 하나 때문에 페이지가 500 이 되면 안 된다.
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    decoded = slug;
  }
  const post = await getPostBySlug(decoded);
  const title = post?.title ?? siteName;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          // 사이트의 다크 토큰과 같은 값이다.
          background: '#080a09',
          color: '#d6e2d8',
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: '#ff5f57' }} />
          <div style={{ width: 14, height: 14, borderRadius: 7, background: '#febc2e' }} />
          <div style={{ width: 14, height: 14, borderRadius: 7, background: '#28c840' }} />
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: title.length > 34 ? 60 : 76,
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
            // 넉 줄을 넘으면 잘라서 아래 줄을 덮지 않게 한다.
            maxHeight: 340,
            overflow: 'hidden',
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '1px solid #1c221e',
            paddingTop: 28,
            fontSize: 26,
            color: '#6b7a6e',
          }}
        >
          <span>{siteName}</span>
          <span style={{ color: '#4ade80' }}>
            {post?.category ?? ''}
          </span>
        </div>
      </div>
    ),
    size
  );
}
