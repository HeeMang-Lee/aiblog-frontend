'use client';

import { useState, useEffect } from 'react';
import { attachmentApi } from '@/lib/api/attachments';
import { AttachmentResponse, AttachmentCreateRequest } from '@/types/attachment';
import { formatDateTime } from '@/lib/utils/date';

interface AttachmentManagerProps {
  postId: number;
}

export default function AttachmentManager({ postId }: AttachmentManagerProps) {
  const [attachments, setAttachments] = useState<AttachmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [type, setType] = useState('IMAGE');
  const [url, setUrl] = useState('');
  const [originalFilename, setOriginalFilename] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [formLoading, setFormLoading] = useState(false);

  const fetchAttachments = () => {
    setLoading(true);
    attachmentApi
      .getList(postId)
      .then(setAttachments)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAttachments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    const data: AttachmentCreateRequest = {
      type,
      url,
      displayOrder,
      ...(originalFilename && { originalFilename }),
      ...(fileSize && { fileSize: Number(fileSize) }),
    };
    try {
      await attachmentApi.create(postId, data);
      setShowForm(false);
      setUrl('');
      setOriginalFilename('');
      setFileSize('');
      fetchAttachments();
    } catch (err) {
      alert(err instanceof Error ? err.message : '첨부파일 추가에 실패했습니다.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('첨부파일을 삭제하시겠습니까?')) return;
    try {
      await attachmentApi.delete(id);
      fetchAttachments();
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다.');
    }
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">첨부파일</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          {showForm ? '취소' : '추가'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">타입</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="IMAGE">IMAGE</option>
                <option value="DOCUMENT">DOCUMENT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">파일명</label>
              <input
                type="text"
                value={originalFilename}
                onChange={(e) => setOriginalFilename(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">정렬 순서</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={formLoading}
            className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {formLoading ? '추가 중...' : '추가'}
          </button>
        </form>
      )}

      {loading && <p className="text-sm text-gray-500">불러오는 중...</p>}

      {attachments.length === 0 && !loading && (
        <p className="text-sm text-gray-500">첨부파일이 없습니다.</p>
      )}

      <ul className="space-y-2">
        {attachments.map((att) => (
          <li
            key={att.id}
            className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
          >
            <div>
              <span className="mr-2 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-600">
                {att.type}
              </span>
              <a
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {att.originalFilename || att.url}
              </a>
              <span className="ml-2 text-xs text-gray-400">
                {formatDateTime(att.createdAt)}
              </span>
            </div>
            <button
              onClick={() => handleDelete(att.id)}
              className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
