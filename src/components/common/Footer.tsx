'use client';

import { useEffect, useState } from 'react';
import { visitorApi } from '@/lib/api/visitors';
import { VisitorStatsResponse } from '@/types/visitor';

export default function Footer() {
  const [stats, setStats] = useState<VisitorStatsResponse | null>(null);

  useEffect(() => {
    visitorApi.getStats().then(setStats).catch(() => {});
  }, []);

  return (
    <footer className="border-t border-border-primary bg-bg-primary">
      <div className="mx-auto max-w-[720px] px-5 py-10">
        <div className="mb-6">
          <p className="text-lg font-bold text-text-primary">AI Blog</p>
          <p className="mt-1 text-sm text-text-tertiary">AI 기술 블로그</p>
        </div>

        {stats && (
          <div className="mb-6 flex gap-6 text-sm text-text-tertiary">
            <span>전체 방문 {stats.totalCount.toLocaleString()}</span>
            <span>오늘 방문 {stats.todayCount.toLocaleString()}</span>
          </div>
        )}

        <div className="border-t border-border-secondary pt-6">
          <p className="text-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} AI Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
