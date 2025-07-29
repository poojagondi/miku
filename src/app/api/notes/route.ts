import { NextRequest, NextResponse } from "next/server";
import { createNote, getAllNotes } from "@/services/notes-service";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession(request);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { content, title, editorState } = await request.json();
    const note = await createNote({
      title: title || "Untitled",
      content,
      editorState,
      createdBy: session.user.id,
    });
    return NextResponse.json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save note",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession(request);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const notes = await getAllNotes(session.user.id);
    return NextResponse.json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch notes",
      },
      { status: 500 }
    );
  }
}
