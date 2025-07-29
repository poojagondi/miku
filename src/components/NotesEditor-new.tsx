import { useNotes } from "@/hooks/useNotes";
import { useState } from "react";
import { MikuLoader } from "@/components/ui/miku-loader";

export function NotesEditor() {
  const { notes, loading, saveNote, editNote, removeNote } = useNotes();
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<number | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState("");

  // Helper function to extract title from content (first line)
  const extractTitleFromContent = (content: string): string => {
    const firstLine = content.split("\n")[0].trim();
    return firstLine || "Untitled";
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    const title = extractTitleFromContent(content);

    try {
      if (editingId) {
        await editNote(editingId, title, content);
        setEditingId(null);
      } else {
        await saveNote(title, content);
      }
      setContent("");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleEdit = (
    note: { content: string; id: number } | null | undefined
  ) => {
    if (note) {
      setContent(note.content);
      setEditingId(note.id);
    }
  };

  const handleCancel = () => {
    setContent("");
    setEditingId(null);
  };

  const handleTitleEdit = (note: { content: string; id: number }) => {
    setEditingTitleId(note.id);
    // Set the editing value to the current title (first line)
    const title = extractTitleFromContent(note.content);
    setEditingTitleValue(title === "Untitled" ? "" : title);
  };

  const handleTitleSave = async (noteId: number, originalContent: string) => {
    const newTitle = editingTitleValue.trim() || "Untitled";

    // Create new content with updated first line
    const contentLines = originalContent.split("\n");
    const restOfContent = contentLines.slice(1).join("\n");
    const newContent =
      newTitle === "Untitled" ? restOfContent : `${newTitle}\n${restOfContent}`;

    try {
      await editNote(noteId, newTitle, newContent.trim());
      setEditingTitleId(null);
      setEditingTitleValue("");
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  const handleTitleCancel = () => {
    setEditingTitleId(null);
    setEditingTitleValue("");
  };

  const handleTitleKeyPress = (
    e: React.KeyboardEvent,
    noteId: number,
    originalContent: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleTitleSave(noteId, originalContent);
    } else if (e.key === "Escape") {
      handleTitleCancel();
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-8">
        <MikuLoader size={64} text="Loading your notes..." />
      </div>
    );

  return (
    <div className="notes-editor">
      <div className="editor-form">
        {content && (
          <div className="title-preview">
            <small>Title preview: </small>
            <strong>{extractTitleFromContent(content)}</strong>
          </div>
        )}
        <textarea
          placeholder="Start typing your note... (First line will be the title)"
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
            {editingTitleId === note.id ? (
              <div className="title-edit">
                <input
                  type="text"
                  value={editingTitleValue}
                  onChange={(e) => setEditingTitleValue(e.target.value)}
                  onBlur={() => handleTitleSave(note.id, note.content)}
                  onKeyDown={(e) =>
                    handleTitleKeyPress(e, note.id, note.content)
                  }
                  autoFocus
                  className="title-input"
                />
                <div className="title-actions">
                  <button
                    onClick={() => handleTitleSave(note.id, note.content)}
                    className="save-btn"
                  >
                    ✓
                  </button>
                  <button onClick={handleTitleCancel} className="cancel-btn">
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <h4
                onClick={() =>
                  handleTitleEdit({
                    content: note.content,
                    id: note.id,
                  })
                }
                className={`editable-title ${extractTitleFromContent(note.content) === "Untitled" ? "untitled-note" : ""}`}
                title={
                  extractTitleFromContent(note.content) === "Untitled"
                    ? "Click to add a title"
                    : "Click to rename"
                }
              >
                {extractTitleFromContent(note.content)}
                {extractTitleFromContent(note.content) === "Untitled" && (
                  <span className="rename-hint"> (click to add title)</span>
                )}
              </h4>
            )}
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
