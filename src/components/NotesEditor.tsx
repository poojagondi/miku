import Image from "next/image";
import { useNotes } from "@/hooks/useNotes";
import { useState } from "react";

export function NotesEditor() {
  const { notes, loading, saveNote, editNote, removeNote } = useNotes();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      if (editingId) {
        await editNote(editingId, title, content);
        setEditingId(null);
      } else {
        await saveNote(title, content);
      }
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleEdit = (note: { title: string; content: string; id: number } | null | undefined) => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setEditingId(note.id);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <Image
            src="/mikuuu.png"
            alt="Miku"
            width={24}
            height={24}
            className="animate-pulse"
          />
          <span>...</span>
        </div>
      </div>
    );

  return (
    <div className="notes-editor">
      <div className="editor-form">
        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
        />
        <div className="buttons">
          <button onClick={handleSave}>
            {editingId ? "Update" : "Save"} Note
          </button>
          {editingId && <button onClick={handleCancel}>Cancel</button>}
        </div>
      </div>

      <div className="notes-list">
        <h3>Your Notes</h3>
        {notes.map((note) => (
          <div key={note.id} className="note-item">
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            <small>{new Date(note.createdAt).toLocaleDateString()}</small>
            <div className="note-actions">
              <button onClick={() => handleEdit(note)}>Edit</button>
              <button onClick={() => removeNote(note.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
