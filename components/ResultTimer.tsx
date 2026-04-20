"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/lib/store";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";

interface ResultTimerProps {
  result: string | null;
  isStarted: boolean;
  onTaskComplete?: () => void;
  taskPriority?: "low" | "medium" | "high";
}

export function ResultTimer({ result, isStarted, onTaskComplete, taskPriority }: ResultTimerProps) {
  const { activeTimer, clearTimer, tasks, removeTask, leisures } = useTaskStore();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 128, y: window.innerHeight - 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [showTaskConfirm, setShowTaskConfirm] = useState(false);
  const [showLeisureConfirm, setShowLeisureConfirm] = useState(false);

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

        // Show appropriate dialog based on task/leisure
        if (activeTimer.isTask) {
          setShowTaskConfirm(true);
        } else {
          setShowLeisureConfirm(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleTaskComplete = (finished: boolean) => {
    if (finished) {
      // Remove the task from the store
      const task = tasks.find(t => t.title === activeTimer?.result);
      if (task) {
        removeTask(task.id);
      }
    }
    setShowTaskConfirm(false);
    clearTimer();
  };

  const handleLeisureContinue = () => {
    setShowLeisureConfirm(false);
    clearTimer();
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ x: position.x, y: position.y }}
        className="fixed flex flex-col items-center gap-4 z-50 cursor-grab active:cursor-grabbing user-select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Timer Display */}
        <motion.div
          animate={{ opacity: isHovering ? 1 : 0.2 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-gray-900 to-black border-4 border-yellow-600 rounded-2xl p-8 shadow-2xl min-w-64 text-center select-none"
        >
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
        </motion.div>
      </motion.div>

      {/* Task Completion Dialog */}
      <ConfirmationDialog
        isOpen={showTaskConfirm}
        title="Task Complete?"
        message="Did you finish this task?"
        confirmText="Yes, Remove Task"
        cancelText="No, Keep It"
        onConfirm={() => handleTaskComplete(true)}
        onCancel={() => handleTaskComplete(false)}
        type="success"
      />

      {/* Leisure Completion Dialog */}
      <AnimatePresence>
        {showLeisureConfirm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleLeisureContinue}
              className="fixed inset-0 bg-black bg-opacity-70 z-[100]"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] bg-gradient-to-br from-gray-900 to-black border-4 border-green-600 rounded-2xl p-8 shadow-2xl max-w-sm"
            >
              {/* Title */}
              <p className="text-2xl font-black mb-4 text-green-400">Time's Up!</p>

              {/* Message */}
              <p className="text-white text-center mb-8 leading-relaxed">
                {activeTimer?.result === "Rest"
                  ? "Rest time is over. Ready to continue?"
                  : "Game time is over. Ready to continue?"}
              </p>

              {/* Button */}
              <button
                onClick={handleLeisureContinue}
                className="w-full py-3 px-4 rounded-lg font-bold text-white bg-green-600 hover:bg-green-500 transition transform hover:scale-105 active:scale-95"
              >
                Continue
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

