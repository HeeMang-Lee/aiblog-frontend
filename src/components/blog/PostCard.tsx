import Link from 'next/link';
import { PostResponse } from '@/types/post';
import { formatDate } from '@/lib/utils/date';

interface PostCardProps {
  post: PostResponse;
}

export default function PostCard({ post }: PostCardProps) {
  const excerpt = post.content
    .replace(/[#*`>\-\[\]()!|]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .substring(0, 150);

  return (
    <article>
      <Link href={`/posts/${post.id}`} className="group block">
        {/* Thumbnail */}
        {post.ogImage && (
          <div className="mb-4 overflow-hidden rounded-xl bg-bg-hero">
            <img
              src={post.ogImage}
              alt={post.title}
              className="aspect-[2/1] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        )}

        {/* Meta */}
        <div className="mb-2 flex items-center gap-3">
          <span className="text-sm font-medium text-accent">
            {post.categoryName}
          </span>
          {post.status === 'DRAFT' && (
            <span className="rounded-full bg-bg-tag px-2 py-0.5 text-xs font-medium text-amber-600">
              초안
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold leading-snug text-text-primary transition-colors group-hover:text-accent">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-2">
          {excerpt}
        </p>

        {/* Date & Views */}
        <div className="mt-3 flex items-center gap-3 text-xs text-text-tertiary">
          <time>{formatDate(post.createdAt)}</time>
          <span>조회 {post.viewCount}</span>
        </div>
      </Link>
    </article>
  );
}
