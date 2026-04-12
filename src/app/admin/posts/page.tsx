'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { postApi } from '@/lib/api/posts';
import { PostResponse } from '@/types/post';
import PostTable from '@/components/admin/PostTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'DRAFT' | 'PUBLISHED'>('ALL');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postApi.getList();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '게시글 목록을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePublish = async (id: number) => {
    if (!confirm('게시글을 발행하시겠습니까?')) return;
    try {
      await postApi.publish(id);
      fetchPosts();
    } catch (err) {
      alert(err instanceof Error ? err.message : '발행에 실패했습니다.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('게시글을 삭제하시겠습니까?')) return;
    try {
      await postApi.delete(id);
      fetchPosts();
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다.');
    }
  };

  const filteredPosts =
    filter === 'ALL' ? posts : posts.filter((p) => p.status === filter);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">게시글 관리</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          새 게시글
        </Link>
      </div>

      <div className="mb-4 flex gap-2">
        {(['ALL', 'DRAFT', 'PUBLISHED'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1 text-sm font-medium ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'ALL' ? '전체' : f === 'DRAFT' ? '초안' : '발행됨'}
          </button>
        ))}
      </div>

      <PostTable
        posts={filteredPosts}
        onPublish={handlePublish}
        onDelete={handleDelete}
      />
    </div>
  );
}
