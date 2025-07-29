import { db } from "@/db/db";
import { notes, type Note, type NewNote } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function createNote(
  note: Omit<NewNote, "id" | "createdAt" | "updatedAt">
): Promise<Note> {
  const result = await db
    .insert(notes)
    .values({
      ...note,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return result[0];
}

export async function getAllNotes(userId: string): Promise<Note[]> {
  return await db
    .select()
    .from(notes)
    .where(eq(notes.createdBy, userId))
    .orderBy(desc(notes.updatedAt));
}

export async function getNoteById(id: number): Promise<Note | undefined> {
  const result = await db.select().from(notes).where(eq(notes.id, id));
  return result[0];
}

export async function updateNote(
  id: number,
  updates: Partial<Omit<Note, "id" | "createdAt">>
): Promise<Note> {
  const result = await db
    .update(notes)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(notes.id, id))
    .returning();
  return result[0];
}

export async function deleteNote(id: number): Promise<void> {
  await db.delete(notes).where(eq(notes.id, id));
}
