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
    /* 화면을 꽉 채운다. 바깥 여백과 폭 상한을 두면 에디터가 떠 있는 창처럼
       보이고, 그만큼 본문 폭이 깎여서 읽는 자리가 좁아진다. */
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-bg md:h-[100dvh] md:min-h-0">
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
  );
}
