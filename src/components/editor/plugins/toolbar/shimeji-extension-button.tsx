"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function ShimejiExtensionButton() {
  const handleClick = () => {
    window.open(
      "https://shimejis.xyz/directory/vocaloid-shimeji-pack",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      title="Open Shimeji Extension - Get desktop pets for your browser"
      className="h-8 flex items-center gap-1.5 text-sm"
    >
      <ExternalLink className="size-3" />
      Shimeji Extension
    </Button>
  );
}
