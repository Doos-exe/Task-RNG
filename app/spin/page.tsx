"use client";

import { useState, useCallback } from "react";
import { SlotMachine } from "@/components/SlotMachine";
import { useTaskStore } from "@/lib/store";

export default function SpinPage() {
  const { coins, addCoins } = useTaskStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentResult, setCurrentResult] = useState<string | null>(null);

  const handleSpinComplete = useCallback((result: string) => {
    setCurrentResult(result);
    setIsSpinning(false);
  }, []);

  const handleCollectCoins = () => {
    if (currentResult) {
      addCoins(1);
    }
  };

  const handleSpin = () => {
    if (!isSpinning) {
      setCurrentResult(null);
      setIsSpinning(true);
    }
  };

  return (
    <main className="min-h-screen bg-task-lightBg dark:bg-task-main dark:text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Coin Counter */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold dark:text-white">TASK RNG</h1>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Coins</p>
            <p className="text-3xl font-bold text-task-sidebar dark:text-yellow-400">
              {coins}
            </p>
          </div>
        </div>

        {/* Slot Machine Container */}
        <div className="flex gap-8 items-stretch">
          {/* Slot Machine */}
          <div className="flex-1">
            <SlotMachine
              isSpinning={isSpinning}
              onComplete={handleSpinComplete}
            />
          </div>

          {/* Right Side Controls */}
          <div className="flex flex-col justify-center gap-8 w-32">
            {/* Handle and Button Area */}
            <div className="flex flex-col items-center gap-4">
              {/* Handle */}
              <div className="w-8 h-32 bg-gray-400 dark:bg-gray-600 rounded-full flex flex-col items-center justify-between cursor-grab active:cursor-grabbing hover:opacity-80 transition">
                <div className="w-6 h-6 bg-red-600 dark:bg-red-500 rounded-full mt-2"></div>
              </div>

              {/* Red Button - Collect Coins */}
              <button
                onClick={handleCollectCoins}
                disabled={!currentResult}
                className={`w-16 h-16 rounded-full transition transform ${
                  currentResult
                    ? "bg-red-600 dark:bg-red-500 hover:scale-110 active:scale-95 cursor-pointer hover:brightness-110"
                    : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50"
                }`}
                title="Collect coins from completed spin"
              ></button>
            </div>

            {/* Result Area - White Rectangle */}
            <div className="flex-1 bg-white dark:bg-gray-200 rounded border-2 border-gray-300 dark:border-gray-400 flex items-center justify-center">
              {currentResult ? (
                <div className="text-center p-4">
                  <p className="text-xs text-gray-600 uppercase font-semibold">
                    Your Task:
                  </p>
                  <p className="text-sm font-bold text-black mt-2 break-words">
                    {currentResult}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-500">Result</p>
              )}
            </div>
          </div>
        </div>

        {/* Spin Button */}
        <div className="mt-8">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition ${
              isSpinning
                ? "bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed"
                : "bg-task-sidebar dark:bg-red-600 text-white hover:opacity-90 active:scale-95"
            }`}
          >
            {isSpinning ? "SPINNING..." : "SPIN"}
          </button>
        </div>
      </div>
    </main>
  );
}
