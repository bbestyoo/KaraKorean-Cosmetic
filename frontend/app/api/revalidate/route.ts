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
 * are invalidated immediately instead of waiting for the time-based revalidate.
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

  tags.forEach((tag) => revalidateTag(tag, 'max'));
  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({ revalidated: { tags, paths }, now: Date.now() });
}
