import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { questionsPrompt, validateResponsePrompt } from './prompt';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const sessions = new Map<string, { questions: string[]; responses: string[] }>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, userResponse } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!sessions.has(userId)) {
      sessions.set(userId, {
        questions: [],
        responses: [],
      });
    }

    const session = sessions.get(userId)!;

    // If first question has never been asked, start from the first one
    if (session.questions.length === 0) {
      const firstQuestion =
        "Welcome to Kuro Town! I'm the Mayor. Before we get started, I'd love to learn more about you! Are you already registered with us?";
      session.questions.push(firstQuestion);
      // return NextResponse.json({ question: firstQuestion });
    }

    // Get the last asked question
    const lastQuestion = session.questions[session.questions.length - 1];

    // Validate user response if provided
    if (userResponse) {
      const validation = await validateResponse(lastQuestion, userResponse);

      if (!validation.isRelevant) {
        return NextResponse.json({
          message: validation.feedback,
          retry: true,
        });
      }

      session.responses.push(userResponse);
    }

    // Generate next question dynamically based on previous responses
    const nextQuestion = await generateQuestion(session.questions);
    session.questions.push(nextQuestion);

    return NextResponse.json({ question: nextQuestion });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}

async function generateQuestion(previousQuestions: string[]) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: questionsPrompt + '\nPrevious questions:\n' + previousQuestions.join('\n'),
        },
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    return (
      response.choices[0]?.message?.content?.trim() || 'What makes you excited about Kuro Town?'
    );
  } catch (error) {
    console.error('Error generating question:', error);
    return 'What makes you excited about Kuro Town?';
  }
}

async function validateResponse(question: string, response: string) {
  try {
    const prompt = `${validateResponsePrompt}
      Question: "${question}"
      Response: "${response}"
    `;

    const validation = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: prompt }],
      max_tokens: 400,
      temperature: 0.5,
    });

    const content = validation.choices[0]?.message?.content;
    return content ? JSON.parse(content) : { isRelevant: true };
  } catch (error) {
    console.error('Error validating response:', error);
    return { isRelevant: true };
  }
}
