'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { aiApi } from '@/lib/api/ai';
import { PostRecommendationResponse } from '@/types/ai';

interface RecommendedPostsProps {
  postId: number;
}

export default function RecommendedPosts({ postId }: RecommendedPostsProps) {
  const [recommendations, setRecommendations] = useState<PostRecommendationResponse[]>([]);

  useEffect(() => {
    aiApi.getRecommendations(postId).then(setRecommendations).catch(() => {});
  }, [postId]);

  if (recommendations.length === 0) return null;

  return (
    <section className="mt-16 rounded-2xl border border-border-primary bg-bg-secondary p-6">
      <h3 className="mb-5 text-lg font-bold text-text-primary">추천 게시글</h3>
      <ul className="space-y-4">
        {recommendations.map((rec) => (
          <li key={rec.id}>
            <Link
              href={`/posts/${rec.recommendedPostId}`}
              className="group block rounded-xl p-3 transition-colors hover:bg-bg-card-hover"
            >
              <p className="font-medium text-text-primary transition-colors group-hover:text-accent">
                {rec.recommendedPostTitle}
              </p>
              <p className="mt-1 text-sm text-text-tertiary">{rec.reason}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
