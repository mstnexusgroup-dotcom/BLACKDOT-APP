import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || 'Hello';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: lastMessage,
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { reply: 'Internal Server Error: Unable to reach Gemini.' },
      { status: 500 }
    );
  }
}