"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import SignIn from "./sign-in";
import { Button } from "./ui/button";
import HamburgerMenu from "./HamburgerMenu";

const Navbar = () => {
  return (
    <nav className="bg-background px-4 py-2 flex items-center border-b-2 border-accent shadow-md">
      <div className="container flex items-center justify-between mx-auto w-full">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 no-underline font-bold text-2xl text-foreground"
        >
          <Image
            src="/mikuuu.png"
            alt="Miku Notes Icon"
            width={48}
            height={48}
            className="rounded"
          />
          <span>Notes</span>
        </Link>

        {/* Navigation and auth */}
        <div className="flex items-center gap-10">
          {/* Navigation links */}
          <div className="flex items-center gap-5">
            <Link href="/about" className="no-underline">
              <Button variant="outline" className="cursor-pointer">
                About
              </Button>
            </Link>
            <Link href="/sign-in" className="no-underline">
              <Button className="cursor-pointer">Sign In</Button>
            </Link>
            <Link href="/sign-up" className="no-underline">
              <Button className="cursor-pointer">Sign Up</Button>
            </Link>
            <HamburgerMenu />
          </div>
          {/* Authentication buttons */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
