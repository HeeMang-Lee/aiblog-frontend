import Link from 'next/link';
import { Post } from '@/types/post';
import { formatDate, toISODate } from '@/lib/utils/date';

interface FeaturedPostProps {
  post: Post;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <Link
      href={`/posts/${encodeURIComponent(post.slug)}`}
      className="group block"
    >
      {/* The lead item puts its image above the text; list rows put theirs
          beside it. That difference is what marks this one as the lead. */}
      {post.cover && (
        <img
          src={post.cover}
          alt=""
          className="mb-6 aspect-[2/1] w-full rounded-xs border border-rule object-cover"
        />
      )}

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

      <h2 className="mt-2.5 text-[22px] font-semibold leading-[1.3] tracking-[-0.02em] text-ink transition-colors group-hover:text-accent">
        {post.title}
      </h2>

      {post.summary && (
        <p className="mt-3 line-clamp-2 max-w-[68ch] text-[15px] leading-[1.7] text-body">
          {post.summary}
        </p>
      )}
    </Link>
  );
}
