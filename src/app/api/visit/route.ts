import { NextRequest, NextResponse } from 'next/server';
import { isVisitsConfigured, readVisits, recordVisit } from '@/lib/visits';

/** Counters must never be cached: a cached hit would freeze the number. */
export const dynamic = 'force-dynamic';

function slugFrom(request: NextRequest): string | undefined {
  const slug = request.nextUrl.searchParams.get('slug');
  if (!slug) return undefined;
  // The key is built from this value, so it is bounded and sanitised here
  // rather than trusted straight off the query string.
  return slug.slice(0, 200).replace(/[\s\r\n]/g, '');
}

/** Increments. Called once per session per path by the browser. */
export async function POST(request: NextRequest) {
  if (!isVisitsConfigured) {
    return NextResponse.json({ configured: false }, { status: 200 });
  }

  const counts = await recordVisit(slugFrom(request));
  if (!counts) {
    return NextResponse.json({ configured: true, error: true }, { status: 200 });
  }

  return NextResponse.json({ configured: true, ...counts });
}

/** Reads without incrementing, for a repeat view in the same session. */
export async function GET(request: NextRequest) {
  if (!isVisitsConfigured) {
    return NextResponse.json({ configured: false }, { status: 200 });
  }

  const counts = await readVisits(slugFrom(request));
  if (!counts) {
    return NextResponse.json({ configured: true, error: true }, { status: 200 });
  }

  return NextResponse.json({ configured: true, ...counts });
}
