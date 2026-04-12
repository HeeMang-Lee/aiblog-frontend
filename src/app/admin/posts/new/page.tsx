'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postApi } from '@/lib/api/posts';
import { PostCreateRequest } from '@/types/post';
import PostForm from '@/components/admin/PostForm';
import ErrorMessage from '@/components/common/ErrorMessage';

export default function NewPostPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (data: PostCreateRequest) => {
    setError('');
    setLoading(true);
    try {
      await postApi.create(data);
      router.push('/admin/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : '게시글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">새 게시글 작성</h1>
      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
      <PostForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
