import Image from 'next/image';
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
import { countWords, excerpt } from '@/lib/utils/words';
import { postUrl, siteName, siteUrl } from '@/lib/site';

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
  if (!post) return { title: '글을 찾을 수 없습니다', robots: { index: false } };

  // 노션의 요약 속성이 비어 있으면 본문에서 뽑는다. 설명이 아예 없으면
  // 구글이 본문에서 제멋대로 잘라 쓴다.
  const markdown = await getPostMarkdown(post.id);
  const description = post.summary || excerpt(markdown);
  const url = postUrl(post.slug);

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url,
      siteName,
      locale: 'ko_KR',
      publishedTime: post.date,
      modifiedTime: post.date,
      tags: post.tags,
      // 커버는 넣지 않는다. 노션이 주는 S3 링크는 한 시간이면 만료돼서
      // 공유 썸네일이 나중에 깨진다. opengraph-image.tsx 가 만료되지 않는
      // 이미지를 대신 만든다.
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
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

  // 마크다운 원문을 그대로 세면 안 된다. 노션의 이미지 주소가 한 장에
  // 1,700자씩이라 분량의 대부분을 차지한다. countWords 가 걷어낸다.
  const wordCount = countWords(markdown);

  // 구조화 데이터. 검색 결과에 날짜와 작성자가 붙는 자리이고, 이게 없으면
  // 구글이 제목과 본문만으로 추측한다. 화면에 보이는 값과 어긋나면 안 되므로
  // 전부 같은 post 에서 가져온다.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary || excerpt(markdown),
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'ko-KR',
    author: { '@type': 'Person', name: '이희망', url: siteUrl },
    publisher: { '@type': 'Person', name: '이희망', url: siteUrl },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl(post.slug) },
    url: postUrl(post.slug),
    keywords: post.tags.join(', '),
    articleSection: post.category ?? undefined,
    wordCount,
  };

  return (
    <>
      {/* 구조화 데이터는 화면에 그리지 않는다. dangerouslySetInnerHTML 을
          쓰는 이유는 JSON 안의 따옴표가 이스케이프되지 않아야 하기 때문이고,
          내용이 전부 우리 데이터라 주입 경로가 없다. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
      ]}
    >
      {/* 셸이 화면을 꽉 채우면 편집기 칸이 본문보다 훨씬 넓어진다. 글 기둥을
          가운데로 두지 않으면 오른쪽이 통째로 비어 한쪽으로 쏠려 보인다. */}
      <article className="mx-auto w-full max-w-[92ch] px-4 py-8 md:px-6 md:py-10">
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
          /* 원본 비율을 그대로 두려고 width/height 는 비율 힌트로만 준다.
             불러온 뒤에는 h-auto 가 실제 비율을 따르므로 잘리지 않는다.
             next/image 를 쓰면 최적화본이 우리 쪽에 캐시돼서, 한 시간이면
             만료되는 노션 S3 링크가 끊겨도 이미 받아 둔 그림이 남는다. */
          <Image
            src={post.cover}
            alt=""
            width={1600}
            height={900}
            sizes="(max-width: 768px) 100vw, 800px"
            className="mt-8 h-auto w-full rounded-xs border border-rule"
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
    </>
  );
}
