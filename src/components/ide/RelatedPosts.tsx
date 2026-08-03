import Link from 'next/link';
import { Post } from '@/types/post';
import { formatDate, toISODate } from '@/lib/utils/date';

/**
 * Related posts, resolved on the server from shared tags and category so the
 * list renders with the page instead of popping in after hydration.
 */
export default function RelatedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-rule bg-panel px-4 py-5 md:px-6">
      <p className="font-mono text-[10px] tracking-[0.14em] text-meta">RELATED</p>
      <ul className="mt-3">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/posts/${encodeURIComponent(post.slug)}`}
              className="group flex gap-3 py-2"
            >
              <span className="select-none pt-0.5 font-mono text-[11px] text-gutter">
                ↳
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[14px] leading-[1.6] text-ink transition-colors group-hover:text-accent">
                  {post.title}
                </span>
                <span className="mt-0.5 flex gap-3 font-mono text-[11px] text-meta">
                  <time dateTime={toISODate(post.date)} className="tnum">
                    {formatDate(post.date)}
                  </time>
                  {post.category && (
                    <span className="text-string">{post.category}</span>
                  )}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
