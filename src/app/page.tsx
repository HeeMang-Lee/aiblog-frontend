import { ApiResponse } from '@/types/api';
import { PostResponse } from '@/types/post';
import { CategoryResponse } from '@/types/category';
import PostList from '@/components/blog/PostList';
import FeaturedPost from '@/components/blog/FeaturedPost';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getPosts(): Promise<PostResponse[]> {
  try {
    const res = await fetch(`${API_URL}/api/posts`, { cache: 'no-store' });
    const body: ApiResponse<PostResponse[]> = await res.json();
    return body.success ? body.data : [];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<CategoryResponse[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories`, { cache: 'no-store' });
    const body: ApiResponse<CategoryResponse[]> = await res.json();
    return body.success ? body.data : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    getPosts(),
    getCategories(),
  ]);

  const publishedPosts = posts.filter((p) => p.status === 'PUBLISHED');
  const featuredPost = publishedPosts[0];
  const remainingPosts = publishedPosts.slice(1);

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <Header />
      <main className="mx-auto w-full max-w-[720px] flex-1 px-5 py-10">
        {/* Featured post */}
        {featuredPost && (
          <section className="mb-16">
            <FeaturedPost post={featuredPost} />
          </section>
        )}

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <a
              href="/"
              className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white transition-colors"
            >
              전체
            </a>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="rounded-full border border-border-primary px-4 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent"
              >
                {cat.name}
              </a>
            ))}
          </div>
        )}

        {/* Article list */}
        <section>
          <h2 className="mb-8 text-xl font-bold text-text-primary">
            전체 아티클
          </h2>
          <PostList posts={remainingPosts.length > 0 ? remainingPosts : publishedPosts} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
