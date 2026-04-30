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

const ITEM_H = 48;
// One full emoji cycle: y=0 and y=-CYCLE_H show the same content, so the loop reset is invisible.
const CYCLE_H = EMOJIS.length * ITEM_H;
const REEL_ITEMS = Array(6).fill(EMOJIS).flat() as string[];

function SlotMachineReel({ speed = 1 }: { speed?: number }) {
  return (
    <div
      className="flex-1 min-h-0 rounded-md border-[3px] border-yellow-500 bg-black overflow-hidden relative"
      style={{ boxShadow: "inset 0 6px 18px rgba(0,0,0,0.95), inset 0 -6px 18px rgba(0,0,0,0.95)" }}
    >
      {/* top fade */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10"
        style={{ height: 40, background: "linear-gradient(to bottom, #000 25%, transparent)" }}
      />
      {/* bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        style={{ height: 40, background: "linear-gradient(to top, #000 25%, transparent)" }}
      />
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: -CYCLE_H }}
        transition={{
          duration: 8 / speed,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col"
      >
        {REEL_ITEMS.map((emoji, idx) => (
          <div
            key={idx}
            style={{ height: ITEM_H, flexShrink: 0 }}
            className="flex items-center justify-center text-2xl"
          >
            {emoji}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const setUserId = useTaskStore((state) => state.setUserId);

  const displayName = user?.name || null;

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
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed left-0 top-0 h-screen w-80 md:w-96 bg-black text-white flex flex-col overflow-hidden z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top Red Header with Logo */}
        <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={onClose}>
          <div className="bg-gradient-to-b from-red-700 to-red-900 border-b-4 border-yellow-500 p-6 md:p-8 space-y-4 shadow-lg">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-black tracking-widest text-white" style={{ fontFamily: "Courier New, monospace", letterSpacing: "0.15em" }}>
                TASK RNG
              </h1>
            </div>
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
        <div className="flex-1 flex gap-2 px-3 py-6 min-h-0">
          <SlotMachineReel speed={1} />
          <SlotMachineReel speed={0.8} />
          <SlotMachineReel speed={1.2} />
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
    </>
  );
}
