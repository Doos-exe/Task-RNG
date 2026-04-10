"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import { selectWeightedCategory, Category, filterPityItems, selectWeightedItem, checkForcedCategory } from "@/lib/probability";
import { useTaskStore } from "@/lib/store";

interface SlotMachineProps {
  isSpinning: boolean;
  onComplete: (result: Category | string) => void;
  size?: "small" | "large";
}

const SPIN_DURATION = 5;
const ITEM_HEIGHT_LARGE = 96;
const ITEM_HEIGHT_SMALL = 48;
const GAP_LARGE = 16;
const GAP_SMALL = 12;

export function SlotMachine({ isSpinning, onComplete, size = "small" }: SlotMachineProps) {
  const tasks = useTaskStore((state) => state.tasks);
  const leisures = useTaskStore((state) => state.leisures);
  const spinHistory = useTaskStore((state) => state.spinHistory);
  const taskConsecutiveCount = useTaskStore((state) => state.taskConsecutiveCount);
  const leisureConsecutiveCount = useTaskStore((state) => state.leisureConsecutiveCount);
  const addToSpinHistory = useTaskStore((state) => state.addToSpinHistory);
  const recordSpinOutcome = useTaskStore((state) => state.recordSpinOutcome);
  const [reelRotations, setReelRotations] = useState([0, 0, 0]);
  const [displayReels, setDisplayReels] = useState<Array<{ title: string; emoji: string }[]>>([[], [], []]);
  const recordedOutcomeRef = useRef(false);

  const isLarge = size === "large";
  const itemHeight = isLarge ? ITEM_HEIGHT_LARGE : ITEM_HEIGHT_SMALL;
  const gap = isLarge ? GAP_LARGE : GAP_SMALL;
  const itemSize = itemHeight + gap;

  const leisureTitles = useMemo(() => leisures.map((l) => l.title), [leisures]);

  const titleToEmojiMap = useMemo(() => {
    const map = new Map<string, string>();
    leisures.forEach((l) => map.set(l.title, l.emoji));
    tasks.forEach((t) => map.set(t.title, t.emoji));
    return map;
  }, [leisures, tasks]);

  // Generate reel items - continuous repeating list
  const { reelItems } = useMemo(() => {
    const pendingTasks = tasks.filter((t) => !t.completed);

    if (leisureTitles.length === 0) {
      return { reelItems: [[], [], []] };
    }

    const allOptions = [...leisureTitles, ...pendingTasks.map(t => t.title)];

    if (allOptions.length === 0) {
      return { reelItems: [[], [], []] };
    }

    // Create 50 items per reel - enough for multiple spins without gaps
    const createReel = (offset: number = 0) => {
      return Array(50)
        .fill(null)
        .map((_, i) => {
          const title = allOptions[(i + offset) % allOptions.length];
          return {
            title,
            emoji: titleToEmojiMap.get(title) || "🎯",
          };
        });
    };

    return {
      reelItems: [createReel(0), createReel(1), createReel(2)],
    };
  }, [tasks, leisureTitles, titleToEmojiMap]);

  useEffect(() => {
    if (displayReels[0].length === 0 && reelItems[0].length > 0) {
      setDisplayReels(reelItems);
    }
  }, [reelItems, displayReels]);

  useEffect(() => {
    if (!isSpinning) {
      setReelRotations([0, 0, 0]);
      recordedOutcomeRef.current = false;
      return;
    }

    const pendingTasks = tasks.filter((t) => !t.completed);

    // Determine result with pity system
    let displayResult: string = "";
    let isTaskResult = false;

    // Check if a category should be forced (4 consecutive = guarantee opposite)
    const forcedCategory = checkForcedCategory(taskConsecutiveCount, leisureConsecutiveCount);

    let category: Category;
    if (forcedCategory) {
      category = forcedCategory;
    } else {
      // Normal weighted selection
      category = selectWeightedCategory(pendingTasks.length, leisureTitles);
    }

    if (category === "Tasks" && pendingTasks.length > 0) {
      const availableTasks = filterPityItems(
        pendingTasks.map(t => t.title),
        spinHistory
      );
      displayResult = availableTasks.length > 0
        ? availableTasks[Math.floor(Math.random() * availableTasks.length)]
        : pendingTasks[Math.floor(Math.random() * pendingTasks.length)].title;
      isTaskResult = true;
    } else if (category !== "Tasks" && leisureTitles.length > 0) {
      const availableLeisures = filterPityItems(leisureTitles, spinHistory);
      displayResult = availableLeisures.length > 0
        ? availableLeisures[Math.floor(Math.random() * availableLeisures.length)]
        : leisureTitles[Math.floor(Math.random() * leisureTitles.length)];
      isTaskResult = false;
    }

    // Record outcome only once per spin
    if (!recordedOutcomeRef.current) {
      recordedOutcomeRef.current = true;
      recordSpinOutcome(isTaskResult);
    }

    // Find target positions in each reel
    const rotations = displayReels.map((reel) => {
      // Find the first occurrence of the result
      const resultIndex = reel.findIndex(item => item.title === displayResult);
      const targetIndex = resultIndex >= 0 ? resultIndex : 0;

      // Calculate: we want the item at targetIndex to sit at position index 1 (middle)
      // Currently, items at index 0, 1, 2 are visible
      // We need to move so that targetIndex becomes index 1
      const spinDistance = (targetIndex - 1) * itemSize;

      // Add multiple full spins before landing
      const fullSpins = 8;
      const totalDistance = fullSpins * reel.length * itemSize + spinDistance;

      return -totalDistance;
    });

    setReelRotations(rotations);

    // Call onComplete at end of animation
    const timer = setTimeout(() => {
      addToSpinHistory(displayResult);
      onComplete(displayResult);
    }, SPIN_DURATION * 1000);

    return () => clearTimeout(timer);
  }, [isSpinning, tasks, leisures, onComplete, itemSize, spinHistory, addToSpinHistory, recordSpinOutcome]);

  const itemHeightClass = isLarge ? "h-24" : "h-12";
  const itemTextClass = isLarge ? "text-2xl" : "text-sm";
  const gapClass = isLarge ? "gap-4" : "gap-3";

  return (
    <div className={`flex flex-col items-center justify-center gap-8 py-8 ${isLarge ? "w-full" : ""}`}>
      <div className={`relative overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 border-8 border-yellow-600 rounded-2xl p-8 w-full max-w-2xl shadow-2xl flex justify-center items-center`}>
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-yellow-500 to-yellow-700 rounded-t-2xl pointer-events-none z-30" />

        <div className="absolute top-8 left-0 right-0 h-12 bg-gradient-to-b from-white via-transparent to-transparent opacity-20 pointer-events-none z-20" />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none w-full flex justify-center">
          <div className={`flex items-center justify-center gap-8 w-full px-8`}>
            <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
            <div className={`text-yellow-300 drop-shadow-lg ${isLarge ? "text-4xl" : "text-2xl"} font-bold`}>
              ▼
            </div>
            <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
          </div>
        </div>

        <div className={`flex justify-center items-start gap-6 relative z-10`}>
          {[0, 1, 2].map((reelIndex) => (
            <div
              key={reelIndex}
              className="relative overflow-hidden bg-gray-950 border-4 border-yellow-500 rounded-lg flex flex-col items-center"
              style={{
                width: isLarge ? "140px" : "100px",
                height: isLarge ? `${3 * (ITEM_HEIGHT_LARGE + GAP_LARGE)}px` : `${3 * (ITEM_HEIGHT_SMALL + GAP_SMALL)}px`,
              }}
            >
              <motion.div
                animate={
                  isSpinning
                    ? { y: reelRotations[reelIndex] }
                    : { y: 0 }
                }
                transition={{
                  duration: SPIN_DURATION,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className={`flex flex-col ${gapClass}`}
              >
                {displayReels[reelIndex].map((item, idx) => (
                  <div
                    key={`${reelIndex}-${idx}`}
                    className={`${itemHeightClass} flex items-center justify-center ${itemTextClass} font-black text-white bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg border-3 border-yellow-500 drop-shadow-lg flex-shrink-0 w-full px-2 text-center`}
                  >
                    {item.emoji}
                  </div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-yellow-500 to-yellow-700 rounded-b-2xl pointer-events-none z-30" />
      </div>

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
