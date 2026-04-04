"use client";

import Link from "next/link";

interface PokerChipProps {
  label: string;
  href: string;
  className?: string;
}

export function PokerChip({ label, href, className = "" }: PokerChipProps) {
  return (
    <Link href={href}>
      <div
        className={`w-32 h-32 rounded-full border-8 border-white bg-black flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg relative ${className}`}
      >
        {/* Outer decorative ring */}
        <div className="absolute inset-0 rounded-full border-4 border-white opacity-50"></div>
        {/* Inner content */}
        <span className="text-white font-bold text-sm text-center relative z-10">{label}</span>
      </div>
    </Link>
  );
}
