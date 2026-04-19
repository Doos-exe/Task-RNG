"use client";
/*
  This is the spin page, the slot machine feature where users spin to get a random task or leisure activity.
  Pull the handle to spin the slot machine, earn coins, and check your pity progress.
*/

import { useState, useCallback, useEffect, useRef } from "react";
import { SlotMachine } from "@/components/SlotMachine";
import { InteractiveHandle } from "@/components/InteractiveHandle";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { useTaskStore } from "@/lib/store";

export default function SpinPage() {
  const { coins, addCoins, pendingCount, getSkipCost, useSkip, tasks, removeTask, leisures, checkAndResetSkipCostIfNewDay, taskConsecutiveCount, leisureConsecutiveCount, startTimer, clearTimer, activeTimer, recordSpinOutcome } = useTaskStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [popupResult, setPopupResult] = useState<string | null>(null);

  // Use refs to track the latest state values
  const stateRef = useRef({ currentResult, popupResult, isSpinning });

  // Update refs whenever state changes
  useEffect(() => {
    stateRef.current = { currentResult, popupResult, isSpinning };
  }, [currentResult, popupResult, isSpinning]);

  // Confirmation dialogs
  const [showCollectConfirm, setShowCollectConfirm] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showInsufficientCoinsDialog, setShowInsufficientCoinsDialog] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('spinPageState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.currentResult !== null && state.currentResult !== undefined) {
          setCurrentResult(state.currentResult);
        }
        if (state.popupResult !== null && state.popupResult !== undefined) {
          setPopupResult(state.popupResult);
        }
      } catch (e) {
        console.error('Failed to restore spin page state:', e);
      }
    }
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (currentResult !== null || popupResult !== null || isSpinning) {
      localStorage.setItem('spinPageState', JSON.stringify({
        currentResult,
        popupResult,
        isSpinning,
      }));
    }
  }, [currentResult, popupResult, isSpinning]);

  // Save state when component unmounts using the ref to get latest values
  useEffect(() => {
    return () => {
      if (stateRef.current.currentResult !== null || stateRef.current.popupResult !== null) {
        localStorage.setItem('spinPageState', JSON.stringify(stateRef.current));
      }
    };
  }, []);

  const pendingTasks = pendingCount();
  // Can spin if: (have tasks or coins) AND (no timer OR timer is from this page)
  const canSpin = (pendingTasks > 0 || coins > 0) && (!activeTimer || activeTimer.source === "spin");
  const timerActive = !!activeTimer; // Determine if timer is active from store
  const isTimerFromSpin = activeTimer?.source === "spin"; // Check if timer was from this page
  const isTimerFromDifferentPage = !!activeTimer && activeTimer.source === "roll"; // Only different if explicitly from roll

  // Check if skip cost needs to be reset on a new day
  useEffect(() => {
    checkAndResetSkipCostIfNewDay();
  }, [checkAndResetSkipCostIfNewDay]);

  const handleSpinComplete = useCallback((result: string) => {
    // Delay everything until after animation completes
    setTimeout(() => {
      setCurrentResult(result);
      setIsSpinning(false);

      // Start timer in store with source="spin"
      const isTask = !leisures.some(l => l.title === result);
      const priority = isTask
        ? tasks.find(t => t.title === result)?.priority || "medium"
        : "medium";
      startTimer(result, isTask, priority, "spin");

      // Update pity counter when reward is visible
      recordSpinOutcome(isTask);

      // Show popup immediately after result appears
      setPopupResult(result);

      // Hide popup after 3 seconds
      setTimeout(() => setPopupResult(null), 3000);
    }, 100); // Small delay to ensure animation has settled
  }, [leisures, tasks, startTimer, recordSpinOutcome]);

  const handleSpin = useCallback(() => {
    if (!isSpinning) {
      // If timer is from a different page, prevent spin
      if (isTimerFromDifferentPage) {
        return;
      }
      // If timer is active but from this page, treat it as a skip attempt
      if (timerActive && isTimerFromSpin) {
        handleSkipAttempt();
      } else {
        // Normal spin
        if (canSpin) {
          setCurrentResult(null);
          setIsSpinning(true);
          localStorage.removeItem('spinPageState');
        }
      }
    }
  }, [isSpinning, canSpin, timerActive, isTimerFromSpin, isTimerFromDifferentPage]);

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
      clearTimer();
      localStorage.removeItem('spinPageState');
    }
  };

  const handleCollectAttempt = () => {
    setShowCollectConfirm(true);
  };

  const handleConfirmCollect = () => {
    if (currentResult && pendingTasks > 0) {
      addCoins(1);

      // Auto-delete the task from the database
      if (isTaskResult) {
        const taskToDelete = tasks.find(t => t.title === currentResult);
        if (taskToDelete) {
          removeTask(taskToDelete.id);
        }
      }

      setShowCollectConfirm(false);
      setCurrentResult(null);
      clearTimer();
      localStorage.removeItem('spinPageState');
    }
  };

  const handleTaskComplete = () => {
    clearTimer();
  };

  const isTaskResult = currentResult && !leisures.some(l => l.title === currentResult);
  const hasNoPendingTasks = pendingTasks === 0;

  // Get the priority of the current task result
  const currentTaskPriority = isTaskResult
    ? tasks.find(t => t.title === currentResult)?.priority || "medium"
    : undefined;

  return (
    <main className="ml-96 min-h-screen bg-app-lightMain dark:bg-app-darkMain text-app-lightText dark:text-app-darkText p-8">
      <div className="flex flex-col items-center justify-start min-h-screen -ml-64 pt-4">
        {/* Header - Compact and Centered */}
        <div className="flex flex-col items-center gap-4 mb-8 w-full">
          {/* Top Row: Coins | Title | Pity System */}
          <div className="flex justify-between items-center gap-8 w-full px-8">
            {/* Coins on Far Left */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <p className="text-xl font-black text-yellow-600" style={{ fontFamily: "Courier New, monospace" }}>💰 {coins}</p>
            </div>

            {/* Title in Center */}
            <h1 className="text-4xl font-black tracking-wider flex-shrink-0" style={{ fontFamily: "Courier New, monospace", letterSpacing: "0.15em" }}>📍 PULL TO WIN!</h1>

            {/* Pity System on Far Right - Progress Bars */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <p className="text-xs font-black text-purple-500 uppercase tracking-widest text-right" style={{ fontFamily: "Courier New, monospace" }}>
                🛡️ Pity
              </p>

              {/* Tasks Progress Bar */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-black">📋</span>
                <div className="w-32 h-6 bg-gray-700 border-2 border-blue-500 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
                    style={{ width: `${(taskConsecutiveCount / 4) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-black text-blue-400 w-4 text-right">{taskConsecutiveCount}</span>
              </div>

              {/* Leisures Progress Bar */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-black">🎮</span>
                <div className="w-32 h-6 bg-gray-700 border-2 border-purple-500 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300"
                    style={{ width: `${(leisureConsecutiveCount / 4) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-black text-purple-400 w-4 text-right">{leisureConsecutiveCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Slot Machine Area - Centered */}
        <div className="flex flex-col items-center justify-center gap-16 w-full relative" suppressHydrationWarning>
          {/* No Tasks Warning */}
          {hasNoPendingTasks && !currentResult && (
            <div className="mb-8 p-6 bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-600 rounded-lg text-center" suppressHydrationWarning>
              <p className="text-lg font-bold text-yellow-800 dark:text-yellow-200" style={{ fontFamily: "Courier New, monospace" }}>
                ⚠️ No pending tasks! Add tasks to continue spinning.
              </p>
            </div>
          )}

          {/* Timer from Roll Page Warning */}
          {isTimerFromDifferentPage && (
            <div className="mb-8 p-6 bg-red-100 dark:bg-red-900 border-2 border-red-600 rounded-lg text-center" suppressHydrationWarning>
              <p className="text-lg font-bold text-red-800 dark:text-red-200" style={{ fontFamily: "Courier New, monospace" }}>
                🎲 Active timer from Roll! Go to Roll page to continue or skip.
              </p>
            </div>
          )}

          {/* Slot Machine with Handle - Casino Style */}
          <div className={`flex items-center gap-16 transition-all duration-300`}>
            {/* Handle on Left */}
            <InteractiveHandle
              onSpin={handleSpin}
              isSpinning={isSpinning}
              canSpin={canSpin && !isTimerFromDifferentPage}
              isTimerActive={timerActive && isTimerFromSpin}
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

            {/* Result Display on Right - Hide during spin */}
            {!isSpinning && currentResult && (
              <div className={`flex flex-col items-center gap-8 ${popupResult ? 'blur-sm' : ''} transition-all duration-300`}>
                {/* Result Window */}
                <div className="w-40 h-32 bg-gradient-to-b from-yellow-300 to-yellow-200 rounded-2xl border-4 border-yellow-600 flex flex-col items-center justify-center p-4 shadow-lg">
                  <div className="text-center">
                    <p className="text-xs font-black text-yellow-700 uppercase mb-2 tracking-widest" style={{ fontFamily: "Courier New, monospace" }}>
                      Result
                    </p>
                    <p className="text-sm font-black text-gray-900 break-words line-clamp-4" style={{ fontFamily: "Courier New, monospace" }}>
                      {currentResult}
                    </p>
                  </div>
                </div>

                {/* Collect Coins Button - Shows for Task results */}
                {isTaskResult && (
                  <button
                    onClick={handleCollectAttempt}
                    className="w-20 h-20 rounded-full font-black text-2xl transition-all shadow-xl transform hover:scale-110 active:scale-95 bg-gradient-to-br from-green-400 to-green-600 text-white cursor-pointer border-4 border-green-700 hover:from-green-300 hover:to-green-500"
                    title="Finish task early and collect coin"
                  >
                    💰
                  </button>
                )}
              </div>
            )}
          </div>

        {/* Popup Notification with Backdrop Blur */}
        {popupResult && (
          <>
            {/* Blurred Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

            {/* Popup Card */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
              <div className="bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-100 border-8 border-yellow-600 rounded-3xl px-16 py-12 shadow-2xl min-w-96">
                <p className="text-2xl font-black text-yellow-700 uppercase mb-4 tracking-widest text-center" style={{ fontFamily: "Courier New, monospace" }}>
                  You Got:
                </p>
                <p className="text-5xl font-black text-gray-900 text-center" style={{ fontFamily: "Courier New, monospace" }}>
                  {popupResult}
                </p>
              </div>
            </div>
          </>
        )}

          {/* Status Message - Bottom Right */}
          <div className="fixed bottom-8 right-8 text-right z-20">
            {timerActive ? (
              <p className="text-lg font-bold text-white bg-red-600 dark:bg-red-700 rounded-lg px-4 py-2 uppercase tracking-widest shadow-lg" style={{ fontFamily: "Courier New, monospace" }}>
                {isTaskResult
                  ? "⏱️ Pull handle to skip or click 💰"
                  : "⏱️ Pull handle to skip"}
              </p>
            ) : isSpinning ? (
              <p className="text-lg font-bold text-white bg-blue-600 dark:bg-blue-700 rounded-lg px-4 py-2 uppercase tracking-widest shadow-lg" style={{ fontFamily: "Courier New, monospace" }}>
                🎰 Spinning...
              </p>
            ) : hasNoPendingTasks ? (
              <p className="text-lg font-bold text-gray-900 bg-yellow-400 dark:bg-yellow-500 rounded-lg px-4 py-2 uppercase tracking-widest shadow-lg" style={{ fontFamily: "Courier New, monospace" }}>
                ⚠️ No tasks available
              </p>
            ) : (
              <p className="text-lg font-bold text-white bg-gray-700 dark:bg-gray-600 rounded-lg px-4 py-2 uppercase tracking-widest shadow-lg" style={{ fontFamily: "Courier New, monospace" }}>
                📍 PULL THE LEVER 📍
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
    </main>
  );
}
