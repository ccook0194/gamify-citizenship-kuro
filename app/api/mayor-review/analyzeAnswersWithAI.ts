import { OpenAI } from 'openai';
import { evaluationPrompt } from './prompt';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeAnswersWithAI(messages: { question: string; answer: string }[]) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: evaluationPrompt + messages }],
    max_tokens: 400,
  });

  return response.choices[0]?.message?.content || '';
}
