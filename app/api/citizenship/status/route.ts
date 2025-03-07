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

export async function POST(req: Request) {
  try {
    const { twitter_id, status } = await req.json();

    if (!twitter_id || !status) {
      return NextResponse.json({ error: 'Twitter ID and status are required' }, { status: 400 });
    }

    const existingUser = await db
      .select()
      .from(citizenshipApplications)
      .where(eq(citizenshipApplications.twitter_id, twitter_id));

    if (existingUser.length === 0) {
      return NextResponse.json({ error: "User doesn't exist" }, { status: 404 });
    }

    await db
      .update(citizenshipApplications)
      .set({ status })
      .where(eq(citizenshipApplications.twitter_id, twitter_id));

    const updatedUser = await db
      .select()
      .from(citizenshipApplications)
      .where(eq(citizenshipApplications.twitter_id, twitter_id));

    return NextResponse.json(updatedUser[0], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
  }
}
