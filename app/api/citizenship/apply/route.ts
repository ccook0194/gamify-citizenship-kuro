import { NextResponse } from 'next/server';
import { citizenshipApplications } from '@/db/schema/citizenshipSchema';
import { sql } from 'drizzle-orm/sql';
import { db } from '@/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { twitter_id, twitter_name, ticket_number } = body;

    if (!twitter_id || !ticket_number) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const result = await db
      .insert(citizenshipApplications)
      .values({
        twitter_id,
        twitter_name,
        ticket_number,
        status: 'pending', // Default value
        created_at: sql`NOW()`,
        updated_at: sql`NOW()`,
      })
      .returning({ id: citizenshipApplications.id });

    return NextResponse.json(
      { message: 'Application submitted', id: result[0]?.id },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
  }
}
