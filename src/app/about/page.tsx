import React from "react";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          About Miku Notes
        </h1>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Miku Notes is designed to provide a beautiful, intuitive, and
              powerful note-taking experience. Inspired by the creativity and
              energy of Hatsune Miku, we aim to help users capture their
              thoughts, ideas, and creativity in a delightful way.
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">✨ Rich Text Editor</h3>
                <p className="text-sm text-muted-foreground">
                  Powerful Lexical-based editor with support for various content
                  types
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">🎨 Custom Stickers</h3>
                <p className="text-sm text-muted-foreground">
                  Add personality to your notes with resizable stickers and
                  emojis
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">☁️ Cloud Sync</h3>
                <p className="text-sm text-muted-foreground">
                  Your notes are automatically saved and synced across devices
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">🌙 Dark Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Beautiful themes including dark mode for comfortable writing
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Technology</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Built with modern web technologies for the best user experience:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                • <strong>Next.js 15</strong> - React framework for production
              </li>
              <li>
                • <strong>Lexical Editor</strong> - Extensible text editor
                framework
              </li>
              <li>
                • <strong>TypeScript</strong> - Type-safe development
              </li>
              <li>
                • <strong>Tailwind CSS</strong> - Utility-first styling
              </li>
              <li>
                • <strong>PostgreSQL</strong> - Reliable database storage
              </li>
              <li>
                • <strong>Drizzle ORM</strong> - Type-safe database operations
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
