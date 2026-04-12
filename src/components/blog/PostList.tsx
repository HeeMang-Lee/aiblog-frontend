import { PostResponse } from '@/types/post';
import PostCard from './PostCard';

interface PostListProps {
  posts: PostResponse[];
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-text-tertiary">게시글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
