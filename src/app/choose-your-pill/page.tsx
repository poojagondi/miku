"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ChooseYourPillPage() {
  const { setTheme } = useTheme();
  const router = useRouter();
  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center bg-background text-foreground px-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center">
        Choose Your Theme
      </h1>
      <div className="relative w-full max-w-2xl flex flex-col items-center">
        <Image
          src="/red-pill-or-blue-pill-v0-aagfwk6khe8d1.webp"
          alt="Red or Blue Pill"
          width={800}
          height={600}
          className="w-full max-w-md rounded-xl shadow-lg h-auto"
          priority
        />
        {/* Theme Buttons */}
        <button
          className="absolute left-1/4 bottom-[18%] md:bottom-[22%] md:left-[22%] px-4 md:px-6 py-2.5 md:py-3 bg-cyan-500 text-white font-bold rounded-full shadow-lg hover:bg-cyan-600 transition-all border-2 border-white"
          onClick={() => setTheme("light")}
        >
          Light
        </button>
        <button
          className="absolute right-1/4 bottom-[18%] md:bottom-[22%] md:right-[22%] px-4 md:px-6 py-2.5 md:py-3 bg-gray-800 text-white font-bold rounded-full shadow-lg hover:bg-gray-900 transition-all border-2 border-white"
          onClick={() => setTheme("dark")}
        >
          Dark
        </button>
        <button
          className="mt-8 px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-cyan-400 to-teal-500 text-white font-bold rounded-full shadow-lg hover:from-cyan-500 hover:to-teal-600 transition-all"
          onClick={() => router.push("/sign-in")}
        >
          Proceed to Sign In/Sign Up
        </button>
      </div>
    </div>
  );
}
