'use client';

import { useState, FormEvent, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PostCreateRequest, PostUpdateRequest, PostResponse } from '@/types/post';
import { CategoryResponse } from '@/types/category';
import { categoryApi } from '@/lib/api/categories';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface PostFormProps {
  initialData?: PostResponse;
  onSubmit: (data: PostCreateRequest | PostUpdateRequest) => Promise<void>;
  loading: boolean;
}

export default function PostForm({ initialData, onSubmit, loading }: PostFormProps) {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? 0);
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? '');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription ?? '');
  const [ogImage, setOgImage] = useState(initialData?.ogImage ?? '');
  const [showSeo, setShowSeo] = useState(false);

  useEffect(() => {
    categoryApi.getList().then(setCategories).catch(() => {});
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const base = { categoryId, title, content, slug };

    if (initialData) {
      const updateData: PostUpdateRequest = {
        ...base,
        ...(metaTitle && { metaTitle }),
        ...(metaDescription && { metaDescription }),
        ...(ogImage && { ogImage }),
      };
      onSubmit(updateData);
    } else {
      onSubmit(base);
    }
  };

  const generateSlug = () => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setSlug(slug);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">카테고리</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={0} disabled>카테고리 선택</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">슬러그</label>
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              maxLength={255}
              placeholder="post-slug"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={generateSlug}
              className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              자동생성
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          placeholder="게시글 제목"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div data-color-mode="light">
        <label className="mb-1 block text-sm font-medium text-gray-700">본문</label>
        <MDEditor
          value={content}
          onChange={(val) => setContent(val || '')}
          height={500}
          preview="live"
        />
      </div>

      {initialData && (
        <>
          <button
            type="button"
            onClick={() => setShowSeo(!showSeo)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {showSeo ? 'SEO 설정 닫기' : 'SEO 설정 열기'}
          </button>

          {showSeo && (
            <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">메타 제목</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  maxLength={100}
                  placeholder="SEO 제목 (비워두면 게시글 제목 사용)"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">메타 설명</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  maxLength={200}
                  rows={2}
                  placeholder="SEO 설명"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">OG 이미지 URL</label>
                <input
                  type="url"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  maxLength={500}
                  placeholder="https://example.com/og.jpg"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '저장 중...' : initialData ? '수정' : '작성'}
        </button>
      </div>
    </form>
  );
}
