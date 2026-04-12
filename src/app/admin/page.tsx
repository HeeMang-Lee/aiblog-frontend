'use client';

import { useEffect, useState } from 'react';
import { visitorApi } from '@/lib/api/visitors';
import { postApi } from '@/lib/api/posts';
import { categoryApi } from '@/lib/api/categories';
import { VisitorStatsResponse } from '@/types/visitor';
import { PostResponse } from '@/types/post';
import { CategoryResponse } from '@/types/category';

export default function AdminDashboard() {
  const [stats, setStats] = useState<VisitorStatsResponse | null>(null);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    visitorApi.getStats().then(setStats).catch(() => {});
    postApi.getList().then(setPosts).catch(() => {});
    categoryApi.getList().then(setCategories).catch(() => {});
  }, []);

  const publishedCount = posts.filter((p) => p.status === 'PUBLISHED').length;
  const draftCount = posts.filter((p) => p.status === 'DRAFT').length;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">대시보드</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="전체 방문자"
          value={stats?.totalCount.toLocaleString() ?? '-'}
        />
        <StatCard
          label="오늘 방문자"
          value={stats?.todayCount.toLocaleString() ?? '-'}
          highlight
        />
        <StatCard
          label="발행 게시글"
          value={String(publishedCount)}
        />
        <StatCard
          label="초안 게시글"
          value={String(draftCount)}
        />
        <StatCard
          label="카테고리"
          value={String(categories.length)}
        />
        <StatCard
          label="전체 게시글"
          value={String(posts.length)}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${highlight ? 'text-blue-600' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}
