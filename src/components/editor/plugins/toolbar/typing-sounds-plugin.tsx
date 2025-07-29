"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Volume2, VolumeX, ChevronDown } from "lucide-react";

interface SoundOption {
  id: string;
  name: string;
  file: string;
}

// Key mapping for NK Cream sounds
const NK_CREAM_KEY_SOUNDS: Record<string, string> = {
  // Letters
  a: "/sounds/nk-cream/a.wav",
  b: "/sounds/nk-cream/b.wav",
  c: "/sounds/nk-cream/c.wav",
  d: "/sounds/nk-cream/d.wav",
  e: "/sounds/nk-cream/e.wav",
  f: "/sounds/nk-cream/f.wav",
  g: "/sounds/nk-cream/g.wav",
  h: "/sounds/nk-cream/h.wav",
  i: "/sounds/nk-cream/i.wav",
  j: "/sounds/nk-cream/j.wav",
  k: "/sounds/nk-cream/k.wav",
  l: "/sounds/nk-cream/l.wav",
  m: "/sounds/nk-cream/m.wav",
  n: "/sounds/nk-cream/n.wav",
  o: "/sounds/nk-cream/o.wav",
  p: "/sounds/nk-cream/p.wav",
  q: "/sounds/nk-cream/q.wav",
  r: "/sounds/nk-cream/r.wav",
  s: "/sounds/nk-cream/s.wav",
  t: "/sounds/nk-cream/t.wav",
  u: "/sounds/nk-cream/u.wav",
  v: "/sounds/nk-cream/v.wav",
  w: "/sounds/nk-cream/w.wav",
  x: "/sounds/nk-cream/x.wav",
  y: "/sounds/nk-cream/y.wav",
  z: "/sounds/nk-cream/z.wav",

  // Special keys
  " ": "/sounds/nk-cream/space.wav",
  Enter: "/sounds/nk-cream/enter.wav",
  Backspace: "/sounds/nk-cream/backspace.wav",
  Tab: "/sounds/nk-cream/tab.wav",
  Shift: "/sounds/nk-cream/shift.wav",
  CapsLock: "/sounds/nk-cream/caps lock.wav",
  "[": "/sounds/nk-cream/[.wav",
  "]": "/sounds/nk-cream/].wav",

  // Numbers (use letter sounds as fallback)
  "1": "/sounds/nk-cream/q.wav",
  "2": "/sounds/nk-cream/w.wav",
  "3": "/sounds/nk-cream/e.wav",
  "4": "/sounds/nk-cream/r.wav",
  "5": "/sounds/nk-cream/t.wav",
  "6": "/sounds/nk-cream/y.wav",
  "7": "/sounds/nk-cream/u.wav",
  "8": "/sounds/nk-cream/i.wav",
  "9": "/sounds/nk-cream/o.wav",
  "0": "/sounds/nk-cream/p.wav",
};

// Opera GX key mapping - using 12 different sounds in rotation
const OPERA_GX_KEY_SOUNDS: Record<string, string> = {
  // Letters - mapped to various real sounds for variety
  a: "/sounds/opera-gx-typing-sounds/1real.wav",
  b: "/sounds/opera-gx-typing-sounds/2real.wav",
  c: "/sounds/opera-gx-typing-sounds/3real.wav",
  d: "/sounds/opera-gx-typing-sounds/4real.wav",
  e: "/sounds/opera-gx-typing-sounds/5real.wav",
  f: "/sounds/opera-gx-typing-sounds/6real.wav",
  g: "/sounds/opera-gx-typing-sounds/7real.wav",
  h: "/sounds/opera-gx-typing-sounds/8real.wav",
  i: "/sounds/opera-gx-typing-sounds/9real.wav",
  j: "/sounds/opera-gx-typing-sounds/10real.wav",
  k: "/sounds/opera-gx-typing-sounds/11real.wav",
  l: "/sounds/opera-gx-typing-sounds/12real.wav",
  m: "/sounds/opera-gx-typing-sounds/1real.wav",
  n: "/sounds/opera-gx-typing-sounds/2real.wav",
  o: "/sounds/opera-gx-typing-sounds/3real.wav",
  p: "/sounds/opera-gx-typing-sounds/4real.wav",
  q: "/sounds/opera-gx-typing-sounds/5real.wav",
  r: "/sounds/opera-gx-typing-sounds/6real.wav",
  s: "/sounds/opera-gx-typing-sounds/7real.wav",
  t: "/sounds/opera-gx-typing-sounds/8real.wav",
  u: "/sounds/opera-gx-typing-sounds/9real.wav",
  v: "/sounds/opera-gx-typing-sounds/10real.wav",
  w: "/sounds/opera-gx-typing-sounds/11real.wav",
  x: "/sounds/opera-gx-typing-sounds/12real.wav",
  y: "/sounds/opera-gx-typing-sounds/1real.wav",
  z: "/sounds/opera-gx-typing-sounds/2real.wav",

  // Special keys
  " ": "/sounds/opera-gx-typing-sounds/space.wav",
  Enter: "/sounds/opera-gx-typing-sounds/enter.wav",
  Backspace: "/sounds/opera-gx-typing-sounds/backspace.wav",

  // Numbers - use rotating sounds
  "1": "/sounds/opera-gx-typing-sounds/3real.wav",
  "2": "/sounds/opera-gx-typing-sounds/4real.wav",
  "3": "/sounds/opera-gx-typing-sounds/5real.wav",
  "4": "/sounds/opera-gx-typing-sounds/6real.wav",
  "5": "/sounds/opera-gx-typing-sounds/7real.wav",
  "6": "/sounds/opera-gx-typing-sounds/8real.wav",
  "7": "/sounds/opera-gx-typing-sounds/9real.wav",
  "8": "/sounds/opera-gx-typing-sounds/10real.wav",
  "9": "/sounds/opera-gx-typing-sounds/11real.wav",
  "0": "/sounds/opera-gx-typing-sounds/12real.wav",
};

const SOUND_OPTIONS: SoundOption[] = [
  { id: "none", name: "No Sound", file: "" },
  { id: "nk-cream", name: "NK Cream Mechanical", file: "nk-cream" },
  { id: "opera-gx", name: "Opera GX", file: "opera-gx" },
];

export function TypingSoundsPlugin() {
  const [selectedSound, setSelectedSound] = useState<SoundOption>(
    SOUND_OPTIONS[0]
  );
  const [isEnabled, setIsEnabled] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioPoolsRef = useRef<Record<string, HTMLAudioElement[]>>({});
  const currentIndicesRef = useRef<Record<string, number>>({});
  const playingAudios = useRef<Set<HTMLAudioElement>>(new Set());

  // Create audio pools for each key when NK Cream or Opera GX is selected
  useEffect(() => {
    // Clear existing audio pools
    Object.values(audioPoolsRef.current).forEach((pool) => {
      pool.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    });
    audioPoolsRef.current = {};
    currentIndicesRef.current = {};
    playingAudios.current.clear();

    let keyMappings: Record<string, string> = {};

    if (selectedSound.id === "nk-cream" && isEnabled) {
      keyMappings = NK_CREAM_KEY_SOUNDS;
    } else if (selectedSound.id === "opera-gx" && isEnabled) {
      keyMappings = OPERA_GX_KEY_SOUNDS;
    }

    if (Object.keys(keyMappings).length > 0) {
      // Create audio pools for each key sound
      Object.entries(keyMappings).forEach(([key, soundPath]) => {
        audioPoolsRef.current[key] = [];
        currentIndicesRef.current[key] = 0;

        // Create 3 audio elements per key for overlapping sounds
        for (let i = 0; i < 3; i++) {
          const audio = new Audio(soundPath);
          audio.volume = volume;
          audio.preload = "auto";

          // Add ended event listener to remove from playing set
          audio.addEventListener("ended", () => {
            playingAudios.current.delete(audio);
          });

          audioPoolsRef.current[key].push(audio);
        }
      });
    }
  }, [selectedSound, isEnabled, volume]);

  // Add global keydown listener for typing sounds
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only play sound for actual typing keys (not ctrl, alt, etc.)
      if (
        !isEnabled ||
        (selectedSound.id !== "nk-cream" && selectedSound.id !== "opera-gx") ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        [
          "Control",
          "Alt",
          "Meta",
          "F1",
          "F2",
          "F3",
          "F4",
          "F5",
          "F6",
          "F7",
          "F8",
          "F9",
          "F10",
          "F11",
          "F12",
        ].includes(event.key)
      ) {
        return;
      }

      // Get the key to map to sound
      let soundKey = event.key.toLowerCase();

      // Special key mappings
      if (soundKey === " ") soundKey = " "; // Space
      if (soundKey === "capslock") soundKey = "CapsLock";

      // Check if we have a sound for this key
      const keyPool = audioPoolsRef.current[soundKey];
      if (!keyPool || keyPool.length === 0) {
        // Fallback to a generic key sound if available
        const fallbackPool = audioPoolsRef.current["a"];
        if (!fallbackPool || fallbackPool.length === 0) return;

        // Use fallback
        const currentIndex = currentIndicesRef.current["a"] || 0;
        const audio = fallbackPool[currentIndex];
        currentIndicesRef.current["a"] =
          (currentIndex + 1) % fallbackPool.length;

        // Play fallback sound
        try {
          audio.currentTime = 0;
          audio
            .play()
            .then(() => {
              playingAudios.current.add(audio);
            })
            .catch(console.error);
        } catch (error) {
          console.error("Error playing fallback typing sound:", error);
        }
        return;
      }

      // Get next available audio element from the key's pool
      const currentIndex = currentIndicesRef.current[soundKey] || 0;
      const audio = keyPool[currentIndex];
      currentIndicesRef.current[soundKey] = (currentIndex + 1) % keyPool.length;

      // Stop current audio if it's playing
      if (playingAudios.current.has(audio)) {
        audio.pause();
        audio.currentTime = 0;
        playingAudios.current.delete(audio);
      }

      // Play sound
      try {
        audio.currentTime = 0; // Reset to beginning
        audio
          .play()
          .then(() => {
            playingAudios.current.add(audio);
          })
          .catch(console.error);
      } catch (error) {
        console.error("Error playing typing sound:", error);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Stop all playing audios
      playingAudios.current.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
      playingAudios.current.clear();
    };
  }, [isEnabled, selectedSound, volume]);

  const handleSoundSelect = (sound: SoundOption) => {
    setSelectedSound(sound);
    if (sound.id === "none") {
      setIsEnabled(false);
    } else {
      setIsEnabled(true);
    }
  };

  const toggleSound = () => {
    if (selectedSound.id === "none") {
      // If no sound is selected, pick the first available sound
      const firstSound = SOUND_OPTIONS[1];
      setSelectedSound(firstSound);
      setIsEnabled(true);
    } else {
      setIsEnabled(!isEnabled);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSound}
        className={`flex items-center gap-1 ${
          isEnabled ? "text-blue-600 dark:text-blue-400" : ""
        }`}
        title={isEnabled ? "Disable typing sounds" : "Enable typing sounds"}
      >
        {isEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-sm"
          >
            <span className="hidden sm:inline">{selectedSound.name}</span>
            <span className="sm:hidden">Sound</span>
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {SOUND_OPTIONS.map((sound) => (
            <DropdownMenuItem
              key={sound.id}
              onClick={() => handleSoundSelect(sound)}
              className={`flex items-center gap-2 ${
                selectedSound.id === sound.id ? "bg-accent" : ""
              }`}
            >
              {sound.id === "none" ? (
                <VolumeX size={14} />
              ) : (
                <Volume2 size={14} />
              )}
              <span>{sound.name}</span>
              {selectedSound.id === sound.id && (
                <span className="ml-auto text-xs">✓</span>
              )}
            </DropdownMenuItem>
          ))}

          {selectedSound.id !== "none" && (
            <>
              <DropdownMenuSeparator />
              <div className="px-2 py-2">
                <label className="text-xs text-muted-foreground mb-1 block">
                  Volume
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round(volume * 100)}%
                </div>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
