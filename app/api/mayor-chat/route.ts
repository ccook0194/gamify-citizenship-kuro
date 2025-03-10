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

    const chats = await db
      .select()
      .from(mayorChats)
      .where(eq(citizenshipApplications.twitter_id, twitterId));

    return NextResponse.json({ chats }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { twitter_id, messages } = await req.json(); // Expecting an array of { question, answer }

    if (!twitter_id || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    await db.insert(mayorChats).values({
      twitter_id,
      messages: JSON.stringify(messages),
      created_at: sql`NOW()`,
      updated_at: sql`NOW()`,
    });

    return NextResponse.json({ message: 'Chats saved successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
