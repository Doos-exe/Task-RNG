"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-96 bg-black text-white flex flex-col overflow-hidden">
      {/* Top Red Header with Logo */}
      <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
        <div className="bg-gradient-to-b from-red-700 to-red-900 border-b-4 border-yellow-500 p-8 space-y-4 shadow-lg">
          {/* TASK RNG Text */}
          <div className="text-center">
            <h1 className="text-5xl font-black tracking-widest text-white" style={{ fontFamily: "Courier New, monospace", letterSpacing: "0.15em" }}>
              TASK RNG
            </h1>
          </div>

          {/* Logo Placeholder */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-yellow-400 bg-gray-300 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-yellow-400" />
            </div>
          </div>
        </div>
      </Link>

      {/* Theme Toggle */}
      <div className="px-6 py-4 border-b-2 border-yellow-600 bg-gray-900">
        <ThemeToggle />
      </div>

      {/* Symbol Placeholders Section - 3 Horizontally */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 py-8">
        <div className="flex gap-3 justify-center items-center h-full w-full">
          <div className="flex-1 h-full border-4 border-yellow-500 bg-gray-300 flex items-center justify-center rounded-md">
            <p className="text-xs font-black text-center">SYMBOL</p>
          </div>
          <div className="flex-1 h-full border-4 border-yellow-500 bg-gray-300 flex items-center justify-center rounded-md">
            <p className="text-xs font-black text-center">SYMBOL</p>
          </div>
          <div className="flex-1 h-full border-4 border-yellow-500 bg-gray-300 flex items-center justify-center rounded-md">
            <p className="text-xs font-black text-center">SYMBOL</p>
          </div>
        </div>
      </div>

      {/* Bottom "GET LUCKY" Button */}
      <div className="px-6 py-6 border-t-4 border-yellow-500 bg-gradient-to-b from-red-900 to-red-950">
        <button className="w-full border-4 border-yellow-500 bg-red-900 hover:bg-red-800 transition-colors py-4 font-black text-white text-lg tracking-wider" style={{ fontFamily: "Courier New, monospace", letterSpacing: "0.1em" }}>
          GET LUCKY !!!
        </button>
      </div>
    </aside>
  );
}

