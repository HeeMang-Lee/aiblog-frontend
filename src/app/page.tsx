import { getPublishedPosts, isNotionConfigured } from '@/lib/notion';
import PostList from '@/components/blog/PostList';
import FeaturedPost from '@/components/blog/FeaturedPost';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

/**
 * Notion serves uploaded files through signed URLs that expire in about an
 * hour, so pages are rebuilt well inside that window. Raising this saves
 * requests but starts shipping dead image links.
 */
export const revalidate = 900;

export default async function HomePage() {
  const posts = await getPublishedPosts();
  const [featuredPost, ...remainingPosts] = posts;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header />
      <main className="mx-auto w-full max-w-[760px] flex-1 px-5 py-14 md:px-8">
        {featuredPost && (
          <section className="mb-16">
            <FeaturedPost post={featuredPost} />
          </section>
        )}

        <section>
          <h2 className="mb-6 text-[11px] font-medium tracking-[0.02em] text-meta">
            {featuredPost ? '지난 글' : '글'}
          </h2>
          <PostList
            posts={remainingPosts}
            emptyMessage={
              isNotionConfigured
                ? '노션 데이터베이스에서 글의 상태를 발행으로 바꾸면 여기에 쌓입니다.'
                : 'NOTION_TOKEN과 NOTION_DATABASE_ID를 .env.local에 넣으면 노션에서 글을 읽어옵니다.'
            }
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
