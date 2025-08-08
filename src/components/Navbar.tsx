"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import HamburgerMenu from "./HamburgerMenu";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/70 supports-[backdrop-filter]:bg-background/60 backdrop-blur px-3 sm:px-4 py-2 border-b border-accent shadow-md">
      <div className="container flex items-center justify-between mx-auto w-full gap-2">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 no-underline font-bold text-xl sm:text-2xl text-foreground"
        >
          <Image
            src="/mikuuu.png"
            alt="Miku Notes Icon"
            width={40}
            height={40}
            className="rounded sm:w-12 sm:h-12 w-10 h-10"
          />
          <span>Notes</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/about" className="no-underline">
              <Button size="sm" variant="outline" className="cursor-pointer">
                About
              </Button>
            </Link>
            <Link href="/sign-in" className="no-underline">
              <Button size="sm" className="cursor-pointer">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" className="no-underline">
              <Button size="sm" className="cursor-pointer">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <HamburgerMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
