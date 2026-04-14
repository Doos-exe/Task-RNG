"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/useAuth";
import { useTaskStore } from "@/lib/store";
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
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const setUserId = useTaskStore((state) => state.setUserId);

  // Get display name from user object
  const displayName = user?.name || null;

  // Set userId in store when user authenticates
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      setUserId(user.id);
    }
  }, [user?.id, isAuthenticated, setUserId]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  const isAuthPage = pathname === "/auth";

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

      {/* Bottom: User Info and Logout */}
      <div className="px-6 py-6 border-t-4 border-yellow-500 bg-gradient-to-b from-red-900 to-red-950 space-y-4">
        {user && (
          <div className="text-center mb-4 pb-4 border-b border-yellow-600">
            <p className="text-sm text-gray-300">Welcome,</p>
            <p className="font-bold text-white truncate">{displayName || user.email?.split("@")[0] || "User"}</p>
          </div>
        )}
        {!isAuthPage && (
          <button
            onClick={handleLogout}
            className="w-full border-2 border-yellow-500 bg-red-700 hover:bg-red-600 transition-colors py-3 font-bold text-white text-sm tracking-wider"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            LOGOUT
          </button>
        )}
      </div>
    </aside>
  );
}

