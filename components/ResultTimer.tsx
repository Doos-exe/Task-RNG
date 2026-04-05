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
  const { addCoins, pendingCount } = useTaskStore();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isTask, setIsTask] = useState(false);

  // Determine time based on result
  useEffect(() => {
    if (!result) return;

    let duration = 0;
    const isTaskResult = result !== "Rest" && result !== "Game";
    setIsTask(isTaskResult);

    if (result === "Rest" || result === "Game") {
      // Randomize between 30, 45, or 60 minutes
      const options = [30, 45, 60];
      const randomIndex = Math.floor(Math.random() * options.length);
      duration = options[randomIndex] * 60; // Convert to seconds
    } else {
      // For Tasks, use priority to determine duration
      if (taskPriority === "low") {
        duration = 30 * 60;
      } else if (taskPriority === "medium") {
        duration = 45 * 60;
      } else if (taskPriority === "high") {
        duration = 60 * 60;
      } else {
        duration = 45 * 60; // Default to medium
      }
    }

    setTotalTime(duration);
    setTimeLeft(duration);
    setIsActive(isStarted);
    setShowCompletion(false);
  }, [result, isStarted, taskPriority]);

  // Timer countdown
  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (isActive && timeLeft <= 0 && result) {
        setIsActive(false);
        setShowCompletion(true);

        // Give coins if it's a task and there are pending tasks
        if (isTask && pendingCount() > 0) {
          addCoins(1);
        }

        if (onTaskComplete) {
          onTaskComplete();
        }

        // Hide completion message after 3 seconds
        const hideTimer = setTimeout(() => {
          setShowCompletion(false);
        }, 3000);
        return () => clearTimeout(hideTimer);
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, result, isTask, pendingCount, addCoins, onTaskComplete]);

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

  if (!result) {
    return null;
  }

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
            {result === "Rest" ? "Time to Rest" : result === "Game" ? "Game Time" : "Task Duration"}
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
            {isActive ? "⏱️ In Progress" : timeLeft > 0 ? "⏸️ Paused" : "✓ Complete"}
          </p>
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
                {isTask ? "✓ Task Complete!" : "✓ Time's Up!"}
              </p>
              {isTask && pendingCount() > 0 && (
                <p className="text-xl font-black text-green-300 mt-2">
                  +1 💰 Coin!
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

