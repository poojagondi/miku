"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutButton() {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      toast.success("Signed out successfully");
      router.push("/home");
    } catch (error) {
      setLoading(false);
      toast.error("Failed to sign out");
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <Button variant="outline" className="w-min" onClick={handleSignOut}>
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <span className="hidden sm:inline">Sign Out</span>
      )}
    </Button>
  );
}
// This button can be used in your dashboard or any authenticated page
