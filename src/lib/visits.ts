import { Redis } from '@upstash/redis';

/**
 * Visit counters, kept in Upstash Redis.
 *
 * Pages are statically generated and revalidate every 15 minutes, so they
 * cannot count their own traffic and cannot render a fresh number. Counting
 * and reading both happen in a route handler that the browser calls on mount.
 *
 * Without credentials every function returns null and the UI drops the rows,
 * so the site runs unchanged with no counter configured.
 */

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const isVisitsConfigured = Boolean(url && token);

const redis = isVisitsConfigured ? new Redis({ url: url!, token: token! }) : null;

const TOTAL_KEY = 'visits:total';
/** Daily keys expire on their own so the store never accumulates dead rows. */
const DAY_TTL_SECONDS = 60 * 60 * 24 * 3;

/** The blog is written from Korea, so "today" is a KST day, not a UTC one. */
function seoulDateKey(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export interface VisitCounts {
  total: number;
  today: number;
  /** Views of one post, when a slug was given. */
  views?: number;
}

/** Increments the counters and returns the values after the increment. */
export async function recordVisit(slug?: string): Promise<VisitCounts | null> {
  if (!redis) return null;

  const dayKey = `visits:day:${seoulDateKey()}`;

  try {
    const pipeline = redis.pipeline();
    pipeline.incr(TOTAL_KEY);
    pipeline.incr(dayKey);
    pipeline.expire(dayKey, DAY_TTL_SECONDS);
    if (slug) pipeline.incr(`views:post:${slug}`);

    const results = (await pipeline.exec()) as number[];
    return {
      total: Number(results[0]) || 0,
      today: Number(results[1]) || 0,
      views: slug ? Number(results[3]) || 0 : undefined,
    };
  } catch (error) {
    console.error('[visits] 카운터를 올리지 못했습니다.', error);
    return null;
  }
}

/** Reads the counters without incrementing. */
export async function readVisits(slug?: string): Promise<VisitCounts | null> {
  if (!redis) return null;

  try {
    const keys = [TOTAL_KEY, `visits:day:${seoulDateKey()}`];
    if (slug) keys.push(`views:post:${slug}`);

    const values = await redis.mget<(number | null)[]>(...keys);
    return {
      total: Number(values[0]) || 0,
      today: Number(values[1]) || 0,
      views: slug ? Number(values[2]) || 0 : undefined,
    };
  } catch (error) {
    console.error('[visits] 카운터를 읽지 못했습니다.', error);
    return null;
  }
}
