"use client";

import { PokerChip } from "@/components/PokerChip";

export default function Home() {
  return (
    <main className="min-h-screen bg-task-lightBg dark:bg-task-main dark:text-white p-8 flex items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <h1 className="text-4xl font-bold dark:text-white">Task RNG</h1>

        {/* Poker Chips Navigation */}
        <div className="flex flex-wrap gap-12 justify-center items-center">
          <PokerChip label="SPIN" href="/spin" />
          <PokerChip label="TASKS" href="/tasks" />
          <PokerChip label="ABOUT" href="/about" />
        </div>
      </div>
    </main>
  );
}
