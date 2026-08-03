import { getCategories, getPublishedPosts } from '@/lib/notion';
import IdeChrome from './IdeChrome';
import SidePanel, { type PropertyRow } from './SidePanel';

/**
 * The editor frame every page sits inside.
 *
 * Server component so the explorer's file list is fetched once per route
 * instead of by each page. The interactive parts (active file, theme, the
 * mobile drawer) live in IdeChrome.
 */
export default async function Shell({
  tab,
  properties,
  command,
  result,
  slug,
  children,
}: {
  /** Filename shown in the tab strip. */
  tab: string;
  properties: PropertyRow[];
  /** Command echoed in the terminal bar. */
  command: string;
  result: React.ReactNode;
  /** Set on a post page so views are counted per slug. */
  slug?: string;
  children: React.ReactNode;
}) {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
  ]);

  return (
    <div className="min-h-[100dvh] bg-bg p-0 md:p-6">
      <div className="mx-auto flex min-h-[100dvh] max-w-[1240px] flex-col overflow-hidden border-rule md:h-[calc(100dvh-48px)] md:min-h-0 md:rounded-xs md:border">
        <IdeChrome
          posts={posts}
          categories={categories}
          tab={tab}
          editor={
            <main className="min-w-0 flex-1 overflow-y-auto bg-editor">
              {children}
            </main>
          }
          panel={<SidePanel properties={properties} slug={slug} />}
        />

        {/* Terminal bar */}
        <div className="border-t border-rule bg-panel px-4 py-2.5">
          <p className="font-mono text-[11px] leading-[1.6] text-meta">
            <span className="text-accent">$</span> {command}
          </p>
          <p className="mt-0.5 font-mono text-[11px] leading-[1.6] text-meta">
            {result}
          </p>
        </div>
      </div>
    </div>
  );
}
