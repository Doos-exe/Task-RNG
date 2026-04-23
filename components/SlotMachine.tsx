"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { selectWeightedCategory, Category, filterPityItems, checkForcedCategory } from "@/lib/probability";
import { useTaskStore } from "@/lib/store";

interface SlotMachineProps {
  isSpinning: boolean;
  onComplete: (result: Category | string) => void;
  size?: "small" | "large";
}

const SPIN_DURATION = 5;
const ITEM_HEIGHT = 96;
const ITEM_GAP = 10;
const ITEM_STRIDE = ITEM_HEIGHT + ITEM_GAP;            // 106px — distance between item tops
const WINDOW_HEIGHT = 3 * ITEM_HEIGHT + 2 * ITEM_GAP; // 308px — exactly 3 items visible

// The result item is placed at RESULT_INDEX in every strip.
// Item k sits at strip-y = k * ITEM_STRIDE.
// We want it at window-y = ITEM_STRIDE (centre of the 3-item window).
// Required translate-y: ITEM_STRIDE - RESULT_INDEX * ITEM_STRIDE = -(RESULT_INDEX - 1) * ITEM_STRIDE
// Setting RESULT_INDEX = PREFILL_COUNT + 1  →  target-y = -PREFILL_COUNT * ITEM_STRIDE
const PREFILL_COUNT = 300;
const RESULT_INDEX  = PREFILL_COUNT + 1;
const TARGET_Y      = -(PREFILL_COUNT * ITEM_STRIDE); // -31 800 px

// Payline: gold border around the centre slot (window-y = ITEM_STRIDE…ITEM_STRIDE+ITEM_HEIGHT)
const PAYLINE_TOP    = ITEM_STRIDE;
const PAYLINE_HEIGHT = ITEM_HEIGHT;

// Cascade: each reel stops a bit later, creating a classic slot-machine cascade
const REEL_DURATIONS = [SPIN_DURATION - 1.5, SPIN_DURATION - 0.7, SPIN_DURATION];
const REEL_EASE: [number, number, number, number] = [0.08, 0.38, 0.18, 1.0];

type ReelItem = { title: string; emoji: string };

export function SlotMachine({ isSpinning, onComplete }: SlotMachineProps) {
  const tasks               = useTaskStore((s) => s.tasks);
  const leisures            = useTaskStore((s) => s.leisures);
  const spinHistory         = useTaskStore((s) => s.spinHistory);
  const taskConsecutiveCount    = useTaskStore((s) => s.taskConsecutiveCount);
  const leisureConsecutiveCount = useTaskStore((s) => s.leisureConsecutiveCount);
  const addToSpinHistory    = useTaskStore((s) => s.addToSpinHistory);

  // strips: full 303-item scrolling strip, regenerated on every spin
  const [strips, setStrips] = useState<ReelItem[][]>([[], [], []]);
  // animY: where each strip's motion.div should end up (0 = idle, TARGET_Y = post-spin)
  const [animY, setAnimY]   = useState(0);
  // spinKey: incrementing this re-mounts each motion.div → y resets to 0 before animating
  const [spinKey, setSpinKey] = useState(0);

  const leisureTitles = useMemo(() => leisures.map((l) => l.title), [leisures]);

  const titleToEmoji = useMemo(() => {
    const map = new Map<string, string>();
    leisures.forEach((l) => map.set(l.title, l.emoji));
    tasks.forEach((t)   => map.set(t.title, t.emoji));
    return map;
  }, [leisures, tasks]);

  // Idle strip: 3 items, shown before the first spin
  const idleStrips = useMemo((): ReelItem[][] => {
    const pending = tasks.filter((t) => !t.completed);
    const opts = [...leisureTitles, ...pending.map((t) => t.title)];
    if (opts.length === 0) return [[], [], []];
    return [0, 1, 2].map((off) =>
      Array(3).fill(null).map((_, i) => {
        const title = opts[(i + off) % opts.length];
        return { title, emoji: titleToEmoji.get(title) ?? "🎯" };
      })
    );
  }, [tasks, leisureTitles, titleToEmoji]);

  useEffect(() => {
    if (!isSpinning) return;

    const pending = tasks.filter((t) => !t.completed);
    const opts    = [...leisureTitles, ...pending.map((t) => t.title)];
    if (opts.length === 0) return;

    // Weighted / pity-aware result selection
    const forced   = checkForcedCategory(taskConsecutiveCount, leisureConsecutiveCount);
    const category = forced ?? selectWeightedCategory(pending.length, leisureTitles);

    let result = "";
    if (category === "Tasks" && pending.length > 0) {
      const pool    = filterPityItems(pending.map((t) => t.title), spinHistory);
      const choices = pool.length > 0 ? pool : pending.map((t) => t.title);
      result = choices[Math.floor(Math.random() * choices.length)];
    } else if (category !== "Tasks" && leisureTitles.length > 0) {
      const pool    = filterPityItems(leisureTitles, spinHistory);
      const choices = pool.length > 0 ? pool : leisureTitles;
      result = choices[Math.floor(Math.random() * choices.length)];
    }

    // Build each strip: 300 random scroll items + [before, result, after]
    // The result lands at RESULT_INDEX = 301, which maps to window-y = ITEM_STRIDE = payline centre
    const newStrips: ReelItem[][] = [0, 1, 2].map((off) => {
      const strip: ReelItem[] = Array(PREFILL_COUNT).fill(null).map((_, i) => {
        const title = opts[(i + off) % opts.length];
        return { title, emoji: titleToEmoji.get(title) ?? "🎯" };
      });
      const before = opts[(PREFILL_COUNT + off - 1 + opts.length) % opts.length];
      const after  = opts[(PREFILL_COUNT + off + 1) % opts.length];
      strip.push({ title: before, emoji: titleToEmoji.get(before) ?? "🎯" });
      strip.push({ title: result, emoji: titleToEmoji.get(result) ?? "🎯" });
      strip.push({ title: after,  emoji: titleToEmoji.get(after)  ?? "🎯" });
      return strip;
    });

    // Apply in one batch: new strips + new key (forces y→0 reset) + animate to TARGET_Y
    setStrips(newStrips);
    setAnimY(TARGET_Y);
    setSpinKey((k) => k + 1);

    const timer = setTimeout(() => {
      addToSpinHistory(result);
      onComplete(result);
    }, SPIN_DURATION * 1000);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning]);

  const displayStrips = strips[0].length > 0 ? strips : idleStrips;

  return (
    <div className="flex items-center justify-center gap-3">
      <span className="select-none text-xl font-black text-yellow-400 drop-shadow-[0_0_6px_rgba(234,179,8,0.8)]">▶</span>

      <div className="flex gap-3">
        {[0, 1, 2].map((reelIdx) => (
          <div key={reelIdx} className="flex flex-col items-center gap-2">
            {/* Reel window */}
            <div
              className="relative overflow-hidden rounded-lg border-[3px] border-gray-500 bg-black"
              style={{
                width: 130,
                height: WINDOW_HEIGHT,
                boxShadow: "inset 0 6px 16px rgba(0,0,0,0.9), inset 0 -6px 16px rgba(0,0,0,0.9)",
              }}
            >
              {/*
               * Changing `key` re-mounts the motion.div so framer-motion
               * treats `initial` as the genuine starting point (y = 0),
               * then animates to TARGET_Y over the reel's duration.
               */}
              <motion.div
                key={spinKey}
                initial={{ y: 0 }}
                animate={{ y: animY }}
                transition={{
                  duration: isSpinning ? REEL_DURATIONS[reelIdx] : 0,
                  ease: REEL_EASE,
                }}
                className="absolute top-0 left-0 right-0 flex flex-col"
                style={{ gap: ITEM_GAP }}
              >
                {displayStrips[reelIdx].map((item, idx) => (
                  <div
                    key={idx}
                    style={{ height: ITEM_HEIGHT, flexShrink: 0 }}
                    className="flex flex-col items-center justify-center rounded-md border border-indigo-500/60 bg-gradient-to-b from-indigo-600 via-indigo-800 to-indigo-950 px-2"
                  >
                    <span className="select-none text-3xl leading-none">{item.emoji}</span>
                    <span
                      className="mt-1.5 w-full text-center text-[10px] font-bold leading-tight text-white/90 line-clamp-2"
                      style={{ fontFamily: "Courier New, monospace" }}
                    >
                      {item.title}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* Top fade */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-10"
                style={{ height: 82, background: "linear-gradient(to bottom, rgba(0,0,0,0.93) 25%, transparent)" }}
              />
              {/* Bottom fade */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
                style={{ height: 82, background: "linear-gradient(to top, rgba(0,0,0,0.93) 25%, transparent)" }}
              />

              {/* Payline — gold border exactly around the centre item */}
              <div
                className="pointer-events-none absolute inset-x-0 z-20"
                style={{ top: PAYLINE_TOP, height: PAYLINE_HEIGHT }}
              >
                <div
                  className="h-full w-full"
                  style={{
                    borderTop: "2px solid rgba(234,179,8,0.9)",
                    borderBottom: "2px solid rgba(234,179,8,0.9)",
                    boxShadow: "0 -2px 10px rgba(234,179,8,0.45), 0 2px 10px rgba(234,179,8,0.45)",
                  }}
                />
              </div>
            </div>

            {/* Spinning indicator dot */}
            <div
              className="h-1.5 w-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: isSpinning ? "#facc15" : "#374151",
                boxShadow:        isSpinning ? "0 0 6px rgba(250,204,21,0.8)" : "none",
              }}
            />
          </div>
        ))}
      </div>

      <span className="select-none text-xl font-black text-yellow-400 drop-shadow-[0_0_6px_rgba(234,179,8,0.8)]">◀</span>
    </div>
  );
}
