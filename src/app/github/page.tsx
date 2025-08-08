import React from "react";
import Link from "next/link";

export default function GithubPage() {
  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          GitHub
        </h1>
        <div className="max-w-2xl mx-auto bg-card rounded-lg border p-6">
          <h2 className="text-2xl font-semibold mb-4">Open Source Project</h2>
          <p className="text-muted-foreground mb-6">
            Miku Notes is an open-source project. Check out our repository,
            contribute, or report issues on GitHub.
          </p>

          <div className="space-y-4">
            <Link
              href="https://github.com"
              target="_blank"
              className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <h3 className="font-medium mb-2">📚 Repository</h3>
              <p className="text-sm text-muted-foreground">
                View the source code and documentation
              </p>
            </Link>

            <Link
              href="https://github.com/issues"
              target="_blank"
              className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <h3 className="font-medium mb-2">🐛 Report Issues</h3>
              <p className="text-sm text-muted-foreground">
                Found a bug? Let us know!
              </p>
            </Link>

            <Link
              href="https://github.com/pulls"
              target="_blank"
              className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <h3 className="font-medium mb-2">🔀 Contribute</h3>
              <p className="text-sm text-muted-foreground">
                Submit pull requests and help improve the project
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
