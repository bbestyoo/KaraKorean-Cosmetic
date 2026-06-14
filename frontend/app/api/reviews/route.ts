import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'reviews.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.stat(DATA_FILE);
  } catch (err) {
    // create empty file
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

async function readReviews() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  try {
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

async function writeReviews(reviews: any[]) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(reviews, null, 2), 'utf8');
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const productId = url.searchParams.get('productId');

  const reviews = await readReviews();
  const approved = reviews.filter((r: any) => r.approved === true && (!productId || r.productId === productId));

  const rating_dict: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  approved.forEach((r: any) => {
    const v = Number(r.rating) || 0;
    if (v >= 1 && v <= 5) rating_dict[v] = (rating_dict[v] || 0) + 1;
  });

  const total = approved.length;
  const avg = total ? Number((approved.reduce((s: number, r: any) => s + (Number(r.rating) || 0), 0) / total).toFixed(1)) : 0;

  return NextResponse.json({ stats: { total_ratings: total, rating_dict, avg_rating: avg }, reviews: approved });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, rating, content, userName, userId } = body;
    if (!productId || !rating || !content) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const reviews = await readReviews();
    const review = {
      id: String(Date.now()),
      productId,
      rating: Number(rating),
      content,
      userName: userName || 'Anonymous',
      userId: userId || null,
      createdAt: new Date().toISOString(),
      approved: false,
    };

    // prepend
    reviews.unshift(review);
    await writeReviews(reviews);

    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}


export async function PATCH(request: Request) {
  try {
    const auth = request.headers.get('authorization') || '';
    const adminSecret = process.env.ADMIN_SECRET || 'admin';
    if (auth !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, id } = body as { action?: string; id?: string };
    if (action !== 'approve' || !id) {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }

    const reviews = await readReviews();
    const idx = reviews.findIndex((r: any) => r.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    reviews[idx].approved = true;
    await writeReviews(reviews);
    return NextResponse.json({ success: true, review: reviews[idx] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
