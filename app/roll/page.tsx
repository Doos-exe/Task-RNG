"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useTaskStore } from "@/lib/store";
import { selectWeightedItem, filterPityItems } from "@/lib/probability";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { motion } from "framer-motion";

// Import dice images
import dice1 from "@/Elements/Dice1.png";
import dice2 from "@/Elements/Dice2.png";
import dice3 from "@/Elements/Dice3.png";
import dice4 from "@/Elements/Dice4.png";
import dice5 from "@/Elements/Dice5.png";
import dice6 from "@/Elements/Dice6.png";

const diceImages = [null, dice1, dice2, dice3, dice4, dice5, dice6];

type GameState = "choosing" | "rolling" | "result-shown" | "reward-displaying";
type UserChoice = "task" | "leisure" | null;

export default function RollPage() {
  const { tasks, leisures, spinHistory, addToSpinHistory, coins, addCoins, startTimer, clearTimer, pendingCount, removeTask, activeTimer, getSkipCost } = useTaskStore();

  // Game state
  const [gameState, setGameState] = useState<GameState>("choosing");
  const [userChoice, setUserChoice] = useState<UserChoice>(null);
  const [playerDice, setPlayerDice] = useState<[number, number]>([0, 0]);
  const [systemDice, setSystemDice] = useState<[number, number]>([0, 0]);
  const [winner, setWinner] = useState<"player" | "system" | null>(null);
  const [rewardItem, setRewardItem] = useState<string | null>(null);
  const [isTaskReward, setIsTaskReward] = useState(false);
  const [rewardPriority, setRewardPriority] = useState<"low" | "medium" | "high">("medium");
  const [showCollectConfirm, setShowCollectConfirm] = useState(false);
  const [popupResult, setPopupResult] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  // If there's an active timer, show a message and prevent rolling
  const [showTimerWarning, setShowTimerWarning] = useState(false);

  // Can roll if: coins available AND (no active timer OR timer is from this page)
  const canRoll = coins > 0 && (!activeTimer || activeTimer.source === "roll");
  const isTimerFromRoll = activeTimer?.source === "roll"; // Check if timer was from this page
  const isTimerFromDifferentPage = !!activeTimer && activeTimer.source === "spin"; // Only different if explicitly from spin

  const playerTotal = playerDice[0] + playerDice[1];
  const systemTotal = systemDice[0] + systemDice[1];

  // Roll a single die
  const rollDie = (): number => Math.floor(Math.random() * 6) + 1;

  // Determine reward based on win/loss
  const determineReward = useCallback((gameWinner: "player" | "system") => {
    let reward: string | null = null;
    let isTask: boolean = false;
    let priority: "low" | "medium" | "high" = "medium";

    if (gameWinner === "player") {
      // Player won, give them what they chose
      if (userChoice === "task") {
        if (tasks.length > 0) {
          const taskTitles = tasks.map((t) => t.title);
          reward = selectWeightedItem(taskTitles, spinHistory);
          const selectedTask = tasks.find((t) => t.title === reward);
          priority = selectedTask?.priority || "medium";
          isTask = true;
        }
      } else {
        // userChoice === "leisure"
        if (leisures.length > 0) {
          const leisureTitles = leisures.map((l) => l.title);
          reward = selectWeightedItem(leisureTitles, spinHistory);
          isTask = false;
        }
      }
    } else {
      // System won, give them opposite of what they chose
      if (userChoice === "task") {
        // They wanted task, give them leisure
        if (leisures.length > 0) {
          const leisureTitles = leisures.map((l) => l.title);
          reward = selectWeightedItem(leisureTitles, spinHistory);
          isTask = false;
        }
      } else {
        // They wanted leisure, give them task
        if (tasks.length > 0) {
          const taskTitles = tasks.map((t) => t.title);
          reward = selectWeightedItem(taskTitles, spinHistory);
          const selectedTask = tasks.find((t) => t.title === reward);
          priority = selectedTask?.priority || "medium";
          isTask = true;
        }
      }
    }

    if (reward) {
      setRewardItem(reward);
      setIsTaskReward(isTask);
      setRewardPriority(priority);
      addToSpinHistory(reward);

      // Show popup result
      setPopupResult(reward);
      setTimeout(() => setPopupResult(null), 3000);

      // Start the timer in the store with source="roll"
      startTimer(reward, isTask, priority, "roll");

      setGameState("reward-displaying");
    } else {
      // No items available, reset
      setGameState("choosing");
      setUserChoice(null);
    }
  }, [userChoice, tasks, leisures, spinHistory, addToSpinHistory]);

  // Handle roll
  const handleRoll = useCallback(() => {
    if (isTimerFromDifferentPage) {
      setShowTimerWarning(true);
      setTimeout(() => setShowTimerWarning(false), 3000);
      return;
    }

    // If there's an active timer from this page, charge coins to skip
    if (activeTimer && activeTimer.source === "roll") {
      const skipCost = getSkipCost();
      if (coins < skipCost) {
        setShowTimerWarning(true);
        setTimeout(() => setShowTimerWarning(false), 3000);
        return;
      }
      // Spend coins to skip
      addCoins(-skipCost);
      clearTimer();
      setUserChoice(null);
      setPlayerDice([0, 0]);
      setSystemDice([0, 0]);
      setWinner(null);
      setRewardItem(null);
      setGameState("choosing");
      return;
    }

    if (!userChoice || gameState !== "choosing") return;

    setGameState("rolling");
    setIsRolling(true);
    setPlayerDice([0, 0]);
    setSystemDice([0, 0]);

    // Simulate rolling animation (5 seconds)
    const rollInterval = setInterval(() => {
      setPlayerDice([(rollDie()), rollDie()]);
      setSystemDice([rollDie(), rollDie()]);
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);

      // Generate final dice values
      const finalPlayerDice: [number, number] = [rollDie(), rollDie()];
      const finalSystemDice: [number, number] = [rollDie(), rollDie()];

      setPlayerDice(finalPlayerDice);
      setSystemDice(finalSystemDice);

      const playerFinal = finalPlayerDice[0] + finalPlayerDice[1];
      const systemFinal = finalSystemDice[0] + finalSystemDice[1];

      // Determine winner (with tie handling)
      if (playerFinal === systemFinal) {
        // Tie - automatically reroll after a short delay
        setTimeout(() => {
          handleRoll();
        }, 2000);
      } else {
        const playerWins = playerFinal > systemFinal;
        const calculatedWinner = playerWins ? "player" : "system";
        setWinner(calculatedWinner);
        setGameState("result-shown");
        setIsRolling(false);

        // Auto-transition to reward display after 3 seconds
        setTimeout(() => {
          setGameState("reward-displaying");
          determineReward(calculatedWinner);
        }, 3000);
      }
    }, 5000);
  }, [userChoice, gameState, determineReward, activeTimer, getSkipCost, coins, isTimerFromDifferentPage, addCoins, clearTimer]);

  const handleChoice = (choice: UserChoice) => {
    if (gameState === "choosing") {
      setUserChoice(choice);
    }
  };

  const handleRewardComplete = () => {
    setGameState("choosing");
    setUserChoice(null);
    setPlayerDice([0, 0]);
    setSystemDice([0, 0]);
    setWinner(null);
    setRewardItem(null);
    setRewardPriority("medium");
    clearTimer();
  };

  const handleCollectAttempt = () => {
    setShowCollectConfirm(true);
  };

  const handleConfirmCollect = () => {
    if (rewardItem && isTaskReward && pendingCount() > 0) {
      addCoins(1);

      // Auto-delete the task from the database
      const taskToDelete = tasks.find((t) => t.title === rewardItem);
      if (taskToDelete) {
        removeTask(taskToDelete.id);
      }

      setShowCollectConfirm(false);
      handleRewardComplete();
    }
  };

  const handleReRoll = () => {
    const skipCost = getSkipCost();
    if (coins < skipCost) {
      setShowTimerWarning(true);
      setTimeout(() => setShowTimerWarning(false), 3000);
      return;
    }
    // Spend coins to re-roll
    addCoins(-skipCost);
    clearTimer();
    setGameState("choosing");
    setUserChoice(null);
    setPlayerDice([0, 0]);
    setSystemDice([0, 0]);
    setWinner(null);
    setRewardItem(null);
    setRewardPriority("medium");
  };

  return (
    <main className="ml-96 min-h-screen bg-app-lightMain dark:bg-app-darkMain text-app-lightText dark:text-app-darkText p-8">
      <div className="flex flex-col items-center justify-start min-h-screen -ml-64 pt-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-8 w-full">
          <div className="flex justify-between items-center gap-8 w-full px-8">
            {/* Coins on Left */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <p className="text-xl font-black text-yellow-600" style={{ fontFamily: "Courier New, monospace" }}>💰 {coins}</p>
            </div>

            {/* Title in Center */}
            <h1 className="text-4xl font-black tracking-wider flex-shrink-0" style={{ fontFamily: "Courier New, monospace", letterSpacing: "0.15em" }}>🎲 ROLL TO WIN!</h1>

            {/* Empty space */}
            <div className="w-16 flex-shrink-0"></div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col items-center justify-center gap-12 w-full relative" suppressHydrationWarning>
          {/* Active Timer Warning */}
          {activeTimer && gameState === "choosing" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 dark:bg-red-900 border-2 border-red-600 rounded-lg p-6 text-center w-full"
            >
              <p className="text-lg font-bold text-red-800 dark:text-red-200" style={{ fontFamily: "Courier New, monospace" }}>
                {isTimerFromDifferentPage
                  ? "🎰 Active timer from Spin! Go to Spin page to continue or skip."
                  : `⏱️ You have an active timer! Re-roll costs ${getSkipCost()} coins, or finish the timer.`}
              </p>
            </motion.div>
          )}

          {/* Dice Display - Central focal point */}
          {(gameState === "choosing" || gameState === "rolling" || gameState === "result-shown") && (
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-12 shadow-2xl border-8 border-yellow-600 relative">
              {/* Decorative lights */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-3">
                <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400 animate-pulse" />
                <div className="w-4 h-4 rounded-full bg-red-400 shadow-lg shadow-red-400 animate-pulse-delay-1" />
                <div className="w-4 h-4 rounded-full bg-blue-400 shadow-lg shadow-blue-400 animate-pulse-delay-2" />
              </div>

              <div className="flex flex-col items-center gap-8">
                {/* You Chose Message */}
                {isRolling && (
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: "Courier New, monospace" }}>
                    You chose: <span className="text-yellow-400">{userChoice === "task" ? "📋 TASK" : "🎮 LEISURE"}</span>
                  </p>
                )}

                {/* Dice Section */}
                <div className="grid grid-cols-2 gap-12 items-center">
                  {/* Player Dice */}
                  <div className="flex flex-col items-center gap-4">
                    <h3 className="text-xl font-black text-white" style={{ fontFamily: "Courier New, monospace" }}>🎲 YOU</h3>
                    <div className="flex gap-4">
                      {playerDice.map((die, idx) => (
                        <motion.div
                          key={idx}
                          animate={isRolling ? { rotateX: 360, rotateY: 360 } : {}}
                          transition={isRolling ? { duration: 5, repeat: Infinity, ease: "easeInOut" } : {}}
                          className="w-24 h-24 flex items-center justify-center shadow-lg"
                          style={{ perspective: "1000px" }}
                        >
                          {die > 0 && (
                            <Image
                              src={diceImages[die]}
                              alt={`Dice ${die}`}
                              width={96}
                              height={96}
                              className="rounded-lg"
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                    {!isRolling && <p className="text-2xl font-black text-yellow-400" style={{ fontFamily: "Courier New, monospace" }}>Total: {playerDice[0] + playerDice[1]}</p>}
                  </div>

                  {/* System Dice */}
                  <div className="flex flex-col items-center gap-4">
                    <h3 className="text-xl font-black text-white" style={{ fontFamily: "Courier New, monospace" }}>🖥️ SYSTEM</h3>
                    <div className="flex gap-4">
                      {systemDice.map((die, idx) => (
                        <motion.div
                          key={idx}
                          animate={isRolling ? { rotateX: 360, rotateY: 360 } : {}}
                          transition={isRolling ? { duration: 5, repeat: Infinity, ease: "easeInOut" } : {}}
                          className="w-24 h-24 flex items-center justify-center shadow-lg"
                          style={{ perspective: "1000px" }}
                        >
                          {die > 0 && (
                            <Image
                              src={diceImages[die]}
                              alt={`Dice ${die}`}
                              width={96}
                              height={96}
                              className="rounded-lg"
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                    {!isRolling && <p className="text-2xl font-black text-red-400" style={{ fontFamily: "Courier New, monospace" }}>Total: {systemDice[0] + systemDice[1]}</p>}
                  </div>
                </div>

                {/* Result Message */}
                {gameState === "result-shown" && winner !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center bg-gradient-to-r from-green-600 to-green-800 border-4 border-green-400 rounded-lg p-8 shadow-lg"
                  >
                    <p className="text-4xl font-black text-white" style={{ fontFamily: "Courier New, monospace" }}>
                      {winner === "player" ? "🎉 YOU WIN! 🎉" : "💀 YOU LOSE! 💀"}
                    </p>
                  </motion.div>
                )}

                {/* Tie Message */}
                {gameState === "result-shown" && playerDice[0] + playerDice[1] === systemDice[0] + systemDice[1] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center bg-gradient-to-r from-yellow-600 to-yellow-800 border-4 border-yellow-400 rounded-lg p-8 shadow-lg"
                  >
                    <p className="text-4xl font-black text-white" style={{ fontFamily: "Courier New, monospace" }}>
                      🤝 TIE! REROLLING... 🤝
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Decorative lights bottom */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-400 shadow-lg shadow-blue-400 animate-pulse" />
                <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400 animate-pulse-delay-1" />
                <div className="w-4 h-4 rounded-full bg-red-400 shadow-lg shadow-red-400 animate-pulse-delay-2" />
              </div>
            </div>
          )}

          {/* Choice and Roll Buttons */}
          {gameState === "choosing" && (
            <div className="flex flex-col items-center gap-8 w-full">
              <div className="flex gap-8 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChoice("task")}
                  className={`px-12 py-8 rounded-lg border-4 font-black text-2xl transition-all ${
                    userChoice === "task"
                      ? "bg-blue-600 text-white border-blue-400 shadow-lg"
                      : "bg-white dark:bg-gray-700 text-black dark:text-white border-white dark:border-white hover:border-blue-400 dark:hover:border-blue-400"
                  }`}
                  style={{ fontFamily: "Courier New, monospace" }}
                >
                  📋 TASK
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChoice("leisure")}
                  className={`px-12 py-8 rounded-lg border-4 font-black text-2xl transition-all ${
                    userChoice === "leisure"
                      ? "bg-purple-600 text-white border-purple-400 shadow-lg"
                      : "bg-white dark:bg-gray-700 text-black dark:text-white border-white dark:border-white hover:border-purple-400 dark:hover:border-purple-400"
                  }`}
                  style={{ fontFamily: "Courier New, monospace" }}
                >
                  🎮 LEISURE
                </motion.button>
              </div>

              {userChoice && (
                <motion.button
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: !isTimerFromDifferentPage && canRoll ? 1.1 : 1 }}
                  whileTap={{ scale: !isTimerFromDifferentPage && canRoll ? 0.9 : 1 }}
                  onClick={handleRoll}
                  disabled={!userChoice || !canRoll || isTimerFromDifferentPage}
                  className={`px-16 py-6 rounded-lg border-4 font-black text-3xl shadow-lg transition-all ${
                    isTimerFromDifferentPage || !canRoll
                      ? "bg-gray-500 dark:bg-gray-600 text-gray-700 dark:text-gray-400 border-gray-400 cursor-not-allowed opacity-50"
                      : activeTimer
                      ? "bg-gradient-to-r from-orange-600 to-orange-800 text-white border-orange-400 hover:from-orange-500 hover:to-orange-700"
                      : "bg-gradient-to-r from-red-600 to-red-800 text-white border-red-400 hover:from-red-500 hover:to-red-700"
                  }`}
                  style={{ fontFamily: "Courier New, monospace" }}
                >
                  {activeTimer && !isTimerFromDifferentPage ? `🎲 ROLL (${getSkipCost()} coins)` : "🎲 ROLL"}
                </motion.button>
              )}
            </div>
          )}

          {/* Reward Display */}
          {gameState === "reward-displaying" && rewardItem && (
            <div className="flex flex-col items-center gap-8">
              <div className="bg-gradient-to-br from-yellow-300 to-yellow-200 border-4 border-yellow-600 rounded-2xl p-8 shadow-lg inline-block">
                <p className="text-6xl font-black text-gray-900" style={{ fontFamily: "Courier New, monospace" }}>
                  {rewardItem}
                </p>
              </div>

              {isTaskReward && (
                <div className="flex gap-6 items-center justify-center flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCollectAttempt}
                    className="w-20 h-20 rounded-full font-black text-2xl transition-all shadow-xl transform hover:scale-110 active:scale-95 bg-gradient-to-br from-green-400 to-green-600 text-white cursor-pointer border-4 border-green-700 hover:from-green-300 hover:to-green-500"
                    title="Finish task early and collect coin"
                  >
                    💰
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReRoll}
                    className="px-8 py-6 bg-orange-600 text-white rounded-lg border-4 border-orange-400 font-black text-xl shadow-lg hover:bg-orange-500 transition-all"
                    style={{ fontFamily: "Courier New, monospace" }}
                    title={`Re-Roll for ${getSkipCost()} coins`}
                  >
                    🎲 Re-Roll<br/>({getSkipCost()} coins)
                  </motion.button>
                </div>
              )}

              {!isTaskReward && (
                <div className="flex gap-6 items-center justify-center flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReRoll}
                    className="px-8 py-6 bg-orange-600 text-white rounded-lg border-4 border-orange-400 font-black text-xl shadow-lg hover:bg-orange-500 transition-all"
                    style={{ fontFamily: "Courier New, monospace" }}
                    title={`Re-Roll for ${getSkipCost()} coins`}
                  >
                    🎲 Re-Roll<br/>({getSkipCost()} coins)
                  </motion.button>
                </div>
              )}
            </div>
          )}

          {/* Timer Warning Message */}
          {showTimerWarning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-100 dark:bg-red-900 border-2 border-red-600 rounded-lg p-6 text-center"
            >
              <p className="text-lg font-bold text-red-800 dark:text-red-200" style={{ fontFamily: "Courier New, monospace" }}>
                {isTimerFromDifferentPage
                  ? "🎰 Cannot roll! Go to Spin page to handle that timer."
                  : `💰 Not enough coins to re-roll! You need ${getSkipCost()} coins.`}
              </p>
            </motion.div>
          )}

          {/* Status Message - Bottom Right */}
          <div className="fixed bottom-8 right-8 text-right z-20">
            {isRolling ? (
              <p className="text-lg font-bold text-white bg-blue-600 dark:bg-blue-700 rounded-lg px-4 py-2 uppercase tracking-widest shadow-lg" style={{ fontFamily: "Courier New, monospace" }}>
                🎲 Rolling...
              </p>
            ) : gameState === "reward-displaying" ? (
              <p className="text-lg font-bold text-white bg-green-600 dark:bg-green-700 rounded-lg px-4 py-2 uppercase tracking-widest shadow-lg" style={{ fontFamily: "Courier New, monospace" }}>
                ✨ You got your reward!
              </p>
            ) : userChoice ? (
              <p className="text-lg font-bold text-white bg-gray-700 dark:bg-gray-600 rounded-lg px-4 py-2 uppercase tracking-widest shadow-lg" style={{ fontFamily: "Courier New, monospace" }}>
                🎲 Roll the dice 🎲
              </p>
            ) : (
              <p className="text-lg font-bold text-white bg-gray-700 dark:bg-gray-600 rounded-lg px-4 py-2 uppercase tracking-widest shadow-lg" style={{ fontFamily: "Courier New, monospace" }}>
                🎲 Roll the dice 🎲
              </p>
            )}
          </div>
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

        {/* Confirmation Dialog for Collecting Coins */}
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
      </div>
    </main>
  );
}
