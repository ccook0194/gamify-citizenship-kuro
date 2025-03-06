import { NextResponse } from 'next/server';
import { citizenshipApplications } from '@/db/schema/citizenshipSchema';
import { eq } from 'drizzle-orm';
import { db } from '@/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const twitterId = searchParams.get('twitter_id');

    if (!twitterId) {
      return NextResponse.json({ error: 'Twitter Id is required' }, { status: 400 });
    }

    const result = await db
      .select()
      .from(citizenshipApplications)
      .where(eq(citizenshipApplications.twitter_id, twitterId));

    if (result.length === 0) {
      return NextResponse.json({ error: "User doesn't exist" }, { status: 404 });
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
  }
}
