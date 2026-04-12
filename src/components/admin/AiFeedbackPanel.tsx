'use client';

import { useState, useEffect } from 'react';
import { aiApi } from '@/lib/api/ai';
import { AiResultResponse } from '@/types/ai';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import { formatDateTime } from '@/lib/utils/date';

interface AiFeedbackPanelProps {
  postId: number;
}

export default function AiFeedbackPanel({ postId }: AiFeedbackPanelProps) {
  const [results, setResults] = useState<AiResultResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    setLoading(true);
    aiApi
      .getResults(postId, 'FEEDBACK')
      .then(setResults)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  const handleRequest = async () => {
    setRequesting(true);
    try {
      const result = await aiApi.requestFeedback(postId);
      setResults((prev) => [result, ...prev]);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'AI 피드백 요청에 실패했습니다.');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">AI 피드백</h2>
        <button
          onClick={handleRequest}
          disabled={requesting}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {requesting ? '요청 중...' : '피드백 요청'}
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">불러오는 중...</p>}

      {results.length === 0 && !loading && (
        <p className="text-sm text-gray-500">AI 피드백이 없습니다. 피드백을 요청해보세요.</p>
      )}

      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
              <span className="rounded bg-purple-100 px-1.5 py-0.5 font-medium text-purple-700">
                {result.provider}
              </span>
              <time>{formatDateTime(result.createdAt)}</time>
            </div>
            <MarkdownRenderer content={result.content} />
          </div>
        ))}
      </div>
    </section>
  );
}
