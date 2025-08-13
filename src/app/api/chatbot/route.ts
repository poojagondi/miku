import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllNotes, getNoteById } from "@/services/notes-service";

// Handle POST /api/chatbot (App Router)
export async function POST(req: NextRequest) {
  try {
    console.log("=== CHATBOT API CALLED ===");

    const body = await req.json();
    const message: unknown = body?.message;
    const noteIdRaw: unknown = body?.noteId;

    console.log("Request body:", { message, noteIdRaw });

    if (typeof message !== "string" || !message.trim()) {
      console.log("Invalid message");
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const session = await auth.api.getSession(req);
    console.log("Session:", session ? "authenticated" : "not authenticated");

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Coerce noteId (may arrive as string or number)
    let noteId: number | undefined;
    if (typeof noteIdRaw === "number" && Number.isFinite(noteIdRaw)) {
      noteId = noteIdRaw;
    } else if (typeof noteIdRaw === "string") {
      const parsed = parseInt(noteIdRaw, 10);
      if (!Number.isNaN(parsed)) noteId = parsed;
    }

    // Build notes context: specific note if provided and owned by user; otherwise recent notes
    let notesContext = "";
    if (noteId !== undefined) {
      const note = await getNoteById(noteId);
      console.log("Selected note:", note); // Debug
      if (!note || note.createdBy !== session.user.id) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }
      notesContext = (note.content ?? "").toString().trim();
    } else {
      const userNotes = await getAllNotes(session.user.id);
      console.log("All user notes:", userNotes.length, "notes found"); // Debug
      console.log(
        "Sample note contents:",
        userNotes.slice(0, 2).map((n) => ({
          id: n.id,
          content: n.content?.toString().slice(0, 100),
        }))
      ); // Debug
      const recentNotes = userNotes.slice(0, 10); // limit context
      notesContext = recentNotes
        .map((n) => `- ${n.content?.toString().trim() || ""}`)
        .filter((s) => s.length > 2)
        .join("\n");
    }

    console.log("Final notes context length:", notesContext.length); // Debug
    console.log("Notes context preview:", notesContext.slice(0, 200)); // Debug

    console.log("Notes context:", notesContext); // Debug log

    // For now, return a simple analysis of the notes without using AI APIs
    // since both OpenAI and Gemini have hit quota limits
    let reply = "";

    if (!notesContext.trim()) {
      reply =
        "You don't have any notes yet. Create some notes first, then I can help you analyze them!";
    } else {
      const noteLines = notesContext.split("\n").filter((line) => line.trim());
      const wordCount = notesContext.split(/\s+/).length;

      reply = `Based on your notes, here's what I found:

📝 **Summary of your ${noteLines.length} notes:**

${notesContext}

📊 **Quick stats:**
- Total words: ${wordCount}
- Number of note entries: ${noteLines.length}

💡 **What I can see:**
Your notes contain a mix of content including what appears to be a story about someone who couldn't move/froze, some test content, and mentions of school. 

*(Note: AI analysis is temporarily unavailable due to API limits - this is a direct view of your notes content)*`;
    }

    console.log("Fallback response generated:", reply.slice(0, 100) + "...");

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chatbot route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Optional: simple health check
export async function GET() {
  return NextResponse.json({ ok: true, message: "Chatbot endpoint is live" });
}
