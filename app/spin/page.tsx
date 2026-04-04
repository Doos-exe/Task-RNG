"use client";

import { useState, useCallback } from "react";
import { SlotMachine } from "@/components/SlotMachine";
import { InteractiveHandle } from "@/components/InteractiveHandle";
import { ResultTimer } from "@/components/ResultTimer";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { useTaskStore } from "@/lib/store";

export default function SpinPage() {
  const { coins, addCoins, resetCoins, pendingCount, getSkipCost, useSkip } = useTaskStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  // Confirmation dialogs
  const [showCollectConfirm, setShowCollectConfirm] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showInsufficientCoinsDialog, setShowInsufficientCoinsDialog] = useState(false);

  const pendingTasks = pendingCount();
  const canSpin = pendingTasks > 0 || coins > 0;

  const handleSpinComplete = useCallback((result: string) => {
    setCurrentResult(result);
    setIsSpinning(false);
    setTimerActive(true);
  }, []);

  const handleSpin = useCallback(() => {
    if (!isSpinning) {
      // If timer is active, treat it as a skip attempt
      if (timerActive) {
        handleSkipAttempt();
      } else {
        // Normal spin
        if (canSpin) {
          setCurrentResult(null);
          setIsSpinning(true);
        }
      }
    }
  }, [isSpinning, canSpin, timerActive]);

  const handleSkipAttempt = () => {
    const cost = getSkipCost();
    if (coins < cost) {
      setShowInsufficientCoinsDialog(true);
    } else {
      setShowSkipConfirm(true);
    }
  };

  const handleConfirmSkip = () => {
    const cost = getSkipCost();
    if (useSkip()) {
      setShowSkipConfirm(false);
      setCurrentResult(null);
      setTimerActive(false);
    }
  };

  const handleCollectAttempt = () => {
    setShowCollectConfirm(true);
  };

  const handleConfirmCollect = () => {
    if (currentResult && pendingTasks > 0) {
      addCoins(1);
      setShowCollectConfirm(false);
      setCurrentResult(null);
      setTimerActive(false);
    }
  };

  const handleResetCoins = () => {
    if (confirm("Are you sure you want to reset your coins to 0?")) {
      resetCoins();
    }
  };

  const handleTaskComplete = () => {
    setTimerActive(false);
  };

  const isTaskResult = currentResult && currentResult !== "Rest" && currentResult !== "Game";
  const hasNoPendingTasks = pendingTasks === 0;

  return (
    <main className="ml-48 min-h-screen bg-gradient-to-br from-app-lightMain to-gray-50 dark:from-app-darkMain dark:to-gray-900 text-app-lightText dark:text-app-darkText p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-5xl font-black tracking-wider">🎰 TASK RNG</h1>
          <div className="text-right flex items-center gap-6">
            <div>
              <p className="text-2xl font-black text-yellow-600">💰 {coins} Coins</p>
              <button
                onClick={handleResetCoins}
                className="text-xs font-bold text-gray-500 hover:text-red-600 transition mt-1 uppercase tracking-widest"
              >
                Reset Coins
              </button>
            </div>
          </div>
        </div>

        {/* No Tasks Warning */}
        {hasNoPendingTasks && !currentResult && (
          <div className="mb-8 p-6 bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-600 rounded-lg text-center">
            <p className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
              ⚠️ No pending tasks! Add tasks to continue spinning.
            </p>
          </div>
        )}

        {/* Main Slot Machine Area - Centered */}
        <div className="flex flex-col items-center justify-center gap-16">
          {/* Slot Machine with Handle - Casino Style */}
          <div className="flex items-center gap-16">
            {/* Handle on Left */}
            <InteractiveHandle
              onSpin={handleSpin}
              isSpinning={isSpinning}
              canSpin={canSpin}
              isTimerActive={timerActive}
            />

            {/* Slot Machine in Center */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-12 shadow-2xl border-8 border-yellow-600 relative">
              {/* Decorative lights */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-3">
                <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400 animate-pulse" />
                <div className="w-4 h-4 rounded-full bg-red-400 shadow-lg shadow-red-400 animate-pulse-delay-1" />
                <div className="w-4 h-4 rounded-full bg-blue-400 shadow-lg shadow-blue-400 animate-pulse-delay-2" />
              </div>

              <SlotMachine
                isSpinning={isSpinning}
                onComplete={handleSpinComplete}
                size="large"
              />

              {/* Decorative lights bottom */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-400 shadow-lg shadow-blue-400 animate-pulse" />
                <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400 animate-pulse-delay-1" />
                <div className="w-4 h-4 rounded-full bg-red-400 shadow-lg shadow-red-400 animate-pulse-delay-2" />
              </div>
            </div>

            {/* Result Display on Right */}
            <div className="flex flex-col items-center gap-8">
              {/* Result Window */}
              <div className="w-40 h-32 bg-gradient-to-b from-yellow-300 to-yellow-200 rounded-2xl border-4 border-yellow-600 flex flex-col items-center justify-center p-4 shadow-lg">
                {currentResult ? (
                  <div className="text-center">
                    <p className="text-xs font-black text-yellow-700 uppercase mb-2 tracking-widest">
                      Result
                    </p>
                    <p className="text-sm font-black text-gray-900 break-words line-clamp-4">
                      {currentResult}
                    </p>
                  </div>
                ) : (
                  <p className="text-lg font-bold text-gray-500">?</p>
                )}
              </div>

              {/* Collect Coins Button - Shows for Task results while timer is active */}
              {isTaskResult && timerActive && (
                <button
                  onClick={handleCollectAttempt}
                  className="w-20 h-20 rounded-full font-black text-2xl transition-all shadow-xl transform hover:scale-110 active:scale-95 bg-gradient-to-br from-green-400 to-green-600 text-white cursor-pointer border-4 border-green-700 hover:from-green-300 hover:to-green-500"
                  title="Finish task early and collect coin"
                >
                  💰
                </button>
              )}
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-8 text-center">
            {timerActive ? (
              <p className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">
                {isTaskResult
                  ? "⏱️ Task Timer - Pull handle to skip or click 💰"
                  : "⏱️ Activity Timer - Pull handle to skip"}
              </p>
            ) : isSpinning ? (
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                🎰 Spinning...
              </p>
            ) : hasNoPendingTasks ? (
              <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest">
                ⚠️ No tasks available - Add tasks first
              </p>
            ) : (
              <p className="text-lg font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                ↓ Drag the handle down to spin the machine ↓
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Confirmations */}
      <ConfirmationDialog
        isOpen={showCollectConfirm}
        title="Finish Task Early?"
        message={`Finish this task now and collect 1 coin?`}
        confirmText="Collect Coin"
        cancelText="Keep Going"
        onConfirm={handleConfirmCollect}
        onCancel={() => setShowCollectConfirm(false)}
        type="success"
      />

      <ConfirmationDialog
        isOpen={showSkipConfirm}
        title="Skip Activity?"
        message={`Skip this activity now? This will cost ${getSkipCost()} coins.`}
        confirmText={`Skip for ${getSkipCost()} coins`}
        cancelText="Cancel"
        onConfirm={handleConfirmSkip}
        onCancel={() => setShowSkipConfirm(false)}
        type="warning"
      />

      <ConfirmationDialog
        isOpen={showInsufficientCoinsDialog}
        title="Not Enough Coins"
        message={`You need ${getSkipCost()} coins to skip, but you only have ${coins} coins. Finish the timer or collect coins by completing tasks early.`}
        confirmText="OK"
        cancelText=""
        onConfirm={() => setShowInsufficientCoinsDialog(false)}
        onCancel={() => setShowInsufficientCoinsDialog(false)}
        type="warning"
      />

      {/* Timer at Bottom */}
      <ResultTimer result={currentResult} isStarted={timerActive} onTaskComplete={handleTaskComplete} />
    </main>
  );
}
