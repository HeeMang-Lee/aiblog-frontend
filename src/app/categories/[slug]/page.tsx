import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategories, getPostsByCategorySlug } from '@/lib/notion';
import PostList from '@/components/blog/PostList';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

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
  if (!category) return { title: '카테고리를 찾을 수 없습니다' };

  return {
    title: category.name,
    description: `${category.name} 카테고리의 글 목록`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const { category, posts } = await getPostsByCategorySlug(slug);
  if (!category) notFound();

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header />
      <main className="mx-auto w-full max-w-[760px] flex-1 px-5 py-14 md:px-8">
        {/* One stacked block, not a headline with a floating explainer. */}
        <div className="mb-10">
          <h1 className="text-[22px] font-semibold leading-[1.3] tracking-[-0.02em] text-ink">
            {category.name}
          </h1>
          <p className="mt-3 font-mono tnum text-[11px] tracking-[0.08em] text-meta">
            글 {category.count}
          </p>
        </div>

        <PostList
          posts={posts}
          emptyMessage="이 카테고리에 발행된 글이 아직 없습니다."
        />
      </main>
      <Footer />
    </div>
  );
}
