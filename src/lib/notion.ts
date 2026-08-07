import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { Category, Post, PostStatus } from '@/types/post';

const NOTION_TOKEN = process.env.NOTION_TOKEN;

/**
 * Accepts either a bare id or a pasted Notion URL, in any of the shapes the
 * app and the browser produce:
 *
 *   1a2b3c4d5e6f7890abcdef1234567890
 *   1a2b3c4d-5e6f-7890-abcd-ef1234567890
 *   https://www.notion.so/workspace/1a2b3c4d...?v=9f8e...
 *   notion://www.notion.so/1a2b3c4d...
 *
 * A view id (`?v=`) is dropped: it points at a saved filter, not the database.
 */
export function extractNotionId(input: string | undefined): string | undefined {
  if (!input) return undefined;

  const withoutQuery = input.split('?')[0];
  const matches = withoutQuery.match(/[0-9a-f]{32}|[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}/gi);
  if (!matches?.length) return undefined;

  // The last 32-hex run in a Notion URL is the page itself; anything earlier is
  // the workspace slug's trailing id.
  return matches[matches.length - 1].replace(/-/g, '');
}

const NOTION_DATABASE_ID = extractNotionId(process.env.NOTION_DATABASE_ID);

/**
 * The site builds and runs without Notion credentials so the design can be
 * worked on offline. Every reader below returns empty rather than throwing.
 */
export const isNotionConfigured = Boolean(NOTION_TOKEN && NOTION_DATABASE_ID);

const notion = NOTION_TOKEN ? new Client({ auth: NOTION_TOKEN }) : null;

const n2m = notion
  ? new NotionToMarkdown({ notionClient: notion, config: { separateChildPage: false } })
  : null;

/**
 * Notion labels every uploaded image `image.png`, and that string ends up as
 * the alt text. A filename tells a screen reader nothing and tells a search
 * engine less, so the caption is used when there is one and the image is
 * marked decorative when there is not.
 *
 * 노션에서 이미지 아래에 캡션을 쓰면 그게 대체 텍스트가 된다. 캡션이 없으면
 * 빈 alt 로 두는 편이 낫다 - 파일명을 읽어 주는 것은 낭독기 사용자에게
 * 소음이고, 검색엔진에도 신호가 되지 않는다.
 */
n2m?.setCustomTransformer('image', async (block) => {
  const image = (block as { image?: {
    type?: string;
    external?: { url?: string };
    file?: { url?: string };
    caption?: { plain_text?: string }[];
  } }).image;
  if (!image) return false;

  const url = image.external?.url ?? image.file?.url;
  if (!url) return '';

  const caption = (image.caption ?? [])
    .map((c) => c.plain_text ?? '')
    .join('')
    .trim();

  return `![${caption}](${url})`;
});

/**
 * Notion API 2025-09-03 split databases into data sources, and SDK v5 dropped
 * `databases.query` entirely. A database id must be resolved to its first data
 * source id before it can be queried.
 */
let dataSourceIdPromise: Promise<string | null> | null = null;

function resolveDataSourceId(): Promise<string | null> {
  if (!notion || !NOTION_DATABASE_ID) return Promise.resolve(null);

  dataSourceIdPromise ??= notion.databases
    .retrieve({ database_id: NOTION_DATABASE_ID })
    .then((db) => {
      const sources = (db as { data_sources?: { id: string }[] }).data_sources;
      return sources?.[0]?.id ?? null;
    })
    .catch((error) => {
      console.error('[notion] 데이터 소스를 찾지 못했습니다.', error);
      // Do not memoize a failure: a transient outage would poison every later
      // request for the lifetime of the server process.
      dataSourceIdPromise = null;
      return null;
    });

  return dataSourceIdPromise;
}

/* -------------------------------------------------------------------------
   Property readers.

   Notion property names are whatever the user typed in their database, and
   this one is Korean. Rather than hard-coding a schema, each reader accepts a
   list of accepted names and matches case-insensitively. The title is found by
   type, since every Notion database has exactly one and its name varies most.
   ------------------------------------------------------------------------- */

type NotionPage = {
  id: string;
  created_time?: string;
  cover?: unknown;
  properties?: Record<string, { type?: string } & Record<string, unknown>>;
};

/**
 * Property names are typed by hand in Notion, so "주제 /카테고리" and
 * "주제/카테고리" are the same column to a human. Whitespace is stripped before
 * comparing so a stray space does not silently drop a field.
 */
const normalize = (name: string) => name.replace(/\s+/g, '').toLowerCase();

function findProperty(page: NotionPage, names: string[]) {
  const properties = page.properties ?? {};
  const wanted = names.map(normalize);
  for (const [key, value] of Object.entries(properties)) {
    if (wanted.includes(normalize(key))) return value;
  }
  return undefined;
}

function plainText(rich: unknown): string {
  if (!Array.isArray(rich)) return '';
  return rich
    .map((node) => (node as { plain_text?: string }).plain_text ?? '')
    .join('')
    .trim();
}

function readTitle(page: NotionPage): string {
  for (const value of Object.values(page.properties ?? {})) {
    if (value?.type === 'title') return plainText(value.title);
  }
  return '';
}

function readText(page: NotionPage, names: string[]): string {
  const prop = findProperty(page, names);
  if (!prop) return '';
  if (prop.type === 'rich_text') return plainText(prop.rich_text);
  if (prop.type === 'title') return plainText(prop.title);
  if (prop.type === 'url') return String(prop.url ?? '');
  return '';
}

function readSelect(page: NotionPage, names: string[]): string | null {
  const prop = findProperty(page, names);
  if (!prop) return null;
  // Notion has two single-choice property types and users pick either one.
  if (prop.type === 'select') return (prop.select as { name?: string })?.name ?? null;
  if (prop.type === 'status') return (prop.status as { name?: string })?.name ?? null;
  return null;
}

function readMultiSelect(page: NotionPage, names: string[]): string[] {
  const prop = findProperty(page, names);
  if (prop?.type !== 'multi_select') return [];
  const items = prop.multi_select as { name?: string }[] | undefined;
  return (items ?? []).map((item) => item.name ?? '').filter(Boolean);
}

function readDate(page: NotionPage, names: string[]): string | null {
  const prop = findProperty(page, names);
  if (prop?.type === 'date') {
    return (prop.date as { start?: string })?.start ?? null;
  }
  return null;
}

function readCover(page: NotionPage): string | null {
  const cover = page.cover as
    | { type?: string; external?: { url?: string }; file?: { url?: string } }
    | null
    | undefined;
  if (!cover) return null;
  return cover.external?.url ?? cover.file?.url ?? null;
}

/** Keeps Hangul intact so Korean titles produce readable URLs. */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Notion's Korean blog template labels its statuses with emoji ("게시됨 🚀"),
 * so the marker is stripped before comparing. Note that "출판 준비 완료" is
 * deliberately absent: ready-to-publish is not published.
 */
const PUBLISHED_VALUES = [
  'published',
  'publish',
  'live',
  '발행',
  '발행됨',
  '공개',
  '게시됨',
  '게시완료',
];

const stripDecoration = (value: string) =>
  value
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
    .replace(/\s+/g, '')
    .toLowerCase();

function readStatus(page: NotionPage): PostStatus {
  const raw = readSelect(page, ['Status', '상태']);
  if (!raw) return 'DRAFT';
  return PUBLISHED_VALUES.includes(stripDecoration(raw)) ? 'PUBLISHED' : 'DRAFT';
}

function toPost(page: NotionPage): Post {
  const title = readTitle(page) || '제목 없음';
  const explicitSlug = readText(page, ['Slug', '슬러그', 'Path']);
  const slug = explicitSlug || slugify(title) || page.id;

  return {
    id: page.id,
    slug,
    title,
    summary: readText(page, ['Summary', '요약', 'Description', '설명', 'Excerpt']),
    category: readSelect(page, [
      'Category',
      '카테고리',
      '분류',
      '주제/카테고리',
      '주제',
    ]),
    tags: readMultiSelect(page, ['Tags', '태그']),
    date:
      readDate(page, [
        'Date',
        '발행일',
        '날짜',
        '게시날짜',
        '게시일',
        'Published',
        'PublishedAt',
      ]) ??
      page.created_time ??
      new Date().toISOString(),
    cover: readCover(page),
    status: readStatus(page),
  };
}

/* ------------------------------------------------------------------------- */

/**
 * Fetches every row, then filters and sorts in memory.
 *
 * Server-side filters would need the exact property names, which vary per
 * database; a wrong name fails the whole query instead of degrading. A personal
 * blog is small enough that paging through it costs one request per 100 posts.
 */
export async function getAllPosts(): Promise<Post[]> {
  const dataSourceId = await resolveDataSourceId();
  if (!notion || !dataSourceId) return [];

  const pages: NotionPage[] = [];
  let cursor: string | undefined;

  try {
    do {
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        start_cursor: cursor,
        page_size: 100,
      });
      pages.push(...(response.results as NotionPage[]));
      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
    } while (cursor);
  } catch (error) {
    console.error('[notion] 글 목록을 불러오지 못했습니다.', error);
    return [];
  }

  return pages
    .map(toPost)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.status === 'PUBLISHED');
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPublishedPosts();
  const decoded = decodeURIComponent(slug);
  return posts.find((post) => post.slug === decoded) ?? null;
}

/* ------------------------------------------------------------------------- */

/**
 * The set of slugs that name a published post.
 *
 * The visit counter checks the slug it is handed against this before making a
 * key out of it. That check runs on a dynamic route, so the list is memoised
 * for the same window the pages use - otherwise every counted visit would page
 * through the whole database again.
 */
const SLUGS_TTL_MS = 15 * 60 * 1000;

let slugCache: { at: number; slugs: Set<string> } | null = null;

export async function getPublishedSlugs(): Promise<Set<string> | null> {
  const now = Date.now();
  if (slugCache && now - slugCache.at < SLUGS_TTL_MS) return slugCache.slugs;

  const posts = await getPublishedPosts();

  // 노션이 실패하면 getAllPosts 가 빈 배열을 돌려준다. 그걸 목록으로 굳히면
  // 멀쩡한 slug 까지 전부 막히므로, 캐시를 갱신하지 않고 지난 값을 그대로
  // 쓴다. 지난 값도 없으면 null 을 주고 호출한 쪽이 판단하게 둔다.
  if (posts.length === 0) return slugCache?.slugs ?? null;

  const slugs = new Set(posts.map((post) => post.slug));
  slugCache = { at: now, slugs };
  return slugs;
}

export async function getCategories(): Promise<Category[]> {
  const posts = await getPublishedPosts();
  const counts = new Map<string, number>();

  for (const post of posts) {
    if (!post.category) continue;
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
}

export async function getPostsByCategorySlug(categorySlug: string): Promise<{
  category: Category | null;
  posts: Post[];
}> {
  const [categories, posts] = await Promise.all([
    getCategories(),
    getPublishedPosts(),
  ]);
  const decoded = decodeURIComponent(categorySlug);
  const category = categories.find((c) => c.slug === decoded) ?? null;
  if (!category) return { category: null, posts: [] };

  return {
    category,
    posts: posts.filter((post) => post.category === category.name),
  };
}

/** Related posts by shared tags, then by same category. */
export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const posts = await getPublishedPosts();
  const others = posts.filter((p) => p.id !== post.id);

  const scored = others.map((candidate) => {
    const sharedTags = candidate.tags.filter((tag) => post.tags.includes(tag)).length;
    const sameCategory =
      candidate.category && candidate.category === post.category ? 1 : 0;
    return { candidate, score: sharedTags * 2 + sameCategory };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

/** Converts the page body to markdown so the site's own prose styles render it. */
export async function getPostMarkdown(pageId: string): Promise<string> {
  if (!n2m) return '';
  try {
    const blocks = await n2m.pageToMarkdown(pageId);
    return n2m.toMarkdownString(blocks).parent ?? '';
  } catch (error) {
    console.error('[notion] 본문을 불러오지 못했습니다.', error);
    return '';
  }
}
