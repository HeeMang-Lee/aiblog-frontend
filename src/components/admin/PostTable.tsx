'use client';

import Link from 'next/link';
import { PostResponse } from '@/types/post';
import { formatDateTime } from '@/lib/utils/date';

interface PostTableProps {
  posts: PostResponse[];
  onPublish: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function PostTable({ posts, onPublish, onDelete }: PostTableProps) {
  if (posts.length === 0) {
    return <p className="py-8 text-center text-gray-500">게시글이 없습니다.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-700">ID</th>
            <th className="px-4 py-3 font-medium text-gray-700">제목</th>
            <th className="px-4 py-3 font-medium text-gray-700">카테고리</th>
            <th className="px-4 py-3 font-medium text-gray-700">상태</th>
            <th className="px-4 py-3 font-medium text-gray-700">조회수</th>
            <th className="px-4 py-3 font-medium text-gray-700">작성일</th>
            <th className="px-4 py-3 font-medium text-gray-700">관리</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-gray-100 last:border-b-0">
              <td className="px-4 py-3 text-gray-500">{post.id}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="font-medium text-gray-900 hover:text-blue-600"
                >
                  {post.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-600">{post.categoryName}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                    post.status === 'PUBLISHED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {post.status === 'PUBLISHED' ? '발행됨' : '초안'}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{post.viewCount}</td>
              <td className="px-4 py-3 text-gray-500">{formatDateTime(post.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {post.status === 'DRAFT' && (
                    <button
                      onClick={() => onPublish(post.id)}
                      className="rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100"
                    >
                      발행
                    </button>
                  )}
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  >
                    수정
                  </Link>
                  <button
                    onClick={() => onDelete(post.id)}
                    className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
