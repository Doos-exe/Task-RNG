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

      // Reset after animation
      setTimeout(() => {
        setHasTriggeredSpin(false);
      }, 3500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-12">
      {/* Handle Assembly */}
      <div ref={constraintsRef} className="relative h-80 w-24 flex items-start justify-center">
        {/* Main Handle Pole */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-6 h-72 bg-gradient-to-b from-gray-600 to-gray-700 rounded-full shadow-xl border border-gray-800" />

        {/* Draggable Handle */}
        <motion.div
          drag={canSpin ? "y" : false}
          dragConstraints={constraintsRef}
          dragElastic={0.3}
          onDragEnd={handleDragEnd}
          onDragStart={() => setIsDragging(true)}
          animate={isSpinning ? { y: 100, rotate: 720 } : { y: 0, rotate: 0 }}
          transition={isSpinning ? { duration: 3, ease: "easeOut" } : { duration: 0.3 }}
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 border-4 border-red-900 shadow-2xl flex items-center justify-center transform transition-all ${
            isSpinning
              ? "cursor-not-allowed"
              : canSpin
                ? "cursor-grab active:cursor-grabbing hover:scale-110"
                : "cursor-not-allowed opacity-50"
          }`}
        >
          {/* Handle Interior Design */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-600 border-2 border-red-800 shadow-inner flex items-center justify-center">
            <div className="text-2xl">🎰</div>
          </div>
        </motion.div>
      </div>

      {/* Instructions */}
      {!isSpinning && (
        <div className="text-center">
          <p className={`text-sm font-bold uppercase tracking-wide ${canSpin ? "text-gray-600" : "text-gray-400"}`}>
            {canSpin
              ? isTimerActive
                ? "Pull to Skip"
                : "Drag to Spin"
              : "No tasks available"}
          </p>
        </div>
      )}
    </div>
  );
}

