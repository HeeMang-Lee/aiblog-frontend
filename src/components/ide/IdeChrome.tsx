'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { Category, Post } from '@/types/post';
import { useTheme } from '@/components/common/ThemeProvider';

/**
 * Title bar, explorer, and the row that holds the editor and side panel.
 *
 * Client-side because the explorer highlights the open file from the pathname
 * and because the drawer and theme toggle are interactive. The file list
 * itself is fetched on the server and passed in.
 */
export default function IdeChrome({
  posts,
  categories,
  tab,
  editor,
  panel,
}: {
  posts: Post[];
  categories: Category[];
  tab: string;
  /** Whatever the route renders, placed under the tab strip. */
  editor: React.ReactNode;
  panel: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Navigating on a phone should close the drawer, otherwise the article
  // opens behind a panel that is still covering it.
  useEffect(() => setDrawerOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Title bar */}
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-rule bg-panel px-3">
        <button
          type="button"
          onClick={() => setDrawerOpen((v) => !v)}
          className="text-meta transition-colors hover:text-ink md:hidden"
          aria-label={drawerOpen ? '탐색기 닫기' : '탐색기 열기'}
          aria-expanded={drawerOpen}
        >
          {drawerOpen ? (
            <X size={15} strokeWidth={1.5} />
          ) : (
            <Menu size={15} strokeWidth={1.5} />
          )}
        </button>

        <span className="hidden gap-1.5 md:flex" aria-hidden>
          <i className="block h-2.5 w-2.5 rounded-full bg-rule-strong" />
          <i className="block h-2.5 w-2.5 rounded-full bg-rule-strong" />
          <i className="block h-2.5 w-2.5 rounded-full bg-rule-strong" />
        </span>

        <p className="flex-1 truncate text-center text-[12px] text-meta">
          <Link href="/" className="transition-colors hover:text-ink">
            이희망 <span className="font-mono">- blog</span>
          </Link>
        </p>

        <button
          type="button"
          onClick={toggleTheme}
          className="text-meta transition-colors hover:text-accent"
          aria-label={theme === 'dark' ? '밝은 테마로 전환' : '어두운 테마로 전환'}
        >
          {theme === 'dark' ? (
            <Sun size={15} strokeWidth={1.5} />
          ) : (
            <Moon size={15} strokeWidth={1.5} />
          )}
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Explorer */}
        <aside
          className={`w-[220px] shrink-0 overflow-y-auto border-r border-rule bg-panel ${
            drawerOpen ? 'block' : 'hidden'
          } md:block`}
        >
          <p className="px-3 pt-3 font-mono text-[10px] tracking-[0.14em] text-meta">
            EXPLORER
          </p>

          <nav className="px-2 py-2">
            <p className="flex items-center gap-1.5 px-1.5 py-1 text-[12px] text-ink">
              <span className="font-mono text-meta">▾</span> posts
            </p>
            {posts.length === 0 && (
              <p className="px-1.5 py-1 pl-5 text-[12px] text-meta">비어 있음</p>
            )}
            {posts.map((post) => {
              const href = `/posts/${encodeURIComponent(post.slug)}`;
              return (
                <Link
                  key={post.id}
                  href={href}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className={`block truncate rounded-xs px-1.5 py-1 pl-5 text-[12px] transition-colors ${
                    isActive(href)
                      ? 'bg-accent-soft text-accent'
                      : 'text-meta hover:text-ink'
                  }`}
                >
                  {post.title}
                </Link>
              );
            })}

            <p className="mt-4 flex items-center gap-1.5 px-1.5 py-1 text-[12px] text-ink">
              <span className="font-mono text-meta">▾</span> categories
            </p>
            <Link
              href="/"
              aria-current={isActive('/') ? 'page' : undefined}
              className={`block truncate rounded-xs px-1.5 py-1 pl-5 text-[12px] transition-colors ${
                isActive('/') ? 'bg-accent-soft text-accent' : 'text-meta hover:text-ink'
              }`}
            >
              전체
            </Link>
            {categories.map((category) => {
              const href = `/categories/${encodeURIComponent(category.slug)}`;
              return (
                <Link
                  key={category.slug}
                  href={href}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className={`flex items-baseline justify-between gap-2 truncate rounded-xs px-1.5 py-1 pl-5 text-[12px] transition-colors ${
                    isActive(href)
                      ? 'bg-accent-soft text-accent'
                      : 'text-meta hover:text-ink'
                  }`}
                >
                  <span className="truncate">{category.name}</span>
                  <span className="font-mono tnum text-[11px] text-gutter">
                    {category.count}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Editor column: tab strip plus whatever the route renders */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 border-b border-rule bg-panel">
            <span className="truncate border-r border-rule bg-editor px-3 py-2 font-mono text-[11px] text-accent">
              {tab}
            </span>
          </div>
          {editor}
        </div>

        {panel}
      </div>
    </>
  );
}
