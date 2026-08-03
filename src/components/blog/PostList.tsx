import { Post } from '@/types/post';
import PostCard from './PostCard';

interface PostListProps {
  posts: Post[];
  /** Second line of the empty state. Says what fills the space. */
  emptyMessage?: string;
}

export default function PostList({ posts, emptyMessage }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="border-t border-rule py-16">
        <p className="text-[15px] text-body">아직 발행한 글이 없습니다.</p>
        <p className="mt-1.5 text-[13px] text-meta">
          {emptyMessage ?? '노션 데이터베이스에서 글의 상태를 발행으로 바꾸면 여기에 쌓입니다.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
