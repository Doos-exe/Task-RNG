"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { selectWeightedCategory, Category } from "@/lib/probability";
import { useTaskStore } from "@/lib/store";

interface SlotMachineProps {
  isSpinning: boolean;
  onComplete: (result: Category | string) => void;
}

const REEL_ITEMS = ["Work", "Sleep", "Play", "Eat"];
const SPIN_DURATION = 3;
const ITEMS_TO_SHOW = 3;

export function SlotMachine({ isSpinning, onComplete }: SlotMachineProps) {
  const tasks = useTaskStore((state) => state.tasks);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);

  useEffect(() => {
    if (isSpinning) {
      setSelectedResult(null);

      // Determine the result based on weighted probability
      const category = selectWeightedCategory(pendingTasks.length);

      let finalResult: string = category;

      // If Work is selected, pick a random task
      if (category === "Work" && pendingTasks.length > 0) {
        const randomTask =
          pendingTasks[Math.floor(Math.random() * pendingTasks.length)];
        finalResult = randomTask.title;
      }

      // After spin duration, show result
      const timer = setTimeout(() => {
        setSelectedResult(finalResult);
        onComplete(finalResult);
      }, SPIN_DURATION * 1000);

      return () => clearTimeout(timer);
    }
  }, [isSpinning, pendingTasks, onComplete]);

  const reel = Array(ITEMS_TO_SHOW + 2)
    .fill(null)
    .map((_, i) => REEL_ITEMS[i % REEL_ITEMS.length]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12">
      {/* Reel Container */}
      <div className="relative overflow-hidden bg-white border border-notion-border rounded-lg p-8 w-full max-w-md">
        {/* Top Shadow */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />

        {/* Middle Indicator */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-notion-text pointer-events-none z-20">
          ►
        </div>

        {/* Reel Items */}
        <motion.div
          animate={
            isSpinning
              ? {
                  y: -SPIN_DURATION * 80,
                }
              : {
                  y: 0,
                }
          }
          transition={{
            duration: SPIN_DURATION,
            ease: "easeOut",
          }}
          className="flex flex-col gap-4"
        >
          {reel.map((item, idx) => (
            <div
              key={idx}
              className="h-12 flex items-center justify-center text-lg font-medium text-notion-text bg-notion-bg rounded border border-notion-border"
            >
              {item}
            </div>
          ))}
        </motion.div>

        {/* Bottom Shadow */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
      </div>

      {/* Result Display */}
      {selectedResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-wide text-notion-secondary mb-2">
            Next hour activity:
          </p>
          <p className="text-3xl font-bold text-notion-text">{selectedResult}</p>
        </motion.div>
      )}

      {/* Spinning Indicator */}
      {isSpinning && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-notion-border border-t-notion-text rounded-full"
        />
      )}
    </div>
  );
}
