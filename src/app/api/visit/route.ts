import { NextRequest, NextResponse } from 'next/server';
import { getPublishedSlugs } from '@/lib/notion';
import { allowRequest } from '@/lib/rate-limit';
import { isVisitsConfigured, readVisits, recordVisit } from '@/lib/visits';

/** Counters must never be cached: a cached hit would freeze the number. */
export const dynamic = 'force-dynamic';

/** Vercel puts the origin address first in this header. */
function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}

/**
 * The slug the caller asked for, but only when it names a published post.
 *
 * A key is built out of this value, so taking it on trust would let anyone
 * create rows in the store by inventing slugs. Anything unrecognised is
 * dropped rather than rejected: the visit still counts toward the site
 * totals, it just does not open a per-post key.
 *
 * 목록을 못 가져오면(노션 장애, 첫 요청) 조회수만 건너뛴다. 확인할 수 없는
 * 값으로 키를 만드는 것보다 세지 않는 쪽이 낫다.
 */
async function slugFrom(request: NextRequest): Promise<string | undefined> {
  const slug = request.nextUrl.searchParams.get('slug');
  if (!slug) return undefined;

  const published = await getPublishedSlugs();
  if (!published) return undefined;

  return published.has(slug) ? slug : undefined;
}

/** 카운터 하나 때문에 사용자에게 에러를 띄우지 않는다. 줄만 빠진다. */
const quiet = (status = 200) =>
  NextResponse.json({ configured: true, error: true }, { status });

/** Increments. Called once per session per path by the browser. */
export async function POST(request: NextRequest) {
  if (!isVisitsConfigured) {
    return NextResponse.json({ configured: false }, { status: 200 });
  }
  if (!allowRequest(clientKey(request))) return quiet(429);

  const counts = await recordVisit(await slugFrom(request));
  if (!counts) return quiet();

  return NextResponse.json({ configured: true, ...counts });
}

/** Reads without incrementing, for a repeat view in the same session. */
export async function GET(request: NextRequest) {
  if (!isVisitsConfigured) {
    return NextResponse.json({ configured: false }, { status: 200 });
  }
  if (!allowRequest(clientKey(request))) return quiet(429);

  const counts = await readVisits(await slugFrom(request));
  if (!counts) return quiet();

  return NextResponse.json({ configured: true, ...counts });
}
