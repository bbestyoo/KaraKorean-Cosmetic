import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'account.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.stat(DATA_FILE);
  } catch (err) {
    await fs.writeFile(DATA_FILE, '{}', 'utf8');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, addresses } = body;
    await ensureDataFile();
    const data = { name, email, phone, addresses, updatedAt: new Date().toISOString() };
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
