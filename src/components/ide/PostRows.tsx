import Link from 'next/link';
import { Post } from '@/types/post';
import { formatDate, toISODate } from '@/lib/utils/date';

/**
 * The post listing, set as numbered lines.
 *
 * The gutter carries the editor language; the row itself is set for reading,
 * not as markdown source. Rendering raw syntax here would look clever for a
 * second and slow every scan after that.
 */
export default function PostRows({
  posts,
  emptyMessage,
}: {
  posts: Post[];
  emptyMessage: string;
}) {
  if (posts.length === 0) {
    return (
      <div className="flex gap-4 px-4 py-6 md:px-6">
        <span className="w-6 shrink-0 select-none text-right font-mono text-[11px] text-gutter">
          1
        </span>
        <p className="text-[14px] text-meta">
          <span className="font-mono">{'// '}</span>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <ul className="py-2">
      {posts.map((post, i) => (
        <li key={post.id}>
          <Link
            href={`/posts/${encodeURIComponent(post.slug)}`}
            className="group flex gap-4 px-4 py-3 transition-colors hover:bg-accent-soft md:px-6"
          >
            <span className="w-6 shrink-0 select-none pt-1 text-right font-mono tnum text-[11px] text-gutter">
              {i + 1}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-semibold leading-[1.5] tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
                {post.title}
              </span>

              {post.summary && (
                <span className="mt-1 block max-w-[68ch] text-[14px] leading-[1.7] text-body">
                  {post.summary}
                </span>
              )}

              <span className="mt-1.5 flex flex-wrap items-center gap-x-3 font-mono text-[11px] text-meta">
                <time dateTime={toISODate(post.date)} className="tnum">
                  {formatDate(post.date)}
                </time>
                {post.category && (
                  <span className="text-string">{post.category}</span>
                )}
                {post.tags.map((tag) => (
                  <span key={tag} className="text-gutter">
                    #{tag}
                  </span>
                ))}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
