import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategories, getPostsByCategorySlug } from '@/lib/notion';
import { categoryUrl } from '@/lib/site';
import Shell from '@/components/ide/Shell';
import PostRows from '@/components/ide/PostRows';

export const revalidate = 900;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getPostsByCategorySlug(slug);
  if (!category) return { title: '카테고리를 찾을 수 없습니다', robots: { index: false } };

  const description = `${category.name} 카테고리의 글 목록`;

  return {
    title: category.name,
    description,
    alternates: { canonical: categoryUrl(category.slug) },
    openGraph: {
      title: category.name,
      description,
      url: categoryUrl(category.slug),
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const { category, posts } = await getPostsByCategorySlug(slug);
  if (!category) notFound();

  return (
    <Shell
      tab={`categories/${category.slug}`}
      command={`blog --list --category="${category.name}"`}
      result={
        <>
          <span className="text-string">{posts.length}</span> posts
        </>
      }
      properties={[
        ['category', category.name],
        ['posts', String(category.count)],
        ['slug', category.slug],
      ]}
    >
      <div className="border-b border-rule px-4 py-6 md:px-6">
        <div className="flex gap-4">
          <span className="w-6 shrink-0 select-none text-right font-mono text-[11px] text-gutter">
            1
          </span>
          <h1 className="text-[22px] font-semibold leading-[1.3] tracking-[-0.02em] text-ink">
            <span className="font-mono text-keyword"># </span>
            {category.name}
          </h1>
        </div>
      </div>

      <PostRows
        posts={posts}
        emptyMessage="이 카테고리에 발행된 글이 아직 없습니다"
      />
    </Shell>
  );
}
