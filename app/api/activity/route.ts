import { NextRequest, NextResponse } from 'next/server';

if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
  throw new Error('Backend URL is not defined!');
}

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, time } = body;

    const response = await fetch(apiUrl + 'logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        curr_date: date,
        specific_time: time
      }),
    });

    const externalData = await response.json();
    
    return NextResponse.json({ 
      success: externalData ? true : false,
      data: externalData
    });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.error();
  }
}
