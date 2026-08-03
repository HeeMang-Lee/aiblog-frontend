'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { Category } from '@/types/post';
import { useTheme } from './ThemeProvider';

export default function HeaderNav({ categories }: { categories: Category[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const links = [
    { href: '/', label: '전체' },
    ...categories.map((category) => ({
      href: `/categories/${encodeURIComponent(category.slug)}`,
      label: category.name,
    })),
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper">
      <div className="mx-auto flex h-16 max-w-[760px] items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-[-0.01em] text-ink"
        >
          이희망
        </Link>

        {/* Categories sit in the bar on desktop: hiding them behind a hamburger
            on a wide screen buries the only navigation this site has. */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`border-b-2 py-1 text-[13px] transition-colors ${
                isActive(link.href)
                  ? 'border-accent text-ink'
                  : 'border-transparent text-meta hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-meta transition-colors hover:text-ink"
            aria-label={
              theme === 'light' ? '어두운 테마로 전환' : '밝은 테마로 전환'
            }
          >
            {theme === 'light' ? (
              <Moon size={17} strokeWidth={1.5} />
            ) : (
              <Sun size={17} strokeWidth={1.5} />
            )}
          </button>

          {categories.length > 0 && (
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 text-meta transition-colors hover:text-ink md:hidden"
              aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X size={18} strokeWidth={1.5} />
              ) : (
                <Menu size={18} strokeWidth={1.5} />
              )}
            </button>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-rule bg-paper md:hidden">
          <nav className="mx-auto flex max-w-[760px] flex-col px-5 py-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-rule py-3 text-[15px] text-body last:border-b-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
