"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ParagraphNode, TextNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import Link from "next/link";

import { TooltipProvider } from "@/components/ui/tooltip";
import { MikuLoader } from "@/components/ui/miku-loader";
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { BlockFormatDropDown } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import { FormatParagraph } from "@/components/editor/plugins/toolbar/block-format/format-paragraph";
import { FormatHeading } from "@/components/editor/plugins/toolbar/block-format/format-heading";
import { FormatNumberedList } from "@/components/editor/plugins/toolbar/block-format/format-numbered-list";
import { FormatBulletedList } from "@/components/editor/plugins/toolbar/block-format/format-bulleted-list";
import { FormatCheckList } from "@/components/editor/plugins/toolbar/block-format/format-check-list";
import { FormatQuote } from "@/components/editor/plugins/toolbar/block-format/format-quote";
import { FontColorToolbarPlugin } from "@/components/editor/plugins/toolbar/font-color-toolbar-plugin";
import { FontBackgroundToolbarPlugin } from "@/components/editor/plugins/toolbar/font-background-toolbar-plugin";
import { FontFamilyToolbarPlugin } from "@/components/editor/plugins/toolbar/font-family-toolbar-plugin";
import { ClearFormattingToolbarPlugin } from "@/components/editor/plugins/toolbar/clear-formatting-toolbar-plugin";
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin";
import { AIChatPlugin } from "@/components/editor/plugins/toolbar/ai-chat-plugin";
import { editorTheme } from "@/components/editor/themes/editor-theme";
import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { DraggableBlockPlugin } from "@/components/editor/plugins/draggable-block-plugin";
import { InsertStickerToolbarPlugin } from "@/components/editor/plugins/toolbar/insert-sticker-toolbar-plugin";
import { ThemeToggleButton } from "@/components/editor/plugins/toolbar/theme-toggle-button";
import { ShimejiExtensionButton } from "@/components/editor/plugins/toolbar/shimeji-extension-button";
import { Button } from "@/components/ui/button";
import { $createParagraphNode as lexicalCreateParagraphNode } from "lexical";
import { $createTextNode as lexicalCreateTextNode } from "lexical";
import { StickerNode } from "@/components/editor/nodes/sticker-node";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes: [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    StickerNode,
  ],
  onError: (error: Error) => {
    console.error(error);
  },
};

export default function RichTextEditorDemo() {
  return (
    <div className="min-h-[100svh] bg-background">
      <LexicalComposer initialConfig={{ ...editorConfig }}>
        <TooltipProvider>
          <Suspense fallback={<div>Loading editor...</div>}>
            <Plugins />
          </Suspense>
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}

const placeholder = "Start writing...";

function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [editor] = useLexicalComposerContext();
  const [currentNoteId, setCurrentNoteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Load existing note if id parameter is present
  const loadNoteForEditing = useCallback(
    async (noteId: number) => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/notes/${noteId}`);
        const result = await response.json();

        if (result.success) {
          setCurrentNoteId(noteId);

          // Try to restore from saved editor state JSON first
          if (result.data.editorState) {
            try {
              const editorState = editor.parseEditorState(
                result.data.editorState
              );
              editor.setEditorState(editorState);
              return;
            } catch (error) {
              console.warn(
                "Failed to parse editor state, falling back to text content:",
                error
              );
            }
          }

          // Fallback to text content if no editor state or parsing failed
          if (result.data.content) {
            editor.update(() => {
              const root = $getRoot();
              root.clear();
              const textNode = $createTextNode(result.data.content);
              const paragraphNode = $createParagraphNode();
              paragraphNode.append(textNode);
              root.append(paragraphNode);
            });
          }
        }
      } catch (error) {
        console.error("Failed to load note for editing:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [editor]
  );

  // Load existing note if id parameter is present
  useEffect(() => {
    const noteId = searchParams.get("id");
    if (noteId) {
      loadNoteForEditing(Number(noteId));
    }
  }, [searchParams, loadNoteForEditing]);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      editor.update(() => {
        const editorState = editor.getEditorState();
        const jsonString = JSON.stringify(editorState.toJSON());
        const textContent = editorState.read(() => {
          const root = $getRoot();
          return root.getTextContent();
        });

        if (currentNoteId) {
          // Update existing note
          updateNote(currentNoteId, textContent, jsonString);
        } else {
          // Create new note
          saveToDatabase(textContent, jsonString);
        }
      });
    } catch (error) {
      console.error("Error during save:", error);
      setIsSaving(false);
    }
  };

  const updateNote = async (
    noteId: number,
    textContent: string,
    editorStateJson: string
  ) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: textContent,
          editorState: editorStateJson,
        }),
      });

      if (response.ok) {
        console.log("Note updated successfully");
        alert("Note updated successfully!");
        router.push("/dashboard");
      } else {
        console.error("Failed to update note");
        alert("Failed to update note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      alert("Error updating note");
    } finally {
      setIsSaving(false);
    }
  };

  const saveToDatabase = async (
    textContent: string,
    editorStateJson: string
  ) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Note from Editor",
          content: textContent,
          editorState: editorStateJson,
        }),
      });

      if (response.ok) {
        console.log("Note saved successfully");
        alert("Note saved successfully!");
        router.push("/dashboard");
      } else {
        console.error("Failed to save note");
        alert("Failed to save note");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Error saving note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewNote = () => {
    setCurrentNoteId(null);
    editor.update(() => {
      const root = $getRoot();
      root.clear();
    });

    const url = new URL(window.location.href);
    url.searchParams.delete("id");
    window.history.replaceState({}, "", url.pathname);
  };

  return (
    <div className="min-h-[100svh]">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-50">
          <MikuLoader size={48} text="Loading editor..." />
        </div>
      )}

      {/* toolbar plugins */}
      <ToolbarPlugin>
        {() => (
          <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
              <div className="flex gap-2 items-center justify-center">
                <ClearFormattingToolbarPlugin />
                <FontColorToolbarPlugin />
                <FontBackgroundToolbarPlugin />
                <BlockFormatDropDown>
                  <FormatParagraph />
                  <FormatHeading levels={["h1", "h2", "h3"]} />
                  <FormatNumberedList />
                  <FormatBulletedList />
                  <FormatCheckList />
                  <FormatQuote />
                </BlockFormatDropDown>
                <TabIndentationPlugin />
                <FontFamilyToolbarPlugin />
                <FontFormatToolbarPlugin format="bold" />
                <FontFormatToolbarPlugin format="italic" />
                <FontFormatToolbarPlugin format="underline" />
                <FontFormatToolbarPlugin format="strikethrough" />
                <AIChatPlugin />
                <InsertStickerToolbarPlugin />
                <ShimejiExtensionButton />
                <ThemeToggleButton />
              </div>
            </div>
          </div>
        )}
      </ToolbarPlugin>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <RichTextPlugin
          contentEditable={
            <div className="relative">
              <div className="" ref={onRef}>
                <ContentEditable
                  placeholder={placeholder}
                  className="ContentEditable__root relative block min-h-[calc(100svh-300px)] overflow-auto py-8 focus:outline-none text-base leading-relaxed"
                  placeholderClassName="text-muted-foreground pointer-events-none absolute top-8 left-8 overflow-hidden text-ellipsis select-none text-base"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
        <ListPlugin />
        <CheckListPlugin />

        <div className="sticky bottom-0 bg-background border-t mt-8 pt-4 pb-4">
          <div className="flex gap-3 justify-center items-center">
            <Button
              className="cursor-pointer"
              onClick={handleSave}
              size="lg"
              disabled={isSaving}
            >
              {isSaving ? (
                <MikuLoader size={16} text="" />
              ) : currentNoteId ? (
                "Update Note"
              ) : (
                "Save Note"
              )}
            </Button>

            {currentNoteId && (
              <Button
                className="cursor-pointer"
                variant="secondary"
                onClick={handleNewNote}
                size="lg"
                disabled={isSaving}
              >
                New Note
              </Button>
            )}

            <Link href="/dashboard">
              <Button variant="outline" size="lg" disabled={isSaving}>
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
function $createParagraphNode() {
  return lexicalCreateParagraphNode();
}
function $createTextNode(content: string) {
  return lexicalCreateTextNode(content);
}
