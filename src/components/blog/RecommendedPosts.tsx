import Link from 'next/link';
import { Post } from '@/types/post';
import { formatDate, toISODate } from '@/lib/utils/date';

interface RecommendedPostsProps {
  posts: Post[];
}

/**
 * Related posts are resolved on the server from shared tags and category, so
 * the list renders with the page instead of popping in after hydration.
 */
export default function RecommendedPosts({ posts }: RecommendedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="text-[11px] font-medium tracking-[0.02em] text-meta">
        이어서 읽을 글
      </h2>
      <ul className="mt-4">
        {posts.map((post) => (
          <li key={post.id} className="border-t border-rule">
            <Link
              href={`/posts/${encodeURIComponent(post.slug)}`}
              className="group block py-5"
            >
              <p className="text-[15px] font-semibold leading-[1.5] tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
                {post.title}
              </p>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 text-[11px] tracking-[0.02em] text-meta">
                {post.category && <span>{post.category}</span>}
                {post.category && (
                  <span aria-hidden className="text-rule-strong">
                    ·
                  </span>
                )}
                <time
                  dateTime={toISODate(post.date)}
                  className="font-mono tnum tracking-[0.08em]"
                >
                  {formatDate(post.date)}
                </time>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
