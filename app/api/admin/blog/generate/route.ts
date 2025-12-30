import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  const body = await req.json();

  const {
    title,
    summary,
    tags,
    tone = "authoritative, consumer-protection focused",
    length = "medium",
    outline,
  } = body || {};

  if (!title || typeof title !== "string") {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  const systemPrompt = `
You are a legal-content writing assistant for a consumer protection SaaS.
You write clear, accurate, non-alarmist blog posts about debt collection,
FDCPA rights, and stopping unwanted calls.

Rules:
- Do NOT give legal advice disclaimers.
- Do NOT mention being an AI.
- Write in clean HTML (p, h2, h3, ul, li, strong).
- No markdown.
- No emojis.
- Be precise and confident.
`.trim();

  const userPrompt = `
Write a blog post with the following parameters:

Title: ${title}
Summary (if provided): ${summary || "Generate one"}
Tags: ${(tags || []).join(", ") || "auto-generate"}
Tone: ${tone}
Length: ${length}
Outline: ${outline || "Decide the best structure"}

Output requirements:
1. Return valid JSON ONLY.
2. Fields:
   - content: full HTML body
   - summary: 1–2 sentence excerpt
   - tags: array of 3–7 relevant lowercase tags
3. No extra commentary.
`.trim();

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("Empty response from AI");
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON", raw },
        { status: 500 }
      );
    }

    return NextResponse.json({
      content: parsed.content || "",
      summary: parsed.summary || "",
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "AI generation failed" },
      { status: 500 }
    );
  }
}
