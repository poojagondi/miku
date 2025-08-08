import SignOutButton from "@/components/sign-out-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAllNotes } from "@/services/notes-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Dashboard() {
  const headersList = await headers();

  const serssion = await auth.api.getSession({ headers: headersList });

  if (!serssion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100svh] px-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-base text-muted-foreground">
          You must be signed in to view this page.
        </p>
      </div>
    );
  }

  const notes = await getAllNotes(serssion.user.id);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back, {serssion.user.name}!
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link href="/editor">
            <Button size="sm" className="w-full sm:w-auto">
              Create New Note
            </Button>
          </Link>
          <Link href="/mikuverse">
            <Button
              size="sm"
              variant="outline"
              className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white border-0"
            >
              Enter Mikuverse
            </Button>
          </Link>
          <Link
            href="https://www.youtube.com/@HatsuneMiku"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="sm"
              variant="outline"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0"
            >
              YouTube
            </Button>
          </Link>
          <SignOutButton />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Your Notes</h2>
        {notes.length === 0 ? (
          <div className="text-center py-10 sm:py-12 px-4">
            <p className="text-muted-foreground mb-2 sm:mb-4">
              You haven&apos;t created any notes yet.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Use the &quot;Create New Note&quot; button above to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {notes.map((note) => {
              const firstLine =
                note.content.split("\n")[0].trim() || "Untitled";
              const firstWord = firstLine.split(" ")[0] || "Untitled";
              const remainingContent = note.content
                .substring(firstLine.length)
                .trim();
              const previewContent = remainingContent || firstLine;

              return (
                <Link key={note.id} href={`/editor?id=${note.id}`}>
                  <Card className="cursor-pointer shadow-sm hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="truncate text-lg sm:text-xl font-bold">
                        {firstWord}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p
                        className="text-xs sm:text-sm text-muted-foreground overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {previewContent.substring(0, 150)}
                        {previewContent.length > 150 ? "..." : ""}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
