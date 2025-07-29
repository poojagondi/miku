import React from "react";
import Link from "next/link";

export default function DiscordPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Discord Community
        </h1>
        <div className="max-w-2xl mx-auto bg-card rounded-lg border p-6">
          <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-6">
            Connect with other Miku Notes users, get help, share tips, and stay
            updated with the latest features and announcements.
          </p>

          <div className="space-y-4">
            <Link
              href="https://discord.gg"
              target="_blank"
              className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <h3 className="font-medium mb-2">💬 General Chat</h3>
              <p className="text-sm text-muted-foreground">
                Chat with the community and share your notes
              </p>
            </Link>

            <Link
              href="https://discord.gg/support"
              target="_blank"
              className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <h3 className="font-medium mb-2">🆘 Get Help</h3>
              <p className="text-sm text-muted-foreground">
                Need assistance? Our community is here to help
              </p>
            </Link>

            <Link
              href="https://discord.gg/announcements"
              target="_blank"
              className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <h3 className="font-medium mb-2">📢 Announcements</h3>
              <p className="text-sm text-muted-foreground">
                Stay updated with new features and updates
              </p>
            </Link>

            <Link
              href="https://discord.gg/feedback"
              target="_blank"
              className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <h3 className="font-medium mb-2">💡 Feature Requests</h3>
              <p className="text-sm text-muted-foreground">
                Suggest new features and improvements
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
