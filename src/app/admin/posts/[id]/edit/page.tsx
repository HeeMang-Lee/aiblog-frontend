'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { postApi } from '@/lib/api/posts';
import { PostResponse, PostUpdateRequest } from '@/types/post';
import PostForm from '@/components/admin/PostForm';
import AiFeedbackPanel from '@/components/admin/AiFeedbackPanel';
import AiRecommendationPanel from '@/components/admin/AiRecommendationPanel';
import AttachmentManager from '@/components/admin/AttachmentManager';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Number(params.id);

  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    postApi
      .getById(postId)
      .then(setPost)
      .catch((err) =>
        setError(err instanceof Error ? err.message : '게시글을 불러올 수 없습니다.')
      )
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (data: PostUpdateRequest) => {
    setError('');
    setSaving(true);
    try {
      const updated = await postApi.update(postId, data);
      setPost(updated);
      alert('게시글이 수정되었습니다.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!confirm('게시글을 발행하시겠습니까?')) return;
    try {
      const updated = await postApi.publish(postId);
      setPost(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : '발행에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('게시글을 삭제하시겠습니까?')) return;
    try {
      await postApi.delete(postId);
      router.push('/admin/posts');
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error && !post) return <ErrorMessage message={error} />;
  if (!post) return null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">게시글 수정</h1>
        <div className="flex gap-2">
          {post.status === 'DRAFT' && (
            <button
              onClick={handlePublish}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              발행
            </button>
          )}
          <button
            onClick={handleDelete}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <span>상태:</span>
        <span
          className={`rounded px-2 py-0.5 text-xs font-medium ${
            post.status === 'PUBLISHED'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {post.status === 'PUBLISHED' ? '발행됨' : '초안'}
        </span>
        {post.publishedAt && <span>발행일: {post.publishedAt}</span>}
      </div>

      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

      <PostForm initialData={post} onSubmit={handleSubmit} loading={saving} />

      <div className="mt-8 space-y-8">
        <AttachmentManager postId={postId} />
        <AiFeedbackPanel postId={postId} />
        <AiRecommendationPanel postId={postId} />
      </div>
    </div>
  );
}
