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
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg">You must be signed in to view this page.</p>
      </div>
    );
  }

  const notes = await getAllNotes(serssion.user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Welcome back, {serssion.user.name}!
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/editor">
            <Button>Create New Note</Button>
          </Link>
          <Link href="/mikuverse">
            <Button
              variant="outline"
              className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white border-0"
            >
              Enter Mikuverse
            </Button>
          </Link>
          <SignOutButton />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Your Notes</h2>
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              You haven&apos;t created any notes yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Use the &quot;Create New Note&quot; button above to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <CardTitle className="truncate text-xl font-bold">
                        {firstWord}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p
                        className="text-sm text-muted-foreground overflow-hidden"
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
