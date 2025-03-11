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

    const [userChats, applications] = await Promise.all([
      db.select().from(mayorChats).where(eq(mayorChats.twitter_id, twitter_id)),
      db
        .select()
        .from(citizenshipApplications)
        .where(eq(citizenshipApplications.twitter_id, twitter_id)),
    ]);

    if (!userChats?.length) {
      return NextResponse.json({ error: 'No chat history found for the user.' }, { status: 404 });
    }

    if (!applications?.length) {
      return NextResponse.json({ error: 'Citizenship application not found.' }, { status: 404 });
    }

    const application = applications?.[0];
    const currentStatus = application.status as 'pending' | 'approved' | 'rejected';

    // If already approved, return early
    if (currentStatus === 'approved') {
      return NextResponse.json({
        status: 'approved',
        status_remark: application.status_remark || 'Already approved.',
      });
    }

    // Process AI analysis and Twitter completeness check in parallel
    const [aiResponse, twitterCompleteness] = await Promise.all([
      analyzeAnswersWithAI(userChats?.[0]?.messages as { question: string; answer: string }[]),
      Promise.resolve(
        checkTwitterDataCompleteness({
          twitter_name: application.twitter_name,
          twitter_username: application.twitter_username,
          twitter_profile_picture: application.twitter_profile_picture,
        })
      ),
    ]);

    const evaluationResults = JSON.parse(aiResponse || '{}');
    const correctPercentage = evaluationResults?.score || 0;

    let status: 'pending' | 'approved' | 'rejected' = 'pending';
    let status_remark =
      evaluationResults?.remark || 'Incorrect answers or missing Twitter details.';

    if (correctPercentage >= 70 && twitterCompleteness >= 70) {
      status = 'approved';
    } else if (correctPercentage > 40 && twitterCompleteness > 40) {
      status = 'pending';
    } else {
      status = 'rejected';
    }

    // Update status if needed
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
