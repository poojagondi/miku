"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function MikuversePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fade, setFade] = useState(false);

  const handleEnterEditor = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.7 },
      colors: ["#ff69b4", "#00bfff", "#ff1493", "#87ceeb", "#da70d6"],
    });
    setFade(true);
    setTimeout(() => {
      router.push("/editor");
    }, 900);
  };

  const handleBackToDashboard = () => {
    setFade(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div
      className={`relative min-h-[100svh] flex items-center justify-center bg-black transition-opacity duration-900 ${fade ? "opacity-0" : "opacity-100"}`}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/bgVideo.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          onClick={handleBackToDashboard}
          variant="outline"
          size="sm"
          className="bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100svh] text-center px-4">
        <div className="mb-8">
          <div className="bg-black/50 backdrop-blur-sm rounded-3xl p-4 mb-6 border border-white/20">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-pulse drop-shadow-2xl">
              MIKUVERSE
            </h1>
          </div>
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="text-xl md:text-2xl text-white font-semibold mb-2 drop-shadow-2xl">
              Welcome to the magical world of Hatsune Miku! 🎵
            </p>
            <p className="text-lg md:text-xl text-white/90 drop-shadow-xl">
              Create notes, express yourself, and dive into creativity.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleEnterEditor}
            className="px-8 py-3 text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full shadow-2xl hover:from-pink-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 animate-bounce"
          >
            🎤 Start Creating 🎤
          </button>

          <Button
            onClick={() =>
              window.open("https://www.youtube.com/@HatsuneMiku", "_blank")
            }
            variant="outline"
            size="lg"
            className="px-8 py-3 text-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            📺 YouTube
          </Button>

          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            size="lg"
            className="px-8 py-4 text-xl bg-black/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/10 rounded-full"
          >
            📝 View My Notes
          </Button>
        </div>

        <div className="mt-12 bg-black/40 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
          <p className="text-lg text-white font-medium drop-shadow-lg">
            Let the music guide your creativity! ✨
          </p>
        </div>
      </div>
    </div>
  );
}
