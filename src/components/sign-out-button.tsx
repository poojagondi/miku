"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MikuLoader } from "@/components/ui/miku-loader";

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
        <MikuLoader size={16} text="" />
      ) : (
        <span className="hidden sm:inline">Sign Out</span>
      )}
    </Button>
  );
}
// This button can be used in your dashboard or any authenticated page
