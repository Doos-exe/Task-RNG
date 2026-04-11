"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/lib/store";

interface ResultTimerProps {
  result: string | null;
  isStarted: boolean;
  onTaskComplete?: () => void;
  taskPriority?: "low" | "medium" | "high";
}

export function ResultTimer({ result, isStarted, onTaskComplete, taskPriority }: ResultTimerProps) {
  const { activeTimer, clearTimer } = useTaskStore();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [showCompletion, setShowCompletion] = useState(false);

  // Sync with store's timer
  useEffect(() => {
    if (activeTimer) {
      const elapsed = (Date.now() - activeTimer.startTime) / 1000;
      const remaining = Math.max(0, activeTimer.duration - elapsed);
      setTimeLeft(Math.ceil(remaining));
      setTotalTime(activeTimer.duration);
    }
  }, [activeTimer]);

  // Timer countdown
  useEffect(() => {
    if (!activeTimer) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - activeTimer.startTime) / 1000;
      const remaining = Math.max(0, activeTimer.duration - elapsed);

      setTimeLeft(Math.ceil(remaining));

      if (remaining <= 0) {
        clearInterval(interval);
        setShowCompletion(true);

        // Clear the timer from store so user can spin/roll again
        clearTimer();

        if (onTaskComplete) {
          onTaskComplete();
        }

        // Hide completion message after 3 seconds
        const hideTimer = setTimeout(() => {
          setShowCompletion(false);
        }, 3000);

        return () => clearTimeout(hideTimer);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer, clearTimer, onTaskComplete]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;

  if (!activeTimer) {
    return null;
  }

  const isTask = activeTimer.isTask;
  const timerLabel = activeTimer.result === "Rest" ? "Time to Rest" : activeTimer.result === "Game" ? "Game Time" : "Task Duration";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50"
      >
        {/* Timer Display */}
        <div className="bg-gradient-to-br from-gray-900 to-black border-4 border-yellow-600 rounded-2xl p-8 shadow-2xl min-w-64 text-center">
          {/* Activity Type */}
          <p className="text-sm font-black text-yellow-400 uppercase tracking-widest mb-2">
            {timerLabel}
          </p>

          {/* Time Display */}
          <div className="text-5xl font-black text-yellow-300 mb-4 font-mono">
            {formatTime(timeLeft)}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 border-2 border-yellow-600 rounded-full h-4 overflow-hidden">
            <motion.div
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full"
            />
          </div>

          {/* Status */}
          <p className="text-xs font-bold text-yellow-300 mt-4 uppercase tracking-wider">
            {timeLeft > 0 ? "⏱️ In Progress" : "✓ Complete"}
          </p>

          {/* Skip Button for Testing */}
          <button
            onClick={() => clearTimer()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold text-xs transition-all"
          >
            ⏭️ Skip (Test)
          </button>
        </div>
      </motion.div>

      {/* Completion Message */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="fixed bottom-48 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-br from-green-600 to-green-800 border-4 border-green-400 rounded-2xl px-8 py-4 shadow-2xl text-center">
              <p className="text-2xl font-black text-white">
                {activeTimer.isTask ? "✓ Task Complete!" : "✓ Time's Up!"}
              </p>
              <p className="text-lg font-bold text-green-200 mt-2">
                You can now spin/roll again freely 🎲
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

