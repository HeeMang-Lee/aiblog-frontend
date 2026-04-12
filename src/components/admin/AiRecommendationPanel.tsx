'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { aiApi } from '@/lib/api/ai';
import { PostRecommendationResponse } from '@/types/ai';

interface AiRecommendationPanelProps {
  postId: number;
}

export default function AiRecommendationPanel({ postId }: AiRecommendationPanelProps) {
  const [recommendations, setRecommendations] = useState<PostRecommendationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecommendations = () => {
    setLoading(true);
    aiApi
      .getRecommendations(postId)
      .then(setRecommendations)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecommendations();
  }, [postId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await aiApi.refreshRecommendation(postId);
      fetchRecommendations();
    } catch (err) {
      alert(err instanceof Error ? err.message : '추천 갱신에 실패했습니다.');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">AI 추천 게시글</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {refreshing ? '갱신 중...' : '추천 갱신'}
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">불러오는 중...</p>}

      {recommendations.length === 0 && !loading && (
        <p className="text-sm text-gray-500">추천 게시글이 없습니다. 추천 갱신을 실행해보세요.</p>
      )}

      <ul className="space-y-3">
        {recommendations.map((rec) => (
          <li
            key={rec.id}
            className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
          >
            <div>
              <Link
                href={`/admin/posts/${rec.recommendedPostId}/edit`}
                className="font-medium text-gray-900 hover:text-blue-600"
              >
                {rec.recommendedPostTitle}
              </Link>
              <p className="mt-1 text-sm text-gray-500">{rec.reason}</p>
            </div>
            <span className="shrink-0 text-sm text-gray-400">#{rec.displayOrder}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
