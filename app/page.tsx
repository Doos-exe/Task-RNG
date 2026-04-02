"use client";

import { useState, useCallback } from "react";
import { SlotMachine } from "@/components/SlotMachine";
import { CommitmentTimer } from "@/components/CommitmentTimer";
import { ProbabilityVisualizer } from "@/components/ProbabilityVisualizer";
import { TaskList } from "@/components/TaskList";
import { useTaskStore } from "@/lib/store";

export default function Home() {
  const tasks = useTaskStore((state) => state.tasks);
  const pendingCount = useTaskStore((state) => state.pendingCount());

  const [isSpinning, setIsSpinning] = useState(false);
  const [isCommitted, setIsCommitted] = useState(false);
  const [currentResult, setCurrentResult] = useState<string | null>(null);

  const handleSpin = () => {
    if (!isCommitted && !isSpinning) {
      setIsSpinning(true);
    }
  };

  const handleSpinComplete = useCallback((result: string) => {
    setCurrentResult(result);
    setIsSpinning(false);
    setIsCommitted(true);
  }, []);

  const handleTimerComplete = () => {
    setIsCommitted(false);
    setCurrentResult(null);
  };

  return (
    <main className="min-h-screen bg-notion-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-notion-text mb-2">
            Fate-Tasker
          </h1>
          <p className="text-notion-secondary">
            Let destiny decide your next hour of productivity
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Slot Machine & Controls */}
          <div className="space-y-6 flex flex-col">
            {/* Slot Machine */}
            <div className="flex-1">
              <SlotMachine isSpinning={isSpinning} onComplete={handleSpinComplete} />
            </div>

            {/* Spin Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning || isCommitted || pendingCount === 0}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition ${
                isCommitted || isSpinning || pendingCount === 0
                  ? "bg-notion-border text-notion-secondary cursor-not-allowed"
                  : "bg-notion-text text-white hover:opacity-90 active:scale-95"
              }`}
            >
              {isSpinning
                ? "Spinning..."
                : isCommitted
                  ? "Committed"
                  : pendingCount === 0
                    ? "No Tasks"
                    : "Spin for Destiny"}
            </button>

            {/* Commitment Timer */}
            {isCommitted && (
              <CommitmentTimer
                isActive={isCommitted}
                onComplete={handleTimerComplete}
              />
            )}
          </div>

          {/* Right Column - Tasks & Probability */}
          <div className="space-y-6 flex flex-col">
            {/* Probability Visualizer */}
            <ProbabilityVisualizer pendingTaskCount={pendingCount} />

            {/* Task List */}
            <div className="flex-1">
              <TaskList />
            </div>
          </div>
        </div>

        {/* Current Result Display */}
        {isCommitted && currentResult && (
          <div className="mt-12 p-6 bg-white border border-notion-border rounded-lg text-center">
            <p className="text-xs uppercase tracking-wide text-notion-secondary mb-2">
              You're committed to:
            </p>
            <p className="text-2xl font-bold text-notion-text">{currentResult}</p>
            <p className="text-xs text-notion-secondary mt-3">
              Complete this activity before you can spin again.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-notion-secondary border-t border-notion-border pt-6">
          <p>Made with coffee and destiny ☕</p>
        </div>
      </div>
    </main>
  );
}
