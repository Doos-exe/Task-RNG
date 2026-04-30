"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ResultTimer } from "@/components/ResultTimer";

interface LayoutProps {
  children: React.ReactNode;
}

const WOOD_BG = `
  repeating-linear-gradient(91.8deg, transparent, transparent 20px, rgba(0,0,0,0.04) 20px, rgba(0,0,0,0.04) 21px),
  repeating-linear-gradient(88.2deg, transparent, transparent 55px, rgba(255,255,255,0.028) 55px, rgba(255,255,255,0.028) 56px),
  linear-gradient(to bottom,
    #2e1000 0%, #6b3206 8%, #9c4b18 22%,
    #b8652e 38%, #a85520 52%, #7a3008 68%,
    #471a06 84%, #160600 100%
  )
`;

// Pocket sits at the felt/wood boundary — edge fades to transparent so it blends with
// the green felt above and the wood grain below, looking carved into the junction.
function Pocket() {
  return (
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        flexShrink: 0,
        pointerEvents: "none",
        background: `radial-gradient(circle at 50% 50%,
          #000 0%, #000 30%,
          #0f0400 42%, #271005 56%,
          transparent 74%
        )`,
        boxShadow: "inset 0 6px 28px rgba(0,0,0,1), inset 0 -4px 14px rgba(0,0,0,0.75)",
      }}
    />
  );
}

const LINK_STYLE: React.CSSProperties = {
  fontFamily: "Courier New, monospace",
  fontSize: 11,
  fontWeight: 700,
  color: "#d4a050",
  textDecoration: "none",
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  textShadow: "0 1px 4px rgba(0,0,0,0.95), 0 0 10px rgba(180,130,40,0.25)",
};

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-app-lightMain dark:bg-app-darkMain text-app-lightText dark:text-app-darkText">
      {/* Mobile hamburger button */}
      <button
        className="fixed top-4 left-4 z-[60] md:hidden bg-black text-white p-2 rounded-md border-2 border-yellow-500 text-xl leading-none w-10 h-10 flex items-center justify-center"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 md:ml-96 min-w-0 pt-14 md:pt-0">{children}</main>

      <ResultTimer result={null} isStarted={false} />

      {/* Pool-table wood rail footer */}
      <footer className="relative w-full select-none">
        {/* Felt cushion lip */}
        <div
          style={{
            height: 8,
            background: "linear-gradient(to bottom, #22754a 0%, #0f4429 55%, #071f12 100%)",
            boxShadow: "inset 0 2px 5px rgba(0,0,0,0.6)",
          }}
        />

        {/* Wood rail body */}
        <div
          className="relative"
          style={{
            height: 100,
            background: WOOD_BG,
            boxShadow: "0 -10px 24px rgba(0,0,0,0.7), inset 0 5px 12px rgba(220,160,80,0.09)",
          }}
        >
          {/* Left section — decorative label */}
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{ left: 20, right: "calc(50% + 44px)", top: "50%", transform: "translateY(-50%)" }}
          >
            <span style={{ ...LINK_STYLE, color: "#a07838", letterSpacing: "0.2em" }}>
              ◆&nbsp; TASK RNG &nbsp;◆
            </span>
          </div>

          {/* Right section — programmer links */}
          {/* TODO: replace href values with your actual URLs */}
          <div
            className="absolute flex items-center justify-center gap-4"
            style={{ left: "calc(50% + 44px)", right: 20, top: "50%", transform: "translateY(-50%)" }}
          >
            <a
              href="https://github.com/Doos"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              style={LINK_STYLE}
            >
              GitHub
            </a>
            <span style={{ ...LINK_STYLE, color: "#6b4a22" }}>·</span>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              style={LINK_STYLE}
            >
              Portfolio
            </a>
            <span style={{ ...LINK_STYLE, color: "#6b4a22" }}>·</span>
            <a
              href="mailto:deuxm29.com@gmail.com"
              className="hover:opacity-70 transition-opacity"
              style={LINK_STYLE}
            >
              Contact
            </a>
          </div>
        </div>

        {/* Bottom shadow strip */}
        <div
          style={{
            height: 6,
            background: "linear-gradient(to bottom, #0d0300 0%, #000 100%)",
          }}
        />

        {/* Pocket holes — centred on the felt/wood boundary (top: -36 = half of 72px height)
            Corner pockets bleed past the viewport edge; the browser clips them naturally. */}
        <div className="absolute pointer-events-none" style={{ left: -36, top: -36 }}>
          <Pocket />
        </div>
        <div className="absolute pointer-events-none" style={{ left: "50%", top: -36, transform: "translateX(-50%)" }}>
          <Pocket />
        </div>
        <div className="absolute pointer-events-none" style={{ right: -36, top: -36 }}>
          <Pocket />
        </div>
      </footer>
    </div>
  );
}
