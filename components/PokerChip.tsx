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
        className={`w-40 h-40 rounded-full border-8 border-black bg-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-2xl relative ${className}`}
        style={{
          clipPath: "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
        }}
      >
        {/* Diamond facets - top right */}
        <div
          className="absolute top-0 right-0 w-1/3 h-1/3 bg-gray-300 opacity-60"
          style={{
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
          }}
        />
        {/* Diamond facets - bottom left */}
        <div
          className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gray-200 opacity-60"
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          }}
        />
        {/* Diamond facets - top left */}
        <div
          className="absolute top-0 left-0 w-1/4 h-1/4 bg-gray-400 opacity-40"
          style={{
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
          }}
        />
        {/* Diamond facets - bottom right */}
        <div
          className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-gray-100 opacity-40"
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          }}
        />
        {/* Center circle with content */}
        <div className="absolute inset-0 flex items-center justify-center rounded-lg">
          <span className="text-black font-black text-lg text-center relative z-10">
            {label}
          </span>
        </div>
      </div>
    </Link>
  );
}

