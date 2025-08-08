"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

export default function EnterPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fade, setFade] = useState(false);

  const handleEnter = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.7 },
    });
    setFade(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 900); // fade duration should match CSS
  };

  return (
    <div
      className={`relative min-h-[100svh] flex items-center justify-center bg-black transition-opacity duration-900 ${fade ? "opacity-0" : "opacity-100"}`}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/bgVideo.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100svh] px-4">
        <button
          onClick={handleEnter}
          className="px-12 py-4 text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full shadow-2xl hover:from-pink-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300"
        >
          enter
        </button>
      </div>
    </div>
  );
}
