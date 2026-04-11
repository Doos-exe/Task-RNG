"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/Elements/TaskRNG_Logo.png";

const EMOJIS = ["🎲", "🎮", "🎯", "🎪", "🎨", "🎭", "🎬", "🎤", "🎧", "🎸", "🎹", "🏆", "💎", "⭐", "✨", "🔥", "💫", "🎰", "🃏", "🌟"];

function SlotMachineReel({ speed = 1 }) {
  // Create a long list of repeated emojis for seamless scrolling
  const reelEmojis = Array(50).fill(EMOJIS).flat();

  return (
    <div className="flex-1 h-full border-4 border-yellow-500 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-md shadow-md overflow-hidden flex items-center justify-center">
      <motion.div
        animate={{ y: 2000 }}
        transition={{
          duration: 20 / speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex flex-col gap-2"
        style={{ y: -2000 }}
      >
        {reelEmojis.map((emoji, idx) => (
          <div
            key={idx}
            className="text-4xl font-black text-center"
          >
            {emoji}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

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

          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src={logo}
              alt="TaskRNG Logo"
              width={96}
              height={96}
              priority
            />
          </div>
        </div>
      </Link>

      {/* Theme Toggle */}
      <div className="px-6 py-4 border-b-2 border-yellow-600 bg-gray-900">
        <ThemeToggle />
      </div>

      {/* Middle: Slot Machine Reels - 3 Horizontally */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 py-8 min-h-0">
        <div className="flex gap-3 justify-center items-center h-full w-full">
          <SlotMachineReel speed={1} />
          <SlotMachineReel speed={0.8} />
          <SlotMachineReel speed={1.2} />
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

