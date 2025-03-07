import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { questionsPrompt } from './prompt';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const sessions: Record<string, { questions: string[]; responses: string[] }> = {};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, userResponse } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!sessions[userId]) {
      sessions[userId] = {
        questions: [],
        responses: [],
      };
    }

    const session = sessions[userId];

    // If first question has never been asked, start from the first one
    if (session.questions.length === 0) {
      const firstQuestion =
        "Welcome to Kuro Town! I'm the Mayor. Before we get started, I'd love to learn more about you! Are you already registered with us?";
      session.questions.push(firstQuestion);
    }

    // Get the last asked question
    const lastQuestion = session.questions[session.questions.length - 1];

    // Validate user response if provided
    if (userResponse) {
      session.responses.push(userResponse);
      const validation = await validateResponse(lastQuestion, userResponse);

      if (!validation.isRelevant) {
        return NextResponse.json({
          message: validation.feedback,
          retry: true,
        });
      }
    }

    // Generate next question dynamically based on previous responses
    const nextQuestion = await generateQuestion(session.responses);
    session.questions.push(nextQuestion);

    return NextResponse.json({ question: nextQuestion });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}

async function generateQuestion(previousResponses: string[]) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: questionsPrompt + 'Here are the previous questions: ' + previousResponses,
      },
    ],
    max_tokens: 400,
  });

  const choice = response?.choices?.[0];
  if (choice.message && choice.message.content) {
    return choice.message.content.trim();
  } else {
    return 'What makes you excited about Kuro?';
  }
}

async function validateResponse(question: string, response: string) {
  const prompt = `
    Here is the question: **"${question}"**  
    Here is the response: **"${response}"**  
  `;

  const validation = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: prompt }],
    max_tokens: 400,
    temperature: 0.5,
  });

  try {
    return JSON.parse(validation.choices[0].message?.content || '{}');
  } catch {
    return { isRelevant: true };
  }
}
