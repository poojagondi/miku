"use client";

import { useState } from "react";
import { useNotes } from "@/hooks/useNotes";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const { notes, loading } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<number | undefined>(
    undefined
  );

  // Debug: log notes when they change
  console.log("Frontend notes loaded:", notes.length, notes.slice(0, 2));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      setSending(true);
      const body: Record<string, unknown> = { message: trimmed };
      if (selectedNoteId !== undefined) body.noteId = selectedNoteId;

      console.log("Sending to chatbot:", body); // Debug log

      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data: { reply?: string } = await res.json();
      console.log("Chatbot response:", data); // Debug log
      const aiMessage: ChatMessage = {
        role: "assistant",
        content: data.reply ?? "",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      {/* Debug info - make it more visible */}
      <div
        style={{
          marginBottom: 12,
          padding: 8,
          backgroundColor: "#f0f0f0",
          borderRadius: 4,
          fontSize: 14,
          color: "#333",
          border: "1px solid #ddd",
        }}
      >
        📝 Loaded {notes.length} notes {loading ? "(loading...)" : ""}
        {notes.length > 0 && (
          <div style={{ fontSize: 12, marginTop: 4, color: "#666" }}>
            Latest: {notes[0]?.content?.toString().slice(0, 50)}...
          </div>
        )}
      </div>

      <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
        <label>
          Ask about:
          <select
            value={selectedNoteId ?? ""}
            onChange={(e) =>
              setSelectedNoteId(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            disabled={loading || sending}
            style={{ marginLeft: 8 }}
          >
            <option value="">All notes</option>
            {notes.map((n) => (
              <option key={n.id} value={n.id}>
                Note #{n.id}: {(n.content || "").slice(0, 40)}
                {n.content && n.content.length > 40 ? "…" : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minHeight: 300,
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: 8, marginTop: 12 }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          aria-label="Message"
          disabled={sending}
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={sending || !input.trim()}>
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
