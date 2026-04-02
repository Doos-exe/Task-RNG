"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CommitmentTimerProps {
  isActive: boolean;
  durationMinutes?: number;
  onComplete: () => void;
}

export function CommitmentTimer({
  isActive,
  durationMinutes = 60,
  onComplete,
}: CommitmentTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(durationMinutes * 60);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, durationMinutes, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / (durationMinutes * 60)) * 100;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Timer Display */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white border border-notion-border rounded-lg p-6 text-center"
      >
        <p className="text-xs uppercase tracking-wide text-notion-secondary mb-3">
          Commitment Timer
        </p>
        <div className="text-5xl font-bold text-notion-text tabular-nums mb-4">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-notion-bg rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "tween", duration: 0.1 }}
            className="h-full bg-notion-text"
          />
        </div>
      </motion.div>

      {/* Disabled State Message */}
      {isActive && (
        <p className="text-xs text-notion-secondary text-center mt-4">
          You're committed! Complete this activity before spinning again.
        </p>
      )}
    </div>
  );
}
