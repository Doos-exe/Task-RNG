"use client";

import { ThemeToggle } from "@/components/ThemeToggle";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-48 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white flex flex-col overflow-hidden">
      {/* Top Marquee Panel */}
      <div className="bg-gradient-to-b from-red-700 to-red-900 border-b-4 border-yellow-500 p-4 space-y-3 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-black tracking-widest text-yellow-300">
            🎰
          </h1>
          <p className="text-xs font-black text-yellow-400 tracking-widest mt-1">
            TASK RNG
          </p>
          <p className="text-xs text-yellow-200 font-bold mt-1">DELUXE</p>
        </div>
        <div className="flex justify-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400 animate-pulse-delay-1" />
          <div className="w-2 h-2 rounded-full bg-red-400 shadow-lg shadow-red-400 animate-pulse-delay-2" />
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="px-4 py-4 border-b border-yellow-600 bg-gray-800">
        <ThemeToggle />
      </div>

      {/* Main Display Screen */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full bg-gradient-to-b from-black to-gray-900 border-4 border-yellow-600 rounded-lg p-4 shadow-xl relative overflow-hidden">
          {/* Screen Gloss Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-10 pointer-events-none rounded-lg" />

          {/* LCD Screen Content */}
          <div className="relative z-10">
            <div className="text-center mb-3">
              <p className="text-xs font-black text-yellow-400 uppercase tracking-wider mb-2">
                Credits
              </p>
              <p className="text-2xl font-black text-green-400 ledger-font">
                ∞
              </p>
            </div>

            <div className="border-t border-yellow-600 pt-3">
              <p className="text-xs font-black text-yellow-400 uppercase tracking-wider mb-2">
                WIN
              </p>
              <p className="text-xl font-black text-yellow-300 text-center">
                ●●●
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel Section */}
      <div className="px-4 py-4 space-y-4 bg-gradient-to-b from-gray-900 to-black border-t-4 border-yellow-600">
        {/* Info Display */}
        <div className="bg-gray-800 border-2 border-yellow-500 rounded p-3 text-center">
          <p className="text-xs font-black text-yellow-300 uppercase mb-1">
            Status
          </p>
          <p className="text-sm font-bold text-yellow-400">Ready</p>
        </div>

        {/* Coin Slot Visual */}
        <div className="flex justify-center items-center gap-1">
          <div className="w-6 h-6 rounded-full border-3 border-yellow-500 flex items-center justify-center bg-gray-700">
            <div className="w-4 h-4 rounded-full border-2 border-yellow-400" />
          </div>
          <div className="text-xs font-black text-yellow-300">COIN</div>
        </div>

        {/* Bottom Decorative Panel */}
        <div className="bg-gray-950 border-2 border-yellow-600 rounded-full py-2 px-3 flex justify-center">
          <p className="text-xs font-black text-yellow-400">SPIN TO WIN!</p>
        </div>
      </div>

      {/* Base Footer */}
      <div className="h-8 bg-gradient-to-r from-red-900 to-red-950 border-t-4 border-yellow-500 flex items-center justify-center">
        <p className="text-xs font-black text-yellow-300 tracking-wider">
          🍀 LUCK 🍀
        </p>
      </div>
    </aside>
  );
}

