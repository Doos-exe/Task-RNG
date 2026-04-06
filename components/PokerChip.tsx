"use client";

import Link from "next/link";
import { useTaskStore } from "@/lib/store";

interface PokerChipProps {
  label: string;
  href: string;
  className?: string;
}

export function PokerChip({ label, href, className = "" }: PokerChipProps) {
  const theme = useTaskStore((state) => state.theme);

  return (
    <Link href={href}>
      <div
        className={`w-64 h-64 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform relative ${className}`}
        style={{
          backgroundImage: `url(/Elements/${theme === "dark" ? "DarkMode" : "LightMode"}.png)`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Text on top of image */}
        <span
          className={`${theme === "dark" ? "text-white" : "text-black"} text-center relative z-10 drop-shadow-lg px-3 break-words`}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.3rem",
            fontWeight: 900,
            letterSpacing: "0.02em",
            lineHeight: "1.1",
            maxWidth: "85%",
            wordBreak: "break-word",
          }}
        >
          {label}
        </span>
      </div>
    </Link>
  );
}

