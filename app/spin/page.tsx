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

  const stateRef = useRef({ currentResult, popupResult, isSpinning });

  useEffect(() => {
    stateRef.current = { currentResult, popupResult, isSpinning };
  }, [currentResult, popupResult, isSpinning]);

  const [showCollectConfirm, setShowCollectConfirm] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showInsufficientCoinsDialog, setShowInsufficientCoinsDialog] = useState(false);

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

  useEffect(() => {
    if (currentResult !== null || popupResult !== null || isSpinning) {
      localStorage.setItem('spinPageState', JSON.stringify({
        currentResult,
        popupResult,
        isSpinning,
      }));
    }
  }, [currentResult, popupResult, isSpinning]);

  useEffect(() => {
    return () => {
      if (stateRef.current.currentResult !== null || stateRef.current.popupResult !== null) {
        localStorage.setItem('spinPageState', JSON.stringify(stateRef.current));
      }
    };
  }, []);

  const pendingTasks = pendingCount();
  const canSpin = (pendingTasks > 0 || coins > 0) && (!activeTimer || activeTimer.source === "spin");
  const timerActive = !!activeTimer;
  const isTimerFromSpin = activeTimer?.source === "spin";
  const isTimerFromDifferentPage = !!activeTimer && activeTimer.source === "roll";

  useEffect(() => {
    checkAndResetSkipCostIfNewDay();
  }, [checkAndResetSkipCostIfNewDay]);

  const handleSpinComplete = useCallback((result: string) => {
    setTimeout(() => {
      setCurrentResult(result);
      setIsSpinning(false);

      const isTask = !leisures.some(l => l.title === result);
      const priority = isTask
        ? tasks.find(t => t.title === result)?.priority || "medium"
        : "medium";
      startTimer(result, isTask, priority, "spin");
      recordSpinOutcome(isTask);
      setPopupResult(result);
      setTimeout(() => setPopupResult(null), 3000);
    }, 100);
  }, [leisures, tasks, startTimer, recordSpinOutcome]);

  const handleSpin = useCallback(() => {
    if (!isSpinning) {
      if (isTimerFromDifferentPage) return;
      if (timerActive && isTimerFromSpin) {
        handleSkipAttempt();
      } else {
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

  const isTaskResult = currentResult && !leisures.some(l => l.title === currentResult);
  const hasNoPendingTasks = pendingTasks === 0;

  return (
    <main className="app-page text-app-lightText dark:text-app-darkText">
      <div className="app-page-inner flex flex-col items-center justify-start pt-2">

        {/* Header */}
        <div className="w-full max-w-5xl mb-6 md:mb-8">
          {/* Title row */}
          <div className="mb-5">
            <p className="eyebrow mb-3 text-center">Slot machine mode</p>
            <h1 className="page-title text-center">Pull to win.</h1>
            <p className="page-subtitle mx-auto mt-3 text-center">Let the reels choose one focused move from your table.</p>
          </div>

          {/* Coins + Pity row */}
          <div className="app-surface flex flex-col justify-between gap-4 rounded-2xl p-4 md:flex-row md:items-center md:px-6">
            {/* Coins */}
            <div className="status-chip text-sm"><span>💰</span> Coins <strong>{coins}</strong></div>

            {/* Pity System */}
            <div className="flex flex-col gap-1.5 md:items-end">
              <p className="text-xs font-black text-purple-500 uppercase tracking-widest text-right" style={{ fontFamily: "Courier New, monospace" }}>
                🛡️ Pity
              </p>
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-sm font-black">📋</span>
                <div className="h-2.5 w-24 overflow-hidden rounded-full bg-slate-900/70 md:w-32">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-300"
                    style={{ width: `${(taskConsecutiveCount / 4) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-black text-blue-400 w-4 text-right">{taskConsecutiveCount}</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-sm font-black">🎮</span>
                <div className="h-2.5 w-24 overflow-hidden rounded-full bg-slate-900/70 md:w-32">
                  <div
                    className="h-full bg-gradient-to-r from-fuchsia-400 to-violet-500 transition-all duration-300"
                    style={{ width: `${(leisureConsecutiveCount / 4) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-black text-purple-400 w-4 text-right">{leisureConsecutiveCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Warnings */}
        <div className="w-full max-w-5xl px-0" suppressHydrationWarning>
          {hasNoPendingTasks && !currentResult && (
            <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-400/10 p-4 text-center md:p-5" suppressHydrationWarning>
              <p className="text-sm font-semibold text-[var(--app-ink)] md:text-base" style={{ fontFamily: "Courier New, monospace" }}>
                ⚠️ No pending tasks! Add tasks to continue spinning.
              </p>
            </div>
          )}

          {isTimerFromDifferentPage && (
            <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-center md:p-5" suppressHydrationWarning>
              <p className="text-sm font-semibold text-[var(--app-ink)] md:text-base" style={{ fontFamily: "Courier New, monospace" }}>
                🎲 Active timer from Roll! Go to Roll page to continue or skip.
              </p>
            </div>
          )}
        </div>

        {/* Slot Machine Area — centered, horizontally scrollable on small screens */}
        <div className="w-full overflow-visible pb-4" suppressHydrationWarning>
          <div className="flex justify-center">
          <div className="flex w-full flex-col items-center gap-8 px-2 md:flex-row md:gap-16 md:px-0">

            {/* Handle */}
            <InteractiveHandle
              onSpin={handleSpin}
              isSpinning={isSpinning}
              canSpin={canSpin && !isTimerFromDifferentPage}
              isTimerActive={timerActive && isTimerFromSpin}
            />

            {/* Slot Machine */}
            <div className="casino-frame relative w-full max-w-3xl rounded-3xl p-4 shadow-2xl md:p-10">
              {/* Decorative lights top */}
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

            {/* Result Display */}
            {!isSpinning && currentResult && (
              <div className={`flex flex-col items-center gap-8 ${popupResult ? 'blur-sm' : ''} transition-all duration-300`}>
                <div className="rounded-2xl border border-amber-300/60 bg-gradient-to-b from-amber-200 to-amber-400 p-4 shadow-lg">
                  <div className="text-center">
                    <p className="text-xs font-black text-yellow-700 uppercase mb-2 tracking-widest" style={{ fontFamily: "Courier New, monospace" }}>
                      Result
                    </p>
                    <p className="text-sm font-black text-gray-900 break-words line-clamp-4" style={{ fontFamily: "Courier New, monospace" }}>
                      {currentResult}
                    </p>
                  </div>
                </div>

                {isTaskResult && (
                  <button
                    onClick={handleCollectAttempt}
                    className="flex h-16 w-16 transform cursor-pointer items-center justify-center rounded-full border-4 border-emerald-800 bg-gradient-to-br from-emerald-300 to-emerald-600 text-2xl font-black text-white shadow-xl transition-all hover:scale-110 active:scale-95"
                    title="Finish task early and collect coin"
                  >
                    💰
                  </button>
                )}
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Popup Notification */}
        {popupResult && (
          <>
            <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm" />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce w-[90vw] md:w-auto">
              <div className="rounded-3xl border border-amber-300/70 bg-gradient-to-b from-amber-200 to-amber-400 px-8 py-8 shadow-2xl md:px-16 md:py-12">
                <p className="text-xl md:text-2xl font-black text-yellow-700 uppercase mb-4 tracking-widest text-center" style={{ fontFamily: "Courier New, monospace" }}>
                  You Got:
                </p>
                <p className="text-3xl md:text-5xl font-black text-gray-900 text-center" style={{ fontFamily: "Courier New, monospace" }}>
                  {popupResult}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Status Message */}
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 text-right z-20 max-w-[90vw] md:max-w-none">
          {timerActive ? (
            <p className="text-sm md:text-lg font-bold text-white bg-red-600 dark:bg-red-700 rounded-lg px-3 md:px-4 py-2 uppercase tracking-widest shadow-lg" style={{ fontFamily: "Courier New, monospace" }}>
              {isTaskResult
                ? "⏱️ Pull to skip or click 💰"
                : "⏱️ Pull handle to skip"}
            </p>
          ) : isSpinning ? (
            <p className="text-sm md:text-lg font-bold text-white bg-blue-600 dark:bg-blue-700 rounded-lg px-3 md:px-4 py-2 uppercase tracking-widest shadow-lg" style={{ fontFamily: "Courier New, monospace" }}>
              🎰 Spinning...
            </p>
          ) : hasNoPendingTasks ? (
            <p className="text-sm md:text-lg font-bold text-gray-900 bg-yellow-400 dark:bg-yellow-500 rounded-lg px-3 md:px-4 py-2 uppercase tracking-widest shadow-lg" style={{ fontFamily: "Courier New, monospace" }}>
              ⚠️ No tasks available
            </p>
          ) : (
            <p className="text-sm md:text-lg font-bold text-white bg-gray-700 dark:bg-gray-600 rounded-lg px-3 md:px-4 py-2 uppercase tracking-widest shadow-lg" style={{ fontFamily: "Courier New, monospace" }}>
              📍 PULL THE LEVER 📍
            </p>
          )}
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
