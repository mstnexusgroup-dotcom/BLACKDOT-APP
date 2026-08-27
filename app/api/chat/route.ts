import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const apikey = process.env.GROQ_API_KEY;

    if (!apikey) {
      return NextResponse.json(
        { reply: "Server configuration error: GROQ_API_KEY is missing." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apikey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error response:", data);
      return NextResponse.json({
        reply: `Groq API Error: ${data.error?.message || "Failed to reach Groq"}`,
      });
    }

    const reply = data.choices?.[0]?.message?.content || "No response received.";
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { reply: "Internal Server Error: Unable to process request." },
      { status: 500 }
    );
  }
}