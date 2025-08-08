"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/test_landing_miku.png"
          alt="Miku Landing Background"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/20"></div>
      </div>

      <div className="relative z-20">
        <Navbar />
        {/* Hero Section */}
        <div className="flex items-center justify-center min-h-[calc(100svh-80px)] sm:min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-4xl mx-auto px-4">
            {/* Text Content - Centered on the page */}
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-2xl leading-tight">
                miku notes
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-white drop-shadow-xl max-w-[90%] sm:max-w-2xl">
                Your creative thoughts deserve a beautiful home. <br />
                Write, express, and organize with style.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
