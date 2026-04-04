"use client";

import { PokerChip } from "@/components/PokerChip";

export default function Home() {
  return (
    <main className="ml-48 min-h-screen bg-app-lightMain dark:bg-app-darkMain text-app-lightText dark:text-app-darkText p-8 flex flex-col items-center justify-center">
      {/* Poker Chips Container */}
      <div className="relative w-full h-96 flex items-center justify-center">
        {/* SPIN - Top Left */}
        <div className="absolute top-8 left-12">
          <PokerChip label="SPIN" href="/spin" />
        </div>

        {/* TASKS - Top Right */}
        <div className="absolute top-8 right-12">
          <PokerChip label="TASKS" href="/tasks" />
        </div>

        {/* ABOUT - Bottom Center */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <PokerChip label="ABOUT" href="/about" />
        </div>
      </div>
    </main>
  );
}
