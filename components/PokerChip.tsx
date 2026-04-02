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
        className={`w-32 h-32 rounded-full border-8 border-white bg-black flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${className}`}
      >
        <span className="text-white font-bold text-lg text-center">{label}</span>
      </div>
    </Link>
  );
}
