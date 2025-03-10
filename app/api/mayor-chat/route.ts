import { NextResponse } from 'next/server';
import { citizenshipApplications } from '@/db/schema/citizenshipSchema';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { mayorChats } from '@/db/schema/mayorChatSchema';

export async function GET(req: Request) {
  if (req.method !== 'GET') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const twitterId = searchParams.get('twitter_id');

    if (!twitterId) {
      return NextResponse.json({ error: 'Twitter ID is required' }, { status: 400 });
    }

    // Check if an application with the same twitter_id already exists
    const existingQuesAns = await db
      .select()
      .from(mayorChats)
      .where(eq(mayorChats.twitter_id, twitterId));

    if (existingQuesAns.length) {
      return NextResponse.json(
        { error: 'Chats already exists for this twitter_id' },
        { status: 409 }
      );
    }

    const chats = await db
      .select()
      .from(mayorChats)
      .where(eq(citizenshipApplications.twitter_id, twitterId));

    return NextResponse.json({ chats }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
