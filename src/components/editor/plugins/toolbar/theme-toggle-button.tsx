"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useRef, useState, useEffect } from "react";

// Global style for curtain animation
if (typeof window !== "undefined") {
  const styleId = "curtain-fall-animation-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      @keyframes curtain-fall {
        0% {
          transform: translateY(-100%);
          opacity: 1;
        }
        60% {
          transform: translateY(0%);
          opacity: 1;
        }
        100% {
          transform: translateY(0%);
          opacity: 0;
        }
      }
      .animate-curtain-fall {
        animation: curtain-fall 1.2s cubic-bezier(0.77,0,0.175,1) forwards;
      }
    `;
    document.head.appendChild(style);
  }
}

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [animating, setAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const curtainRef = useRef<HTMLDivElement>(null);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeSwitch = () => {
    if (animating || !mounted) return;
    setAnimating(true);
    if (curtainRef.current) {
      curtainRef.current.classList.remove("hidden");
      curtainRef.current.classList.add("animate-curtain-fall");
    }
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    }, 600); // Start theme switch mid-animation
    setTimeout(() => {
      if (curtainRef.current) {
        curtainRef.current.classList.add("hidden");
        curtainRef.current.classList.remove("animate-curtain-fall");
      }
      setAnimating(false);
    }, 1200); // End animation
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        className="ml-2"
        disabled
      >
        <Sun className="size-5" />
      </Button>
    );
  }

  return (
    <div style={{ display: "contents" }}>
      <div
        ref={curtainRef}
        className="hidden fixed inset-0 z-[9999] pointer-events-none bg-background transition-none animate-none"
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(to bottom, #fff 0%, #e0e7ef 100%)"
              : "linear-gradient(to bottom, #18181b 0%, #23272f 100%)",
        }}
      />
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        onClick={handleThemeSwitch}
        className="ml-2"
        disabled={animating}
      >
        {theme === "dark" ? (
          <Sun className="size-5" />
        ) : (
          <Moon className="size-5" />
        )}
      </Button>
    </div>
  );
}
