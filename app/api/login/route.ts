import { NextRequest, NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET || 'kurocatsol';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (password === 'kuro2025') {
      return NextResponse.json({ message: 'Success' });
    }
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }
}
