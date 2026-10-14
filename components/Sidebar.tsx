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
const ITEM_H = 42;
const CYCLE_H = EMOJIS.length * ITEM_H;
const REEL_ITEMS = Array(6).fill(EMOJIS).flat() as string[];

function SlotMachineReel({ speed = 1 }: { speed?: number }) {
  return (
    <div
      className="relative flex-1 overflow-hidden rounded-lg border border-amber-400/50 bg-black/50"
      style={{ boxShadow: "inset 0 6px 18px rgba(0,0,0,0.95), inset 0 -6px 18px rgba(0,0,0,0.95)" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-black to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-black to-transparent" />
      <motion.div
        initial={{ y: -CYCLE_H }}
        animate={{ y: 0 }}
        transition={{ duration: 8 / speed, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        className="flex flex-col"
      >
        {REEL_ITEMS.map((emoji, idx) => (
          <div key={idx} style={{ height: ITEM_H, flexShrink: 0 }} className="flex items-center justify-center text-xl">
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

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "⌂" },
  { href: "/spin", label: "Spin", icon: "◉" },
  { href: "/roll", label: "Roll", icon: "⚄" },
  { href: "/bet", label: "Plan tasks", icon: "✓" },
  { href: "/about", label: "How it works", icon: "?" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const setUserId = useTaskStore((state) => state.setUserId);
  const displayName = user?.name || null;
  const isAuthPage = pathname === "/auth";

  useEffect(() => {
    if (isAuthenticated && user?.id) setUserId(user.id);
  }, [user?.id, isAuthenticated, setUserId]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden" onClick={onClose} />}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-hidden border-r border-white/10 bg-[#101821] text-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-[#0b1119] ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <Link href="/" className="group block border-b border-amber-300/20 bg-gradient-to-br from-[#8d3039] via-[#691f2d] to-[#321725] p-5 transition-colors hover:from-[#a43e47]" onClick={onClose}>
          <div className="flex items-center gap-3">
            <Image src={logo} alt="TaskRNG logo" width={58} height={58} priority className="drop-shadow-lg" />
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-amber-200/80">Make progress playful</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight">TASK RNG</h1>
            </div>
          </div>
        </Link>

        <div className="border-b border-white/10 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</span>
            <ThemeToggle />
          </div>
        </div>

        <nav className="space-y-1 px-3 py-4" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${isActive ? "bg-amber-300/15 text-amber-200 shadow-inner" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-base ${isActive ? "bg-amber-300 text-slate-900" : "bg-white/5 text-slate-300"}`} aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex min-h-0 flex-1 gap-1.5 px-3 pb-4 pt-2">
          <SlotMachineReel speed={1} />
          <SlotMachineReel speed={0.8} />
          <SlotMachineReel speed={1.2} />
        </div>

        <div className="border-t border-amber-300/20 bg-gradient-to-b from-[#351a27] to-[#17131c] px-4 py-4">
          {user && (
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-300 font-black text-slate-900">
                {(displayName || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber-200/60">Signed in as</p>
                <p className="truncate text-sm font-semibold text-white">{displayName || user.email?.split("@")[0] || "User"}</p>
              </div>
            </div>
          )}
          {!isAuthPage && (
            <button onClick={handleLogout} className="w-full rounded-lg border border-white/15 bg-white/5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-200 transition hover:border-amber-300/60 hover:bg-amber-300/10 hover:text-amber-100">
              Log out
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
