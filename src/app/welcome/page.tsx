"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { useSession } from "@/lib/auth-client";

export default function WelcomePage() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showEntrance, setShowEntrance] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  const handleEnterDashboard = () => {
    // Trigger confetti animation
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"],
    });

    // Additional confetti burst
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.7 },
        colors: ["#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3", "#ff9f43"],
      });
    }, 200);

    // Start transition
    setIsTransitioning(true);

    // Navigate to dashboard after confetti
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!session?.user) {
      router.push("/sign-in");
    }
  }, [session, router]);

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl">Redirecting to sign in...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
              Welcome, {session.user.name || session.user.email}! 🎉
            </h1>
            <p className="text-xl text-white/90 mb-6">
              You're all set to start your creative journey with Miku Notes!
            </p>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 transform hover:scale-105 transition-transform">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="text-white font-semibold text-sm">Rich Editor</h3>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 transform hover:scale-105 transition-transform">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="text-white font-semibold text-sm">
                Custom Stickers
              </h3>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 transform hover:scale-105 transition-transform">
              <div className="text-2xl mb-2">☁️</div>
              <h3 className="text-white font-semibold text-sm">Auto Save</h3>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 transform hover:scale-105 transition-transform">
              <div className="text-2xl mb-2">🌙</div>
              <h3 className="text-white font-semibold text-sm">Dark Mode</h3>
            </div>
          </div>

          {/* Enter Button */}
          <button
            onClick={handleEnterDashboard}
            disabled={isTransitioning}
            className={`px-12 py-4 text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full hover:from-pink-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-2xl ${
              isTransitioning ? "animate-pulse" : "animate-bounce"
            }`}
          >
            {isTransitioning ? "Entering Dashboard..." : "Enter Dashboard"}
          </button>

          <p className="text-white/70 text-sm mt-4">
            Get ready for an amazing note-taking experience!
          </p>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}
