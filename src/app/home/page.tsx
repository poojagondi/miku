"use client";

import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MikuLoader } from "@/components/ui/miku-loader";

export default function HomePage() {
  const { isPending } = useSession();
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleGetStarted = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push("/choose-your-pill");
    }, 1200); // Duration of the miku icon animation
  };

  if (isPending) {
    return (
      <div className="relative min-h-screen">
        <div className="fixed inset-0 bg-black/10 z-0"></div>
        <div className="relative z-20">
          <Navbar />
          <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <MikuLoader size={48} text="Loading..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Miku Icon Transition Overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <Image
            src="/miku_res.png"
            alt="Miku Notes Icon"
            width={48}
            height={48}
            className="rounded animate-miku-grow"
          />
        </div>
      )}

      <div className="fixed inset-0 bg-black/10 z-0"></div>
      <div className="relative z-20">
        <Navbar />
        {/* Hero Section */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-4xl mx-auto px-4">
            {/* Main Hero Content */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6">Miku Notes</h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Your creative thoughts deserve a beautiful home. <br />
              Write, express, and organize with style.
            </p>
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl mb-2">✨</div>
                <h3 className="font-semibold mb-2">Rich Editor</h3>
                <p className="text-white/80 text-sm">
                  Powerful text editing with stickers and formatting
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl mb-2">☁️</div>
                <h3 className="font-semibold mb-2">Cloud Sync</h3>
                <p className="text-white/80 text-sm">
                  Access your notes anywhere, anytime
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl mb-2">🎨</div>
                <h3 className="font-semibold mb-2">Beautiful</h3>
                <p className="text-white/80 text-sm">
                  Elegant design inspired by creativity
                </p>
              </div>
            </div>
            {/* CTA Button */}
            <button
              onClick={handleGetStarted}
              disabled={isTransitioning}
              className="px-12 py-4 text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-500 text-white rounded-full shadow-2xl hover:from-cyan-500 hover:to-teal-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get Started
            </button>
            <p className="text-white/70 text-sm mt-4">
              Sign in to begin your journey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
