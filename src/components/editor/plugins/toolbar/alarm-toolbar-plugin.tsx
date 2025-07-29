"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Timer, StopCircle, Volume2, Play, Pause } from "lucide-react";

export function AlarmToolbarPlugin() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Timer states
  const [timerMinutes, setTimerMinutes] = useState("");
  const [timerSeconds, setTimerSeconds] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0); // in seconds
  const [initialTime, setInitialTime] = useState(0); // for progress bar

  // Common states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (isTimerRunning && !isTimerPaused && remainingTime > 0) {
      timerIntervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            // Timer finished
            triggerAlarm();
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning, isTimerPaused, remainingTime]);

  const startTimer = () => {
    const minutes = parseInt(timerMinutes) || 0;
    const seconds = parseInt(timerSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;

    if (totalSeconds > 0) {
      setRemainingTime(totalSeconds);
      setInitialTime(totalSeconds);
      setIsTimerRunning(true);
      setIsTimerPaused(false);
      setIsPopoverOpen(false);
    }
  };

  const pauseTimer = () => {
    setIsTimerPaused(true);
  };

  const resumeTimer = () => {
    setIsTimerPaused(false);
  };

  const cancelTimer = () => {
    setIsTimerRunning(false);
    setIsTimerPaused(false);
    setRemainingTime(0);
    setInitialTime(0);
    setTimerMinutes("");
    setTimerSeconds("");
  };

  const triggerAlarm = () => {
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const stopAlarm = () => {
    setIsPlaying(false);
    setIsTimerRunning(false);
    setIsTimerPaused(false);
    setRemainingTime(0);
    setInitialTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getButtonText = () => {
    if (isTimerRunning) return `Timer (${formatTime(remainingTime)})`;
    return "Timer";
  };

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={isTimerRunning ? "default" : "ghost"}
            size="sm"
            className={`flex items-center gap-1 ${
              isTimerRunning ? "bg-green-500 hover:bg-green-600 text-white" : ""
            }`}
          >
            <Timer size={16} />
            {getButtonText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Set Timer</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Set a countdown timer. The alarm will ring when time runs out.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="timer-minutes" className="text-sm font-medium">
                  Minutes
                </label>
                <Input
                  id="timer-minutes"
                  type="number"
                  min="0"
                  max="999"
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(e.target.value)}
                  placeholder="0"
                  className="w-full"
                  disabled={isTimerRunning}
                />
              </div>
              <div>
                <label htmlFor="timer-seconds" className="text-sm font-medium">
                  Seconds
                </label>
                <Input
                  id="timer-seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(e.target.value)}
                  placeholder="0"
                  className="w-full"
                  disabled={isTimerRunning}
                />
              </div>
            </div>

            <div className="flex gap-2">
              {!isTimerRunning ? (
                <Button
                  onClick={startTimer}
                  disabled={!timerMinutes && !timerSeconds}
                  size="sm"
                  className="flex-1"
                >
                  <Timer size={14} className="mr-1" />
                  Start Timer
                </Button>
              ) : (
                <>
                  {isTimerPaused ? (
                    <Button onClick={resumeTimer} size="sm" className="flex-1">
                      <Play size={14} className="mr-1" />
                      Resume
                    </Button>
                  ) : (
                    <Button onClick={pauseTimer} size="sm" className="flex-1">
                      <Pause size={14} className="mr-1" />
                      Pause
                    </Button>
                  )}
                  <Button onClick={cancelTimer} variant="outline" size="sm">
                    Cancel
                  </Button>
                </>
              )}
            </div>

            {isTimerRunning && (
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Timer size={14} />
                  <span className="font-medium">
                    Time remaining: {formatTime(remainingTime)}
                  </span>
                  {isTimerPaused && (
                    <span className="text-yellow-600 font-medium">
                      (Paused)
                    </span>
                  )}
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${initialTime > 0 ? (remainingTime / initialTime) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Stop Button - shows when timer alarm is playing */}
      {isPlaying && (
        <Button
          onClick={stopAlarm}
          variant="destructive"
          size="sm"
          className="flex items-center gap-1 animate-pulse"
        >
          <StopCircle size={16} />
          Stop Timer
        </Button>
      )}

      {/* Audio element */}
      <audio ref={audioRef} src="/miku-alarm.mp3" loop preload="auto" />
    </>
  );
}
