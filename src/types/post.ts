export type PostStatus = 'PUBLISHED' | 'DRAFT';

/** A row of the Notion database, flattened into the shape the UI renders. */
export interface Post {
  /** Notion page id. Used to fetch the body. */
  id: string;
  /** URL segment. Falls back to a slugified title, then to the page id. */
  slug: string;
  title: string;
  summary: string;
  category: string | null;
  tags: string[];
  /** ISO date string. Falls back to the page's created time. */
  date: string;
  /** Notion-hosted cover URLs expire in about an hour. See lib/notion.ts. */
  cover: string | null;
  status: PostStatus;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}
