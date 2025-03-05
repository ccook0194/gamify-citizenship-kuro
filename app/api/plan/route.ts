import { NextRequest, NextResponse } from 'next/server';

if (!process.env.BACKEND_URL) {
  throw new Error('Backend URL is not defined!');
}

const apiUrl = process.env.BACKEND_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date } = body;

    const response = await fetch(apiUrl + 'plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ curr_date: date }),
    });

    const externalData = await response.json();
    
    return NextResponse.json({ success: externalData ? true : false });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.error();
  }
}
