"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes, $getSelection, $isRangeSelection } from "lexical";
import { Button } from "@/components/ui/button";
import { $createStickerNode } from "../../nodes/sticker-node";
import { StickerPicker } from "./sticker-picker";

export function InsertStickerToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const insertSticker = (sticker: {
    src: string;
    alt: string;
    name: string;
  }) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const stickerNode = $createStickerNode({
          src: sticker.src,
          altText: sticker.alt,
          width: 80,
          height: 80,
        });
        $insertNodes([stickerNode]);
      }
    });
  };

  return (
    <StickerPicker onStickerSelect={insertSticker}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-muted"
        title="Insert sticker"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      </Button>
    </StickerPicker>
  );
}
