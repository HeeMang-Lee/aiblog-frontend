import Link from 'next/link';
import { Post } from '@/types/post';
import { formatDate, toISODate } from '@/lib/utils/date';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="border-t border-rule">
      <Link
        href={`/posts/${encodeURIComponent(post.slug)}`}
        className="group flex gap-6 py-7"
      >
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] tracking-[0.02em] text-meta">
            {post.category && <span>{post.category}</span>}
            {post.category && (
              <span aria-hidden className="text-rule-strong">
                ·
              </span>
            )}
            <time dateTime={toISODate(post.date)} className="font-mono tnum tracking-[0.08em]">
              {formatDate(post.date)}
            </time>
          </p>

          <h3 className="mt-2 text-[18px] font-semibold leading-[1.45] tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
            {post.title}
          </h3>

          {post.summary && (
            <p className="mt-2 line-clamp-2 text-[15px] leading-[1.7] text-body">
              {post.summary}
            </p>
          )}
        </div>

        {/* Rendered unoptimized on purpose: Notion cover URLs are signed and
            short-lived, so the Next image optimizer would cache a link that
            expires within the hour. */}
        {post.cover && (
          <img
            src={post.cover}
            alt=""
            className="h-[72px] w-28 shrink-0 rounded-xs border border-rule object-cover sm:h-[88px] sm:w-36"
          />
        )}
      </Link>
    </article>
  );
}
