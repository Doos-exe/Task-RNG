"use client";
/*
  This is the home page or the landing page of the website.
  The main entry point for users to navigate the different features of the website.
*/

import { PokerChip } from "@/components/PokerChip";

export default function Home() {
  return (
    <main className="min-h-screen bg-app-lightMain dark:bg-app-darkMain text-app-lightText dark:text-app-darkText p-8 flex items-center justify-center">
      {/* Poker Chips Container */}
      <div className="relative w-full h-screen max-h-screen flex items-center justify-center">
        {/* SPIN - Top Left */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2">
          <PokerChip label="SPIN" href="/spin" />
        </div>

        {/* BET - Top Right */}
        <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2">
          <PokerChip label="BET" href="/bet" />
        </div>

        {/* ROLL - Center */}
        <div className="absolute left-1/3 bottom-1/4 -translate-x-1/2 translate-y-1/2">
          <PokerChip label="ROLL" href="/roll" />
        </div>

        {/* ABOUT - Bottom Right */}
        <div className="absolute right-1/4 bottom-1/4 translate-x-1/2 translate-y-1/2">
          <PokerChip label="ABOUT" href="/about" />
        </div>
      </div>
    </main>
  );
}
