"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MikuLoader } from "@/components/ui/miku-loader";

interface StickerOption {
  src: string;
  alt: string;
  name: string;
}

interface StickerPickerProps {
  onStickerSelect: (sticker: StickerOption) => void;
  children: React.ReactNode;
}

export function StickerPicker({
  onStickerSelect,
  children,
}: StickerPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stickers, setStickers] = useState<StickerOption[]>([]);
  const [filteredStickers, setFilteredStickers] = useState<StickerOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter stickers based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStickers(stickers);
    } else {
      const filtered = stickers.filter((sticker) =>
        sticker.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStickers(filtered);
    }
  }, [stickers, searchTerm]);

  // Fetch stickers from API when component mounts or picker opens
  useEffect(() => {
    if (isOpen && stickers.length === 0) {
      loadStickers();
    }
  }, [isOpen]);

  const loadStickers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stickers");
      const data = await response.json();

      if (data.success) {
        setStickers(data.stickers);
      } else {
        setError("Failed to load stickers");
      }
    } catch (err) {
      console.error("Error loading stickers:", err);
      setError("Failed to load stickers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStickerClick = (sticker: StickerOption) => {
    onStickerSelect(sticker);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-96 p-3 max-h-80 overflow-y-auto"
        align="start"
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <MikuLoader size={32} text="Loading stickers..." />
          </div>
        ) : error ? (
          <div className="text-center p-4">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={loadStickers}>
              Retry
            </Button>
          </div>
        ) : stickers.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-sm text-muted-foreground">No stickers found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add PNG files to the /public/stickers folder
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Stickers ({stickers.length})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadStickers}
                className="h-6 w-6 p-0"
                title="Refresh stickers"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              </Button>
            </div>

            {/* Search input */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search stickers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-6 gap-1">
              {filteredStickers.map((sticker, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="h-12 w-12 p-0.5 hover:bg-muted transition-colors"
                  onClick={() => handleStickerClick(sticker)}
                  title={sticker.name}
                >
                  <img
                    src={sticker.src}
                    alt={sticker.alt}
                    className="w-full h-full object-contain rounded"
                    loading="lazy"
                    onError={(e) => {
                      console.error(`Failed to load sticker: ${sticker.src}`);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </Button>
              ))}
            </div>

            {filteredStickers.length === 0 && searchTerm && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  No stickers match &quot;{searchTerm}&quot;
                </p>
              </div>
            )}

            <div className="mt-2 text-xs text-muted-foreground text-center">
              Click a sticker to insert it
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
