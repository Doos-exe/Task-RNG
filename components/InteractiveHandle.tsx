"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

interface InteractiveHandleProps {
  onSpin: () => void;
  isSpinning: boolean;
  canSpin?: boolean;
  isTimerActive?: boolean;
}

export function InteractiveHandle({ onSpin, isSpinning, canSpin = true, isTimerActive = false }: InteractiveHandleProps) {
  const constraintsRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasTriggeredSpin, setHasTriggeredSpin] = useState(false);

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    if (info.offset.y > 60 && !hasTriggeredSpin && !isSpinning && canSpin) {
      setHasTriggeredSpin(true);
      onSpin();
      setTimeout(() => setHasTriggeredSpin(false), 3500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-7">
      <div ref={constraintsRef} className="relative flex h-72 w-24 items-start justify-center">
        <div className="absolute left-1/2 top-0 h-64 w-4 -translate-x-1/2 rounded-full bg-gradient-to-b from-slate-400 via-slate-600 to-slate-900 shadow-xl" />
        <div className="absolute left-1/2 top-0 h-2 w-16 -translate-x-1/2 rounded-full bg-amber-200/70 shadow-[0_0_18px_rgba(224,177,79,0.7)]" />
        <motion.div
          drag={canSpin ? "y" : false}
          dragConstraints={{ top: 0, bottom: 215 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          onDragStart={() => setIsDragging(true)}
          animate={isSpinning ? { y: 95, rotate: 720 } : { y: 0, rotate: 0 }}
          transition={isSpinning ? { duration: 3, ease: "easeOut" } : { duration: 0.3 }}
          className={`absolute left-1/2 top-0 flex h-[76px] w-[76px] -translate-x-1/2 items-center justify-center rounded-full border-4 border-[#551e29] bg-gradient-to-br from-rose-400 to-rose-700 shadow-[0_12px_24px_rgba(0,0,0,0.4)] transition-all ${isSpinning ? "cursor-not-allowed" : canSpin ? "cursor-grab active:cursor-grabbing hover:scale-110" : "cursor-not-allowed opacity-50"}`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-rose-200/60 bg-gradient-to-br from-rose-300 to-rose-600 shadow-inner">
            <span className="text-2xl" aria-hidden="true">🎰</span>
          </div>
        </motion.div>
      </div>

      {!isSpinning && (
        <div className="text-center">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--app-muted)]">
            {canSpin ? isTimerActive ? "Pull to skip" : "Drag to spin" : "No tasks available"}
          </p>
          {canSpin && <p className="mt-1 text-xs text-[var(--app-muted)]">Grab the lever and commit.</p>}
        </div>
      )}
    </div>
  );
}
