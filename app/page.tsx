"use client";
/*
  This is the home page or the landing page of the website.
  The main entry point for users to navigate the different features of the website.
*/

import { PokerChip } from "@/components/PokerChip";

export default function Home() {
  return (
    <main className="min-h-screen bg-app-lightMain dark:bg-app-darkMain text-app-lightText dark:text-app-darkText flex items-center justify-center">
      {/* Chip container — uses percentage positions for the scattered look, sized so chips fit on all screens */}
      <div className="relative w-full h-[65vh] md:h-[85vh]">
        {/* SPIN - Top Left */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2">
          <PokerChip label="SPIN" href="/spin" />
        </div>

        {/* BET - Top Right */}
        <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2">
          <PokerChip label="BET" href="/bet" />
        </div>

        {/* ROLL - Bottom, slightly left of center (offset from SPIN for the messy feel) */}
        <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 translate-y-1/2">
          <PokerChip label="ROLL" href="/roll" />
        </div>

        {/* ABOUT - Bottom Right */}
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2">
          <PokerChip label="ABOUT" href="/about" />
        </div>
      </div>
    </main>
  );
}
