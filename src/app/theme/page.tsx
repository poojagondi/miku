import React from "react";

export default function ThemePage() {
  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Theme Settings
        </h1>
        <div className="max-w-2xl mx-auto bg-card rounded-lg border p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Customize Your Experience
          </h2>
          <p className="text-muted-foreground mb-6">
            Choose your preferred theme and appearance settings for Miku Notes.
          </p>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Light Theme</h3>
              <p className="text-sm text-muted-foreground">
                Clean and bright interface
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Dark Theme</h3>
              <p className="text-sm text-muted-foreground">
                Easy on the eyes for night usage
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Miku Theme</h3>
              <p className="text-sm text-muted-foreground">
                Special theme inspired by Miku
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
