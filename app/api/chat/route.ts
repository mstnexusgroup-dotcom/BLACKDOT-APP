import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const apikey = process.env.GROQ_API_KEY; 

    // Using an active model available on the Developer plan
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        reply: `Groq API Error: ${data.error?.message || "Failed to reach Groq"}`,
      });
    }

    const reply = data.choices?.[0]?.message?.content || "No response received.";

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { reply: "Internal Server Error: Unable to process request." },
      { status: 500 }
    );
  }
}