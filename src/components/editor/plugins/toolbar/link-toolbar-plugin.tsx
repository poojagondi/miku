import { useCallback, useEffect, useState } from "react";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isRangeSelection,
  BaseSelection,
  COMMAND_PRIORITY_NORMAL,
  KEY_MODIFIER_COMMAND,
  LexicalNode,
  RangeSelection,
} from "lexical";
import { LinkIcon } from "lucide-react";

import { useFloatingLinkContext } from "@/components/editor/context/floating-link-context";
import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar";
import { getSelectedNode } from "@/components/editor/utils/get-selected-node";
import { sanitizeUrl } from "@/components/editor/utils/url";
import { Toggle } from "@/components/ui/toggle";

export function LinkToolbarPlugin() {
  const { activeEditor } = useToolbarContext();
  const { setIsLinkEditMode } = useFloatingLinkContext();
  const [isLink, setIsLink] = useState(false);

  const $updateToolbar = (selection: RangeSelection | BaseSelection | null) => {
    console.log("Selection update:", selection);
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      console.log("Selected node:", node);
      let current: LexicalNode | null = node;
      while (current !== null) {
        console.log(
          "Checking node:",
          current,
          "$isLinkNode:",
          $isLinkNode(current)
        );
        if ($isLinkNode(current)) {
          setIsLink(true);
          return;
        }
        current = current.getParent();
      }
      setIsLink(false);
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  useEffect(() => {
    console.log("isLink state changed:", isLink);
  }, [isLink]);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === "KeyK" && (ctrlKey || metaKey)) {
          event.preventDefault();
          let url: string | null;

          if (!isLink) {
            setIsLinkEditMode(true);
            url = sanitizeUrl("https://");
          } else {
            setIsLinkEditMode(false);
            url = null;
          }
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [activeEditor, isLink, setIsLinkEditMode]);

  const insertLink = useCallback(() => {
    console.log("Insert link clicked. Current isLink state:", isLink);
    if (!isLink) {
      setIsLinkEditMode(true);
      activeEditor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl("https://")
      );
    } else {
      setIsLinkEditMode(false);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
    console.log("Link action completed");
  }, [activeEditor, isLink, setIsLinkEditMode]);

  return (
    <Toggle
      variant={"outline"}
      size="sm"
      className="!h-8 !w-8"
      aria-label="Toggle link"
      onClick={insertLink}
    >
      <LinkIcon className="h-4 w-4" />
    </Toggle>
  );
}
