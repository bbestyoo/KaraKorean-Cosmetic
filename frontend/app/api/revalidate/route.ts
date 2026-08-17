import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

interface RevalidateBody {
  tags?: string[];
  paths?: string[];
}

/**
 * On-demand revalidation endpoint.
 *
 * The Django backend calls this whenever a product (or a related model such as
 * category, brand, image, size, rating, etc.) changes so that ISR-cached pages
 * are invalidated immediately instead of waiting for the time-based revalidate window.
 *
 * Auth: the caller must send `X-Revalidate-Secret: <REVALIDATE_SECRET>`.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const provided =
    request.headers.get('x-revalidate-secret') ||
    (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');

  if (!secret || !provided || provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: RevalidateBody = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const tags = Array.isArray(body.tags) ? body.tags : [];
  const paths = Array.isArray(body.paths) ? body.paths : [];

  if (tags.length === 0 && paths.length === 0) {
    return NextResponse.json(
      { error: 'Provide at least one tag or path' },
      { status: 400 },
    );
  }

  // Invalidate fetch-level cache by tag (covers data fetches across pages)
  for (const tag of tags) {
    revalidateTag(tag, 'default');
  }

  // Invalidate route-level cache for each path.
  // For dynamic product pages, revalidatePath with type 'page' is what actually
  // clears the rendered HTML + layout so the next visitor gets a fresh render.
  for (const path of paths) {
    revalidatePath(path, 'page');
  }

  return NextResponse.json({
    revalidated: { tags, paths },
    now: Date.now(),
  });
}
