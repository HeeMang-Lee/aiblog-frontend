import Link from 'next/link';
import { PostResponse } from '@/types/post';

interface FeaturedPostProps {
  post: PostResponse;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const excerpt = post.content
    .replace(/[#*`>\-\[\]()!|]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .substring(0, 200);

  return (
    <Link href={`/posts/${post.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl bg-bg-hero">
        {post.ogImage ? (
          <img
            src={post.ogImage}
            alt={post.title}
            className="aspect-[2/1] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex aspect-[2/1] w-full items-center justify-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-text-tertiary opacity-30">
              <rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8.5" cy="9.5" r="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 17l5-5 3 3 4-4 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
      <div className="mt-5">
        <h2 className="text-2xl font-bold leading-tight text-text-primary transition-colors group-hover:text-accent">
          {post.title}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-text-secondary line-clamp-2">
          {excerpt}
        </p>
      </div>
    </Link>
  );
}
