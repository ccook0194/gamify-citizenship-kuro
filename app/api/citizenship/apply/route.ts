import { NextResponse } from 'next/server';
import { citizenshipApplications } from '@/db/schema/citizenshipSchema';
import { eq, sql } from 'drizzle-orm/sql';
import { db } from '@/db';
import { generateRandomTicketNumber } from '@/utils/randomTicketNumber';
import { mayorChats } from '@/db/schema/mayorChatSchema';

async function generateUniqueTicketNumber(): Promise<string> {
  let ticketNumber: string = '';
  let exists = true;

  while (exists) {
    ticketNumber = generateRandomTicketNumber();

    const existing = await db
      .select()
      .from(citizenshipApplications)
      .where(eq(citizenshipApplications.ticket_number, ticketNumber));

    exists = !!existing?.length;
  }

  return ticketNumber;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      twitter_id,
      twitter_name,
      twitter_profile_picture,
      twitter_username,
      status,
      status_remark,
      messages,
    } = body;

    // check if twitter_id is required
    if (!twitter_id) {
      return NextResponse.json({ error: 'twitter_id is required' }, { status: 400 });
    }

    // check if messages are required
    if (!messages?.length) {
      return NextResponse.json({ error: 'messages are required' }, { status: 400 });
    }

    // Check if an application with the same twitter_id already exists
    const existingApplication = await db
      .select()
      .from(citizenshipApplications)
      .where(eq(citizenshipApplications.twitter_id, twitter_id));

    // if application already exists, return error
    if (existingApplication.length) {
      return NextResponse.json(
        { error: 'Application already exists for this twitter_id' },
        { status: 409 }
      );
    }

    // randomly generated unique ticket number
    const ticketNumber = await generateUniqueTicketNumber();

    // insert application
    const result = await db
      .insert(citizenshipApplications)
      .values({
        twitter_id,
        twitter_name,
        ticket_number: ticketNumber,
        twitter_profile_picture,
        twitter_username,
        status,
        status_remark,
        created_at: sql`NOW()`,
        updated_at: sql`NOW()`,
      })
      .returning({ id: citizenshipApplications.id });

    // insert chats
    await db.insert(mayorChats).values({
      twitter_id,
      messages: JSON.stringify(messages),
      created_at: sql`NOW()`,
      updated_at: sql`NOW()`,
    });

    // return response
    return NextResponse.json(
      { message: 'Application submitted', id: result[0]?.id, twitter_id: twitter_id },
      { status: 201 }
    );
  } catch (error: any) {
    // return error
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
  }
}
