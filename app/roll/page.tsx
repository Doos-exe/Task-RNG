"use client";

import { useState, useCallback } from "react";
import { useTaskStore } from "@/lib/store";
import { selectWeightedItem, filterPityItems } from "@/lib/probability";
import { ResultTimer } from "@/components/ResultTimer";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { motion, AnimatePresence } from "framer-motion";

type GameState = "choosing" | "rolling" | "result-shown" | "reward-displaying";
type UserChoice = "task" | "leisure" | null;

export default function RollPage() {
  const { tasks, leisures, spinHistory, addToSpinHistory, coins, addCoins, startTimer, clearTimer, pendingCount, removeTask } = useTaskStore();

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

      // Start the timer in the store for persistence
      startTimer(reward, isTask, priority);

      setGameState("reward-displaying");
    } else {
      // No items available, reset
      setGameState("choosing");
      setUserChoice(null);
    }
  }, [userChoice, tasks, leisures, spinHistory, addToSpinHistory]);

  // Handle roll
  const handleRoll = useCallback(() => {
    if (!userChoice || gameState !== "choosing") return;

    setGameState("rolling");
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

        // Auto-transition to reward display after 3 seconds
        setTimeout(() => {
          setGameState("reward-displaying");
          determineReward(calculatedWinner);
        }, 3000);
      }
    }, 5000);
  }, [userChoice, gameState, determineReward]);

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

  return (
    <main className="ml-96 min-h-screen bg-app-lightMain dark:bg-app-darkMain text-app-lightText dark:text-app-darkText p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold tracking-wider" style={{ fontFamily: "Courier New, monospace", letterSpacing: "0.1em" }}>
            Roll
          </h1>
          <div className="flex flex-col items-center gap-1">
            <p className="text-xl font-black text-yellow-600" style={{ fontFamily: "Courier New, monospace" }}>💰 {coins}</p>
          </div>
        </div>

        {/* Game State: Choosing */}
        <AnimatePresence>
          {gameState === "choosing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="bg-blue-100 dark:bg-blue-900 border-2 border-blue-600 rounded-lg p-6 mb-8">
                <p className="text-lg font-bold text-blue-800 dark:text-blue-200" style={{ fontFamily: "Courier New, monospace" }}>
                  💡 Choose what you want, then roll the dice! Beat the system to win your reward!
                </p>
              </div>

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
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center mt-8"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRoll}
                    disabled={!userChoice}
                    className="px-16 py-6 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg border-4 border-red-400 font-black text-3xl shadow-lg hover:from-red-500 hover:to-red-700 transition-all"
                    style={{ fontFamily: "Courier New, monospace" }}
                  >
                    🎲 ROLL
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game State: Rolling/Result */}
        <AnimatePresence>
          {(gameState === "rolling" || gameState === "result-shown") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* You Chose */}
              <div className="text-center">
                <p className="text-2xl font-bold mb-4" style={{ fontFamily: "Courier New, monospace" }}>
                  You chose: <span className="text-yellow-400">{userChoice === "task" ? "📋 TASK" : "🎮 LEISURE"}</span>
                </p>
              </div>

              {/* Dice Display */}
              <div className="grid grid-cols-2 gap-16 justify-items-center">
                {/* Player Dice */}
                <div className="flex flex-col items-center gap-6">
                  <h2 className="text-2xl font-black" style={{ fontFamily: "Courier New, monospace" }}>
                    🎲 YOU
                  </h2>
                  <div className="flex gap-4">
                    {playerDice.map((die, idx) => (
                      <motion.div
                        key={idx}
                        animate={gameState === "rolling" ? { rotateX: 360, rotateY: 360 } : {}}
                        transition={
                          gameState === "rolling"
                            ? { duration: 5, repeat: Infinity, ease: "easeInOut" }
                            : {}
                        }
                        className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-400 border-4 border-yellow-600 rounded-lg flex items-center justify-center shadow-lg"
                        style={{ perspective: "1000px" }}
                      >
                        <span className="text-5xl font-black text-gray-900" style={{ fontFamily: "Courier New, monospace" }}>
                          {die}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-3xl font-black text-yellow-400" style={{ fontFamily: "Courier New, monospace" }}>
                    Total: {playerTotal}
                  </p>
                </div>

                {/* System Dice */}
                <div className="flex flex-col items-center gap-6">
                  <h2 className="text-2xl font-black" style={{ fontFamily: "Courier New, monospace" }}>
                    🖥️ SYSTEM
                  </h2>
                  <div className="flex gap-4">
                    {systemDice.map((die, idx) => (
                      <motion.div
                        key={idx}
                        animate={gameState === "rolling" ? { rotateX: 360, rotateY: 360 } : {}}
                        transition={
                          gameState === "rolling"
                            ? { duration: 5, repeat: Infinity, ease: "easeInOut" }
                            : {}
                        }
                        className="w-24 h-24 bg-gradient-to-br from-red-300 to-red-400 border-4 border-red-600 rounded-lg flex items-center justify-center shadow-lg"
                        style={{ perspective: "1000px" }}
                      >
                        <span className="text-5xl font-black text-gray-900" style={{ fontFamily: "Courier New, monospace" }}>
                          {die}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-3xl font-black text-red-400" style={{ fontFamily: "Courier New, monospace" }}>
                    Total: {systemTotal}
                  </p>
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
              {gameState === "result-shown" && playerTotal === systemTotal && (
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reward Display */}
        {gameState === "reward-displaying" && rewardItem && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <p className="text-3xl font-black mb-4" style={{ fontFamily: "Courier New, monospace" }}>
                {winner === "player" ? "✨ HERE IS YOUR REWARD ✨" : "🎁 SYSTEM'S CHOICE FOR YOU 🎁"}
              </p>
              <div className="bg-gradient-to-br from-yellow-300 to-yellow-200 border-4 border-yellow-600 rounded-2xl p-8 shadow-lg inline-block">
                <p className="text-6xl font-black text-gray-900" style={{ fontFamily: "Courier New, monospace" }}>
                  {rewardItem}
                </p>
              </div>
            </motion.div>

            {/* Show timer for both tasks and leisure */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ResultTimer result={rewardItem} isStarted={true} onTaskComplete={handleRewardComplete} taskPriority={isTaskReward ? rewardPriority : "medium"} />
            </motion.div>

            {/* Collect Coins Button - Shows for Task rewards */}
            {isTaskReward && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCollectAttempt}
                  className="w-20 h-20 rounded-full font-black text-2xl transition-all shadow-xl transform hover:scale-110 active:scale-95 bg-gradient-to-br from-green-400 to-green-600 text-white cursor-pointer border-4 border-green-700 hover:from-green-300 hover:to-green-500"
                  title="Finish task early and collect coin"
                >
                  💰
                </motion.button>
              </motion.div>
            )}

            {/* If leisure reward, show button to continue */}
            {!isTaskReward && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleRewardComplete}
                  className="px-12 py-6 bg-blue-600 text-white rounded-lg border-4 border-blue-400 font-black text-2xl shadow-lg hover:bg-blue-500 transition-all"
                  style={{ fontFamily: "Courier New, monospace" }}
                >
                  Continue Playing
                </motion.button>
              </motion.div>
            )}
          </div>
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
