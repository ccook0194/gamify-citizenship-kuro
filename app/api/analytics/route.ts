import { NextRequest, NextResponse } from 'next/server';
import moment, { now } from 'moment';

if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
  throw new Error('Backend URL is not defined!');
}

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { start_time, end_time } = body;

    const response = await fetch(apiUrl + 'analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        start_time: start_time,
        end_time: end_time
      }),
    });

    const externalData = await response.json();
    console.log(externalData)

    return NextResponse.json({ 
      success: externalData ? true : false,
      data: externalData
    });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.error();
  }
}
