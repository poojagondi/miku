"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      label: "About",
      href: "/about",
      icon: <span className="text-lg">ℹ️</span>,
    },
    {
      label: "Sign In",
      href: "/sign-in",
      icon: <span className="text-lg">🔐</span>,
    },
    {
      label: "Sign Up",
      href: "/sign-up",
      icon: <span className="text-lg">📝</span>,
    },
    {
      label: "Theme",
      href: "/theme",
      icon: <span className="text-lg">🎨</span>,
    },
    {
      label: "GitHub",
      href: "/github",
      icon: (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/github-flaticon.svg"
          alt="GitHub"
          className="w-5 h-5 inline-block"
        />
      ),
    },
    {
      label: "Discord",
      href: "/discord",
      icon: (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/discord-flaticon.svg"
          alt="Discord"
          className="w-5 h-5 inline-block"
        />
      ),
    },
  ];

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="p-2 hover:bg-muted/50 transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex flex-col gap-1 w-5 h-5" aria-hidden>
          <div
            className={`h-0.5 bg-foreground transition-all duration-300 ${isOpen ? "rotate-45 translate-y-1.5" : ""}`}
          />
          <div
            className={`h-0.5 bg-foreground transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
          />
          <div
            className={`h-0.5 bg-foreground transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
          />
        </div>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <button
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu backdrop"
          />

          {/* Menu Content */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-50 py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors no-underline"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HamburgerMenu;
