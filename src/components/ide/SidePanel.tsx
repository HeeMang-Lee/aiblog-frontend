'use client';

import dynamic from 'next/dynamic';

/**
 * The preview and properties column.
 *
 * three.js is ~150KB and nothing above the fold needs it, so the scene loads
 * only in the browser. The panel is hidden below `lg` rather than stacked:
 * on a phone it would push the article a full screen down.
 */
const GlyphScene = dynamic(() => import('@/components/ide/GlyphScene'), {
  ssr: false,
  loading: () => null,
});

import VisitCounter from './VisitCounter';

export type PropertyRow = [label: string, value: string];

export default function SidePanel({
  properties,
  slug,
}: {
  properties: PropertyRow[];
  /** Present on a post page, so views are counted per slug. */
  slug?: string;
}) {
  return (
    <aside className="hidden w-[248px] shrink-0 overflow-y-auto border-l border-rule bg-panel lg:block">
      <p className="px-3 pt-3 font-mono text-[10px] tracking-[0.14em] text-meta">
        PREVIEW
      </p>
      <div className="m-3 h-[196px] overflow-hidden rounded-xs border border-rule bg-editor">
        <GlyphScene />
      </div>

      <p className="px-3 font-mono text-[10px] tracking-[0.14em] text-meta">
        PROPERTIES
      </p>
      <dl className="px-3 pb-4 pt-2">
        {properties.map(([label, value]) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-3 border-b border-rule py-1.5 last:border-b-0"
          >
            <dt className="font-mono text-[11px] text-meta">{label}</dt>
            <dd className="min-w-0 truncate text-right text-[12px] text-ink">
              {value}
            </dd>
          </div>
        ))}
        <VisitCounter slug={slug} />
      </dl>
    </aside>
  );
}
