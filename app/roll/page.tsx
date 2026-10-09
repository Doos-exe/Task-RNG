"use client";
/*
  This is the roll page, the dice game for users to play if they want a task or leisure but do not know what to do.
  Users choose if they want to bet their tasks or leisure and fight against the system in a dice roll.
*/

import { useState, useCallback, useEffect, useRef } from "react";
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
  const { tasks, leisures, spinHistory, addToSpinHistory, coins, addCoins, startTimer, clearTimer, pendingCount, removeTask, activeTimer, getSkipCost, useSkip } = useTaskStore();

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
  const [showReRollConfirm, setShowReRollConfirm] = useState(false);

  const stateRef = useRef({ gameState, userChoice, playerDice, systemDice, winner, rewardItem, isTaskReward, rewardPriority });

  useEffect(() => {
    stateRef.current = { gameState, userChoice, playerDice, systemDice, winner, rewardItem, isTaskReward, rewardPriority };
  }, [gameState, userChoice, playerDice, systemDice, winner, rewardItem, isTaskReward, rewardPriority]);

  const [showTimerWarning, setShowTimerWarning] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('rollPageState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setGameState(state.gameState || "choosing");
        setUserChoice(state.userChoice || null);
        setPlayerDice(state.playerDice || [0, 0]);
        setSystemDice(state.systemDice || [0, 0]);
        setWinner(state.winner || null);
        if (state.rewardItem) setRewardItem(state.rewardItem);
        setIsTaskReward(state.isTaskReward || false);
        setRewardPriority(state.rewardPriority || "medium");
      } catch (e) {
        console.error('Failed to restore roll page state:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rollPageState', JSON.stringify({
      gameState,
      userChoice,
      playerDice,
      systemDice,
      winner,
      rewardItem,
      isTaskReward,
      rewardPriority,
    }));
  }, [gameState, userChoice, playerDice, systemDice, winner, rewardItem, isTaskReward, rewardPriority]);

  useEffect(() => {
    return () => {
      if (stateRef.current.rewardItem || stateRef.current.gameState !== "choosing") {
        localStorage.setItem('rollPageState', JSON.stringify(stateRef.current));
      }
    };
  }, []);

  const isTimerFromRoll = activeTimer?.source === "roll";
  const isTimerFromDifferentPage = !!activeTimer && activeTimer.source === "spin";

  const canRoll = !isTimerFromDifferentPage;
  const canSkip = coins >= getSkipCost();

  const rollDie = (): number => Math.floor(Math.random() * 6) + 1;

  const determineReward = useCallback((gameWinner: "player" | "system") => {
    let reward: string | null = null;
    let isTask: boolean = false;
    let priority: "low" | "medium" | "high" = "medium";

    if (gameWinner === "player") {
      if (userChoice === "task") {
        if (tasks.length > 0) {
          const taskTitles = tasks.map((t) => t.title);
          reward = selectWeightedItem(taskTitles, spinHistory);
          const selectedTask = tasks.find((t) => t.title === reward);
          priority = selectedTask?.priority || "medium";
          isTask = true;
        }
      } else {
        if (leisures.length > 0) {
          const leisureTitles = leisures.map((l) => l.title);
          reward = selectWeightedItem(leisureTitles, spinHistory);
          isTask = false;
        }
      }
    } else {
      if (userChoice === "task") {
        if (leisures.length > 0) {
          const leisureTitles = leisures.map((l) => l.title);
          reward = selectWeightedItem(leisureTitles, spinHistory);
          isTask = false;
        }
      } else {
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

      setPopupResult(reward);
      setTimeout(() => setPopupResult(null), 3000);

      startTimer(reward, isTask, priority, "roll");
      setGameState("reward-displaying");
    } else {
      setGameState("choosing");
      setUserChoice(null);
    }
  }, [userChoice, tasks, leisures, spinHistory, addToSpinHistory]);

  const handleRoll = useCallback(() => {
    if (isTimerFromDifferentPage) {
      setShowTimerWarning(true);
      setTimeout(() => setShowTimerWarning(false), 3000);
      return;
    }

    if (activeTimer && activeTimer.source === "roll") {
      const skipCost = getSkipCost();
      if (coins < skipCost) {
        setShowTimerWarning(true);
        setTimeout(() => setShowTimerWarning(false), 3000);
        return;
      }
      const skipped = useSkip();
      if (skipped) {
        clearTimer();
        setUserChoice(null);
        setPlayerDice([0, 0]);
        setSystemDice([0, 0]);
        setWinner(null);
        setRewardItem(null);
        setGameState("choosing");
        localStorage.removeItem('rollPageState');
      }
      return;
    }

    if (!userChoice || gameState !== "choosing") return;

    setGameState("rolling");
    setIsRolling(true);
    setPlayerDice([0, 0]);
    setSystemDice([0, 0]);

    const rollInterval = setInterval(() => {
      setPlayerDice([(rollDie()), rollDie()]);
      setSystemDice([rollDie(), rollDie()]);
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);

      const finalPlayerDice: [number, number] = [rollDie(), rollDie()];
      const finalSystemDice: [number, number] = [rollDie(), rollDie()];

      setPlayerDice(finalPlayerDice);
      setSystemDice(finalSystemDice);

      const playerFinal = finalPlayerDice[0] + finalPlayerDice[1];
      const systemFinal = finalSystemDice[0] + finalSystemDice[1];

      if (playerFinal === systemFinal) {
        setTimeout(() => {
          handleRoll();
        }, 2000);
      } else {
        const playerWins = playerFinal > systemFinal;
        const calculatedWinner = playerWins ? "player" : "system";
        setWinner(calculatedWinner);
        setGameState("result-shown");
        setIsRolling(false);

        setTimeout(() => {
          setGameState("reward-displaying");
          determineReward(calculatedWinner);
        }, 3000);
      }
    }, 5000);
  }, [userChoice, gameState, determineReward, activeTimer, getSkipCost, coins, isTimerFromDifferentPage, addCoins, clearTimer, useSkip]);

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
    localStorage.removeItem('rollPageState');
  };

  const handleCollectAttempt = () => {
    setShowCollectConfirm(true);
  };

  const handleConfirmCollect = () => {
    if (rewardItem && isTaskReward && pendingCount() > 0) {
      addCoins(1);

      const taskToDelete = tasks.find((t) => t.title === rewardItem);
      if (taskToDelete) {
        removeTask(taskToDelete.id);
      }

      setShowCollectConfirm(false);
      localStorage.removeItem('rollPageState');
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
    setShowReRollConfirm(true);
  };

  const handleConfirmReRoll = () => {
    const skipCost = getSkipCost();
    addCoins(-skipCost);
    clearTimer();
    setShowReRollConfirm(false);
    setGameState("choosing");
    setPlayerDice([0, 0]);
    setSystemDice([0, 0]);
    setWinner(null);
    setRewardItem(null);
    setRewardPriority("medium");
    localStorage.removeItem('rollPageState');
  };

  return (
    <main className="min-h-screen bg-app-lightMain dark:bg-app-darkMain text-app-lightText dark:text-app-darkText p-4 md:p-8">
      <div className="flex flex-col items-center justify-start pt-2">

        {/* Header */}
        <div className="w-full max-w-4xl mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-black tracking-wider text-center mb-3" style={{ fontFamily: "Courier New, monospace", letterSpacing: "0.15em" }}>
            🎲 ROLL TO WIN!
          </h1>
          <div className="flex justify-between items-center px-2 md:px-8">
            <p className="text-lg md:text-xl font-black text-yellow-600" style={{ fontFamily: "Courier New, monospace" }}>
              💰 {coins}
            </p>
            <div className="w-16 flex-shrink-0" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col items-center justify-center gap-8 md:gap-12 w-full max-w-4xl" suppressHydrationWarning>

          {/* Active Timer Warning */}
          {activeTimer && gameState === "choosing" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 dark:bg-red-900 border-2 border-red-600 rounded-lg p-4 md:p-6 text-center w-full"
            >
              <p className="text-base md:text-lg font-bold text-red-800 dark:text-red-200" style={{ fontFamily: "Courier New, monospace" }}>
                {isTimerFromDifferentPage
                  ? "🎰 Active timer from Spin! Go to Spin page to continue or skip."
                  : `⏱️ You have an active timer! Re-roll costs ${getSkipCost()} coins, or finish the timer.`}
              </p>
            </motion.div>
          )}

          {/* Dice Display — horizontally scrollable on very small screens */}
          {(gameState === "choosing" || gameState === "rolling" || gameState === "result-shown") && (
            <div className="w-full overflow-x-auto">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 md:p-12 shadow-2xl border-8 border-yellow-600 relative min-w-max md:min-w-0 mx-auto">
                {/* Decorative lights top */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-3">
                  <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400 animate-pulse" />
                  <div className="w-4 h-4 rounded-full bg-red-400 shadow-lg shadow-red-400 animate-pulse-delay-1" />
                  <div className="w-4 h-4 rounded-full bg-blue-400 shadow-lg shadow-blue-400 animate-pulse-delay-2" />
                </div>

                <div className="flex flex-col items-center gap-6 md:gap-8">
                  {isRolling && (
                    <p className="text-lg md:text-2xl font-bold text-white" style={{ fontFamily: "Courier New, monospace" }}>
                      You chose: <span className="text-yellow-400">{userChoice === "task" ? "📋 TASK" : "🎮 LEISURE"}</span>
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-6 md:gap-12 items-center">
                    {/* Player Dice */}
                    <div className="flex flex-col items-center gap-3 md:gap-4">
                      <h3 className="text-lg md:text-xl font-black text-white" style={{ fontFamily: "Courier New, monospace" }}>🎲 YOU</h3>
                      <div className="flex gap-2 md:gap-4">
                        {playerDice.map((die, idx) => (
                          <motion.div
                            key={idx}
                            animate={isRolling ? { rotateX: 360, rotateY: 360 } : {}}
                            transition={isRolling ? { duration: 5, repeat: Infinity, ease: "easeInOut" } : {}}
                            className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center shadow-lg"
                            style={{ perspective: "1000px" }}
                          >
                            {die > 0 && (
                              <Image
                                src={diceImages[die]!}
                                alt={`Dice ${die}`}
                                width={96}
                                height={96}
                                className="rounded-lg w-full h-full"
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>
                      {!isRolling && <p className="text-lg md:text-2xl font-black text-yellow-400" style={{ fontFamily: "Courier New, monospace" }}>Total: {playerDice[0] + playerDice[1]}</p>}
                    </div>

                    {/* System Dice */}
                    <div className="flex flex-col items-center gap-3 md:gap-4">
                      <h3 className="text-lg md:text-xl font-black text-white" style={{ fontFamily: "Courier New, monospace" }}>🖥️ SYSTEM</h3>
                      <div className="flex gap-2 md:gap-4">
                        {systemDice.map((die, idx) => (
                          <motion.div
                            key={idx}
                            animate={isRolling ? { rotateX: 360, rotateY: 360 } : {}}
                            transition={isRolling ? { duration: 5, repeat: Infinity, ease: "easeInOut" } : {}}
                            className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center shadow-lg"
                            style={{ perspective: "1000px" }}
                          >
                            {die > 0 && (
                              <Image
                                src={diceImages[die]!}
                                alt={`Dice ${die}`}
                                width={96}
                                height={96}
                                className="rounded-lg w-full h-full"
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>
                      {!isRolling && <p className="text-lg md:text-2xl font-black text-red-400" style={{ fontFamily: "Courier New, monospace" }}>Total: {systemDice[0] + systemDice[1]}</p>}
                    </div>
                  </div>

                  {/* Result Message */}
                  {gameState === "result-shown" && winner !== null && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center bg-gradient-to-r from-green-600 to-green-800 border-4 border-green-400 rounded-lg p-5 md:p-8 shadow-lg"
                    >
                      <p className="text-2xl md:text-4xl font-black text-white" style={{ fontFamily: "Courier New, monospace" }}>
                        {winner === "player" ? "🎉 YOU WIN! 🎉" : "💀 YOU LOSE! 💀"}
                      </p>
                    </motion.div>
                  )}

                  {/* Tie Message */}
                  {gameState === "result-shown" && playerDice[0] + playerDice[1] === systemDice[0] + systemDice[1] && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center bg-gradient-to-r from-yellow-600 to-yellow-800 border-4 border-yellow-400 rounded-lg p-5 md:p-8 shadow-lg"
                    >
                      <p className="text-2xl md:text-4xl font-black text-white" style={{ fontFamily: "Courier New, monospace" }}>
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
            </div>
          )}

          {/* Choice and Roll Buttons */}
          {gameState === "choosing" && (
            <div className="flex flex-col items-center gap-6 md:gap-8 w-full">
              <div className="flex gap-4 md:gap-8 justify-center flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChoice("task")}
                  className={`px-8 md:px-12 py-6 md:py-8 rounded-lg border-4 font-black text-xl md:text-2xl transition-all ${
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
                  className={`px-8 md:px-12 py-6 md:py-8 rounded-lg border-4 font-black text-xl md:text-2xl transition-all ${
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
                  whileHover={{ scale: !isTimerFromDifferentPage && (!isTimerFromRoll || canSkip) ? 1.1 : 1 }}
                  whileTap={{ scale: !isTimerFromDifferentPage && (!isTimerFromRoll || canSkip) ? 0.9 : 1 }}
                  onClick={handleRoll}
                  disabled={!userChoice || isTimerFromDifferentPage || (isTimerFromRoll && !canSkip)}
                  className={`px-12 md:px-16 py-5 md:py-6 rounded-lg border-4 font-black text-2xl md:text-3xl shadow-lg transition-all ${
                    isTimerFromDifferentPage || (isTimerFromRoll && !canSkip)
                      ? "bg-gray-500 dark:bg-gray-600 text-gray-700 dark:text-gray-400 border-gray-400 cursor-not-allowed opacity-50"
                      : isTimerFromRoll
                      ? "bg-gradient-to-r from-orange-600 to-orange-800 text-white border-orange-400 hover:from-orange-500 hover:to-orange-700"
                      : "bg-gradient-to-r from-red-600 to-red-800 text-white border-red-400 hover:from-red-500 hover:to-red-700"
                  }`}
                  style={{ fontFamily: "Courier New, monospace" }}
                >
                  {isTimerFromRoll ? `🎲 ROLL (${getSkipCost()} coins)` : "🎲 ROLL"}
                </motion.button>
              )}
            </div>
          )}

          {/* Reward Display */}
          {gameState === "reward-displaying" && rewardItem && (
            <div className="flex flex-col items-center gap-6 md:gap-8 w-full">
              <div className="bg-gradient-to-br from-yellow-300 to-yellow-200 border-4 border-yellow-600 rounded-2xl p-6 md:p-8 shadow-lg inline-block max-w-full">
                <p className="text-3xl md:text-6xl font-black text-gray-900 break-words text-center" style={{ fontFamily: "Courier New, monospace" }}>
                  {rewardItem}
                </p>
              </div>

              {isTaskReward && (
                <div className="flex gap-4 md:gap-6 items-center justify-center flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCollectAttempt}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full font-black text-xl md:text-2xl transition-all shadow-xl transform hover:scale-110 active:scale-95 bg-gradient-to-br from-green-400 to-green-600 text-white cursor-pointer border-4 border-green-700 hover:from-green-300 hover:to-green-500"
                    title="Finish task early and collect coin"
                  >
                    💰
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReRoll}
                    className="px-6 md:px-8 py-4 md:py-6 bg-orange-600 text-white rounded-lg border-4 border-orange-400 font-black text-lg md:text-xl shadow-lg hover:bg-orange-500 transition-all"
                    style={{ fontFamily: "Courier New, monospace" }}
                    title={`Re-Roll for ${getSkipCost()} coins`}
                  >
                    🎲 Re-Roll<br/>({getSkipCost()} coins)
                  </motion.button>
                </div>
              )}

              {!isTaskReward && (
                <div className="flex gap-4 md:gap-6 items-center justify-center flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReRoll}
                    className="px-6 md:px-8 py-4 md:py-6 bg-orange-600 text-white rounded-lg border-4 border-orange-400 font-black text-lg md:text-xl shadow-lg hover:bg-orange-500 transition-all"
                    style={{ fontFamily: "Courier New, monospace" }}
                    title={`Re-Roll for ${getSkipCost()} coins`}
                  >
                    🎲 Re-Roll<br/>({getSkipCost()} coins)
                  </motion.button>
                </div>
              )}
            </div>
          )}

          {/* Timer Warning */}
          {showTimerWarning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-100 dark:bg-red-900 border-2 border-red-600 rounded-lg p-4 md:p-6 text-center w-full"
            >
              <p className="text-base md:text-lg font-bold text-red-800 dark:text-red-200" style={{ fontFamily: "Courier New, monospace" }}>
                {isTimerFromDifferentPage
                  ? "🎰 Cannot roll! Go to Spin page to handle that timer."
                  : `💰 Not enough coins to re-roll! You need ${getSkipCost()} coins.`}
              </p>
            </motion.div>
          )}

          {/* Status Message */}
          <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 text-right z-20 max-w-[90vw] md:max-w-none">
            {isRolling ? (
              <p className="text-sm md:text-lg font-bold text-white bg-blue-600 dark:bg-blue-700 rounded-lg px-3 md:px-4 py-2 uppercase tracking-widest shadow-lg" style={{ fontFamily: "Courier New, monospace" }}>
                🎲 Rolling...
              </p>
            ) : gameState === "reward-displaying" ? (
              <p className="text-sm md:text-lg font-bold text-white bg-green-600 dark:bg-green-700 rounded-lg px-3 md:px-4 py-2 uppercase tracking-widest shadow-lg" style={{ fontFamily: "Courier New, monospace" }}>
                ✨ You got your reward!
              </p>
            ) : (
              <p className="text-sm md:text-lg font-bold text-white bg-gray-700 dark:bg-gray-600 rounded-lg px-3 md:px-4 py-2 uppercase tracking-widest shadow-lg" style={{ fontFamily: "Courier New, monospace" }}>
                🎲 Roll the dice 🎲
              </p>
            )}
          </div>
        </div>

        {/* Popup Notification */}
        {popupResult && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce w-[90vw] md:w-auto">
              <div className="bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-100 border-8 border-yellow-600 rounded-3xl px-8 md:px-16 py-8 md:py-12 shadow-2xl">
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

        {/* Confirmation Dialogs */}
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
          isOpen={showReRollConfirm}
          title="Re-Roll for a New Reward?"
          message={`Re-roll and lose this reward? This will cost ${getSkipCost()} coins.`}
          confirmText={`Re-Roll (${getSkipCost()} coins)`}
          cancelText="Keep Reward"
          onConfirm={handleConfirmReRoll}
          onCancel={() => setShowReRollConfirm(false)}
          type="warning"
        />
      </div>
    </main>
  );
}
