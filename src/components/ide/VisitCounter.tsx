'use client';

import { useEffect, useState } from 'react';

/**
 * Live visit counts for the properties panel.
 *
 * The page around it is static and revalidates every 15 minutes, so the number
 * is fetched by the browser instead of being baked in. A reload inside the same
 * session reads without incrementing, so refreshing does not inflate the count.
 *
 * Renders nothing at all when the counter is not configured, so the panel looks
 * finished either way.
 */
export default function VisitCounter({ slug }: { slug?: string }) {
  const [counts, setCounts] = useState<{
    total: number;
    today: number;
    views?: number;
  } | null>(null);

  useEffect(() => {
    const path = slug ? `/api/visit?slug=${encodeURIComponent(slug)}` : '/api/visit';
    const seenKey = `visited:${slug ?? 'home'}`;
    const alreadySeen = sessionStorage.getItem(seenKey) === '1';

    let cancelled = false;

    fetch(path, { method: alreadySeen ? 'GET' : 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data?.configured || data.error) return;
        if (!alreadySeen) sessionStorage.setItem(seenKey, '1');
        setCounts({ total: data.total, today: data.today, views: data.views });
      })
      .catch(() => {
        // A counter is not worth surfacing an error over.
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!counts) return null;

  const rows: [string, number][] = [
    ...(counts.views !== undefined
      ? ([['views', counts.views]] as [string, number][])
      : []),
    ['today', counts.today],
    ['total', counts.total],
  ];

  return (
    <>
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex items-baseline justify-between gap-3 border-b border-rule py-1.5 last:border-b-0"
        >
          <dt className="font-mono text-[11px] text-meta">{label}</dt>
          <dd className="font-mono tnum text-[12px] text-ink">
            {value.toLocaleString()}
          </dd>
        </div>
      ))}
    </>
  );
}
