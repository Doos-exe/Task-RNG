"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { selectWeightedCategory, Category } from "@/lib/probability";
import { useTaskStore } from "@/lib/store";

interface SlotMachineProps {
  isSpinning: boolean;
  onComplete: (result: Category | string) => void;
  size?: "small" | "large";
}

const SPIN_DURATION = 3;
const ITEMS_TO_SHOW = 3;

export function SlotMachine({ isSpinning, onComplete, size = "small" }: SlotMachineProps) {
  const tasks = useTaskStore((state) => state.tasks);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [reelRotations, setReelRotations] = useState([0, 0, 0]);
  const [displayReels, setDisplayReels] = useState<string[][]>([[], [], []]);

  const isLarge = size === "large";

  // Generate reel items based on pending tasks
  const generateReelItems = () => {
    const pendingTasks = tasks.filter((t) => !t.completed);

    // If no tasks, use Rest and Game only
    if (pendingTasks.length === 0) {
      return [
        Array(ITEMS_TO_SHOW + 2).fill("Rest"),
        Array(ITEMS_TO_SHOW + 2).fill("Rest"),
        Array(ITEMS_TO_SHOW + 2).fill("Game"),
      ];
    }

    // For each reel, create a mix of options
    const reel1 = Array(ITEMS_TO_SHOW + 2).fill(null).map((_, i) => {
      const options = ["Rest", "Game", ...pendingTasks.map(t => t.title)];
      return options[i % options.length];
    });

    const reel2 = Array(ITEMS_TO_SHOW + 2).fill(null).map((_, i) => {
      const options = ["Game", "Rest", ...pendingTasks.map(t => t.title)];
      return options[i % options.length];
    });

    const reel3 = Array(ITEMS_TO_SHOW + 2).fill(null).map((_, i) => {
      const options = [...pendingTasks.map(t => t.title), "Rest", "Game"];
      return options[i % options.length];
    });

    return [reel1, reel2, reel3];
  };

  useEffect(() => {
    const reels = generateReelItems();
    setDisplayReels(reels);
  }, [tasks]);

  useEffect(() => {
    if (!isSpinning) return;

    const pendingTasks = tasks.filter((t) => !t.completed);

    setSelectedResult(null);

    // Determine the result based on weighted probability
    const category = selectWeightedCategory(pendingTasks.length);

    // Determine what to display
    let displayResult: string = category;

    if (category === "Tasks" && pendingTasks.length > 0) {
      const randomTask = pendingTasks[Math.floor(Math.random() * pendingTasks.length)];
      displayResult = randomTask.title;
    }

    // Find the index of the result in the reels
    const categoryIndex = displayReels[0].indexOf(displayResult);
    const adjustedIndex = categoryIndex >= 0 ? categoryIndex : 0;

    // Generate random rotations for each reel with slight offset
    const rotations = [
      -SPIN_DURATION * (isLarge ? 110 : 70) + (adjustedIndex * (isLarge ? 110 : 70)),
      -SPIN_DURATION * (isLarge ? 110 : 70) + (adjustedIndex * (isLarge ? 110 : 70)) - (isLarge ? 33 : 20),
      -SPIN_DURATION * (isLarge ? 110 : 70) + (adjustedIndex * (isLarge ? 110 : 70)) - (isLarge ? 66 : 40),
    ];

    setReelRotations(rotations);

    // After spin duration, show result
    const timer = setTimeout(() => {
      setSelectedResult(displayResult);
      onComplete(displayResult);
    }, SPIN_DURATION * 1000);

    return () => clearTimeout(timer);
  }, [isSpinning, tasks, onComplete, isLarge, displayReels]);

  const itemHeightClass = isLarge ? "h-24" : "h-12";
  const itemTextClass = isLarge ? "text-2xl" : "text-sm";
  const resultTextClass = isLarge ? "text-4xl" : "text-2xl";
  const gapClass = isLarge ? "gap-4" : "gap-3";

  return (
    <div className={`flex flex-col items-center justify-center gap-8 py-8 ${isLarge ? "w-full" : ""}`}>
      {/* Reel Machine Container - Casino Style */}
      <div className={`relative overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 border-8 border-yellow-600 rounded-2xl p-8 w-full max-w-2xl shadow-2xl flex justify-center items-center`}>
        {/* Top Bezel */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-yellow-500 to-yellow-700 rounded-t-2xl pointer-events-none z-30" />

        {/* Inner Glass Reflection */}
        <div className="absolute top-8 left-0 right-0 h-12 bg-gradient-to-b from-white via-transparent to-transparent opacity-20 pointer-events-none z-20" />

        {/* Middle Indicator Line */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none w-full flex justify-center">
          <div className={`flex items-center justify-center gap-8 w-full px-8`}>
            <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
            <div className={`text-yellow-300 drop-shadow-lg ${isLarge ? "text-4xl" : "text-2xl"} font-bold`}>
              ▼
            </div>
            <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
          </div>
        </div>

        {/* Three Reels Container */}
        <div className={`flex justify-center items-start gap-6 relative z-10`}>
          {[0, 1, 2].map((reelIndex) => (
            <div
              key={reelIndex}
              className="relative overflow-hidden bg-gray-950 border-4 border-yellow-500 rounded-lg flex flex-col items-center"
              style={{
                width: isLarge ? "140px" : "100px",
                height: isLarge ? "260px" : "160px",
              }}
            >
              {/* Reel Items */}
              <motion.div
                animate={
                  isSpinning
                    ? { y: reelRotations[reelIndex] }
                    : { y: 0 }
                }
                transition={{
                  duration: SPIN_DURATION,
                  ease: "easeOut",
                }}
                className={`flex flex-col ${gapClass}`}
              >
                {displayReels[reelIndex].map((item, idx) => (
                  <div
                    key={`${reelIndex}-${idx}`}
                    className={`${itemHeightClass} flex items-center justify-center ${itemTextClass} font-black text-white bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg border-3 border-yellow-500 drop-shadow-lg flex-shrink-0 w-full px-2 text-center line-clamp-2`}
                  >
                    {item}
                  </div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Bottom Bezel */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-yellow-500 to-yellow-700 rounded-b-2xl pointer-events-none z-30" />
      </div>

      {/* Result Display */}
      {selectedResult && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="text-center"
        >
          <p className={`uppercase tracking-widest font-black mb-3 ${isLarge ? "text-lg text-yellow-600" : "text-xs text-gray-600"}`}>
            You got:
          </p>
          <p className={`font-black ${resultTextClass} ${isLarge ? "text-yellow-600" : "text-gray-800"}`}>
            {selectedResult}
          </p>
        </motion.div>
      )}

      {/* Spinning Indicator */}
      {isSpinning && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-3 border-yellow-600 border-t-yellow-300 rounded-full"
        />
      )}
    </div>
  );
}

