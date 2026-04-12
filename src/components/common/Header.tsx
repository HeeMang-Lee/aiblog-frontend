'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { categoryApi } from '@/lib/api/categories';
import { CategoryResponse } from '@/types/category';
import { useTheme } from './ThemeProvider';

export default function Header() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    categoryApi.getList().then(setCategories).catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border-primary bg-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[720px] items-center justify-between px-5 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-text-primary">
          AI Blog
        </Link>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-secondary"
            aria-label="테마 전환"
          >
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {/* Hamburger menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-secondary"
            aria-label="메뉴"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border-primary bg-bg-primary">
          <nav className="mx-auto max-w-[720px] px-5 py-4">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-medium text-text-primary transition-colors hover:text-accent"
            >
              전체
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm font-medium text-text-secondary transition-colors hover:text-accent"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
