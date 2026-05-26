import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;
    if (!newPassword || newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }
    // NOTE: In a real application you'd verify the current password and store a hashed password.
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
