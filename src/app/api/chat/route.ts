// src/app/api/chat/route.ts

import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
export const runtime = 'edge';
 
export async function POST(req: Request) {
  const { messages } = await req.json();
 
  const response = await openai.chat.completions.create({
    model: 'gpt-5-nano',
    stream: true,
    messages,
  });
 
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}