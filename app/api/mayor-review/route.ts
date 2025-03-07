import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { mayorChats } from '@/db/schema/mayorChatSchema';
import { analyzeAnswersWithAI } from './analyzeAnswersWithAI';
import { db } from '@/db';
import { citizenshipApplications } from '@/db/schema/citizenshipSchema';

function checkTwitterDataCompleteness(twitterData: any) {
  const completenessScore =
    (twitterData.twitter_name ? 30 : 0) +
    (twitterData.twitter_username ? 30 : 0) +
    (twitterData.twitter_profile_picture ? 40 : 0);

  return completenessScore;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const twitter_id = searchParams.get('twitter_id');
    if (!twitter_id) {
      return NextResponse.json({ error: 'Missing twitter_id.' }, { status: 400 });
    }

    // Fetch stored answers for the user
    const userChats = await db
      .select()
      .from(mayorChats)
      .where(eq(mayorChats.twitter_id, twitter_id));
    if (!userChats || userChats.length === 0) {
      return NextResponse.json({ error: 'No chat history found for the user.' }, { status: 404 });
    }
    const { messages } = userChats[0] as { messages: any[] };

    const aiResponse = await analyzeAnswersWithAI(messages);
    let evaluationResults = JSON.parse(aiResponse || '{}');
    const correctPercentage = evaluationResults?.score || 0;

    const result = await db
      .select()
      .from(citizenshipApplications)
      .where(eq(citizenshipApplications.twitter_id, twitter_id));

    // Evaluate Twitter data completeness
    const twitterCompleteness = checkTwitterDataCompleteness({
      twitter_name: result[0].twitter_name,
      twitter_username: result[0].twitter_username,
      twitter_profile_picture: result[0].twitter_profile_picture,
    });

    let status: 'pending' | 'approved' | 'rejected' = 'pending';
    let status_remark =
      evaluationResults?.remark || 'Incorrect answers or missing twitter details.';

    if (correctPercentage >= 70 && twitterCompleteness >= 70) {
      status = 'approved';
    } else if (correctPercentage > 40 && twitterCompleteness > 40) {
      status = 'pending';
    } else {
      status = 'rejected';
    }

    // Update user status in database
    await db
      .update(citizenshipApplications)
      .set({ status, status_remark })
      .where(eq(citizenshipApplications.twitter_id, twitter_id));

    return NextResponse.json({ status, status_remark });
  } catch (error) {
    console.error('Error evaluating user status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
