import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { getAllNotes } from "@/services/notes-service";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "X-Title": "Miku Note",
  },
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { message, messages = [], noteId } = body;

    // Get user's notes
    const allNotes = await getAllNotes(session.user.id);

    // Filter notes if specific noteId is provided
    const relevantNotes = noteId
      ? allNotes.filter((note) => note.id === noteId)
      : allNotes;

    // Prepare context from notes
    let notesContext = "";
    if (relevantNotes.length > 0) {
      notesContext = relevantNotes
        .map(
          (note) =>
            `Note #${note.id} (created: ${note.createdAt}):\n${note.content}`
        )
        .join("\n\n---\n\n");
    }

    // Prepare system message with context
    const systemMessage = {
      role: "system" as const,
      content: `You are Miku, a helpful AI assistant integrated into a note-taking app. You have access to the user's notes and can help them with questions about their content, summarization, analysis, or general assistance.

${notesContext ? `Here are the user's notes for context:\n\n${notesContext}` : "The user doesn't have any notes yet."}

Please be helpful, concise, and reference specific notes when relevant. If asked about notes that don't exist, politely let them know.

IMPORTANT: Do not use markdown formatting like **bold** or *italic* in your responses. Use plain text only since the interface doesn't render markdown. Instead of **text** just write text normally.`,
    };

    // Prepare messages array for OpenAI
    const openaiMessages = [
      systemMessage,
      ...messages, // Include chat history
    ];

    // Add the current message if provided
    if (message) {
      openaiMessages.push({
        role: "user" as const,
        content: message,
      });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-5-nano", // Changed to a more reliable model
      messages: openaiMessages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
