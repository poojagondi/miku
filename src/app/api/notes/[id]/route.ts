import { NextRequest, NextResponse } from "next/server";
import { getNoteById, deleteNote, updateNote } from "@/services/notes-service";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idString } = await params;
  const session = await auth.api.getSession(request);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const id = parseInt(idString);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid note ID" },
        { status: 400 }
      );
    }

    const note = await getNoteById(id);

    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    // Check if the note belongs to the authenticated user
    if (note.createdBy !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idString } = await params;
  const session = await auth.api.getSession(request);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const id = parseInt(idString);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid note ID" },
        { status: 400 }
      );
    }

    // Check if the note exists and belongs to the authenticated user
    const note = await getNoteById(id);

    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    if (note.createdBy !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    await deleteNote(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete note" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idString } = await params;
  const session = await auth.api.getSession(request);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const id = parseInt(idString);
    const { title, content, editorState } = await request.json();

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid note ID" },
        { status: 400 }
      );
    }

    // Check if the note exists and belongs to the authenticated user
    const existingNote = await getNoteById(id);

    if (!existingNote) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    if (existingNote.createdBy !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const updatedNote = await updateNote(id, {
      title: title || "Untitled",
      content,
      editorState,
    });

    return NextResponse.json({
      success: true,
      data: updatedNote,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update note" },
      { status: 500 }
    );
  }
}
