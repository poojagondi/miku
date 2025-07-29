"use client";

import { DecoratorNode, NodeKey } from "lexical";
import React, { ReactNode, useState, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";

export interface StickerPayload {
  src: string;
  altText?: string;
  width?: number;
  height?: number;
  key?: NodeKey;
}

export interface SerializedStickerNode {
  src: string;
  altText: string;
  width: number;
  height: number;
  type: "sticker";
  version: 1;
}

export class StickerNode extends DecoratorNode<ReactNode> {
  __src: string;
  __altText: string;
  __width: number;
  __height: number;

  static getType(): string {
    return "sticker";
  }

  static clone(node: StickerNode): StickerNode {
    return new StickerNode(
      {
        src: node.__src,
        altText: node.__altText,
        width: node.__width,
        height: node.__height,
      },
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedStickerNode): StickerNode {
    const { src, altText, width, height } = serializedNode;
    return new StickerNode({
      src,
      altText,
      width,
      height,
    });
  }

  exportJSON(): SerializedStickerNode {
    return {
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
      type: "sticker",
      version: 1,
    };
  }

  constructor(
    payload: StickerPayload = { src: "", altText: "", width: 80, height: 80 },
    key?: NodeKey
  ) {
    super(key);
    this.__src = payload.src;
    this.__altText = payload.altText || "";
    this.__width = payload.width || 80;
    this.__height = payload.height || 80;
  }

  createDOM(): HTMLElement {
    const span = document.createElement("span");
    span.style.display = "inline-block";
    span.style.position = "relative";
    span.style.userSelect = "none";
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactNode {
    return <StickerComponent node={this} />;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  setAltText(altText: string): void {
    const writable = this.getWritable();
    writable.__altText = altText;
  }

  getWidth(): number {
    return this.__width;
  }

  setWidth(width: number): void {
    const writable = this.getWritable();
    writable.__width = width;
  }

  getHeight(): number {
    return this.__height;
  }

  setHeight(height: number): void {
    const writable = this.getWritable();
    writable.__height = height;
  }
}

// Resizable Sticker Component
function StickerComponent({ node }: { node: StickerNode }) {
  const [editor] = useLexicalComposerContext();
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(node.getWidth());
  const [height, setHeight] = useState(node.getHeight());
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: width,
      height: height,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;

    const newWidth = Math.max(
      50,
      Math.min(500, startPos.current.width + deltaX)
    );
    const newHeight = Math.max(
      50,
      Math.min(500, startPos.current.height + deltaY)
    );

    setWidth(newWidth);
    setHeight(newHeight);
  };

  const handleMouseUp = () => {
    if (!isResizing) return;
    setIsResizing(false);

    // Update the node in the editor
    editor.update(() => {
      const nodeKey = node.getKey();
      const currentNode = $getNodeByKey(nodeKey) as StickerNode | null;
      if (currentNode) {
        currentNode.setWidth(width);
        currentNode.setHeight(height);
      }
    });
  };

  // Add global mouse event listeners for resize
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, width, height]);

  return (
    <div className="relative inline-block group">
      <img
        src={node.getSrc()}
        alt={node.getAltText()}
        width={width}
        height={height}
        className="max-w-none"
        style={{ userSelect: "none" }}
        draggable={false}
      />

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseDown={handleMouseDown}
        style={{ transform: "translate(50%, 50%)" }}
      />

      {/* Size indicator */}
      {isResizing && (
        <div className="absolute top-0 left-0 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {Math.round(width)} × {Math.round(height)}
        </div>
      )}
    </div>
  );
}

export function $createStickerNode({
  src,
  altText,
  width,
  height,
  key,
}: StickerPayload): StickerNode {
  return new StickerNode({ src, altText, width, height }, key);
}

export function $isStickerNode(node: any): node is StickerNode {
  return node instanceof StickerNode;
}
