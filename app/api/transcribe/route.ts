import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3", // High-accuracy voice model
    });

    return new Response(JSON.stringify({ text: transcription.text }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Transcription failed" }), { status: 500 });
  }
}