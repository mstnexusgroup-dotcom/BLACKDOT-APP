import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const phase = formData.get("phase") as string; // "senior" or "fet"
    const subject = formData.get("subject") as string; 

    if (!file || !phase || !subject) {
      return NextResponse.json(
        { error: "Missing required upload fields." },
        { status: 400 }
      );
    }

    // Clean up subject name to match standard folder routing
    const sanitizedSubject = subject.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    // Path directory: public/papers/[seniorPhase|fetPhase]/[subject]/
    const targetDir = path.join(
      process.cwd(),
      "public",
      "papers",
      phase === "senior" ? "senior" : "fet",
      sanitizedSubject
    );

    // Make sure the target folders exist
    fs.mkdirSync(targetDir, { recursive: true });

    // Read the array buffer data and build a clean filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeFileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(targetDir, safeFileName);

    // Save file physically into your project's public folder
    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/papers/${phase === "senior" ? "senior" : "fet"}/${sanitizedSubject}/${safeFileName}`;

    return NextResponse.json({ 
      success: true, 
      url: relativeUrl 
    });
  } catch (error) {
    console.error("File write error:", error);
    return NextResponse.json(
      { error: "Internal server processing failure." },
      { status: 500 }
    );
  }
}