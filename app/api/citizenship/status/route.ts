import { NextResponse } from 'next/server';
import { citizenshipApplications } from '@/db/schema/citizenshipSchema';
import { eq } from 'drizzle-orm';
import { db } from '@/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const result = await db
      .select()
      .from(citizenshipApplications)
      .where(eq(citizenshipApplications.id, userId));

    if (result.length === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
  }
}
