import { useState, useEffect } from "react";
import { Note } from "@/db/schema";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/notes");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotes(data.data);
        }
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async (title: string, content: string) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const newNote = data.data;
          setNotes((prev) => [newNote, ...prev]);
          return newNote;
        }
      }
      throw new Error("Failed to save note");
    } catch (error) {
      console.error("Failed to save note:", error);
      throw error;
    }
  };

  const editNote = async (id: number, title: string, content: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const updatedNote = data.data;
          setNotes((prev) =>
            prev.map((note) => (note.id === id ? updatedNote : note))
          );
          return updatedNote;
        }
      }
      throw new Error("Failed to update note");
    } catch (error) {
      console.error("Failed to update note:", error);
      throw error;
    }
  };

  const removeNote = async (id: number) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotes((prev) => prev.filter((note) => note.id !== id));
      } else {
        throw new Error("Failed to delete note");
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
      throw error;
    }
  };

  return {
    notes,
    loading,
    saveNote,
    editNote,
    removeNote,
    loadNotes,
  };
}
