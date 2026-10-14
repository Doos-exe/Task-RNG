"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ResultTimer } from "@/components/ResultTimer";

interface LayoutProps {
  children: React.ReactNode;
}

const WOOD_BG = `
  repeating-linear-gradient(91.8deg, transparent, transparent 20px, rgba(0,0,0,0.05) 20px, rgba(0,0,0,0.05) 21px),
  linear-gradient(to bottom, #2e1000 0%, #6b3206 12%, #9c4b18 35%, #7a3008 70%, #160600 100%)
`;

function Pocket() {
  return (
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: "50%",
        flexShrink: 0,
        pointerEvents: "none",
        background: `radial-gradient(circle at 50% 50%, #000 0%, #000 34%, #0f0400 48%, #271005 63%, transparent 78%)`,
        boxShadow: "inset 0 6px 24px rgba(0,0,0,1), inset 0 -4px 14px rgba(0,0,0,0.75)",
      }}
    />
  );
}

const LINK_STYLE: React.CSSProperties = {
  fontFamily: "Courier New, monospace",
  fontSize: 10,
  fontWeight: 700,
  color: "#f4d6a1",
  textDecoration: "none",
  textTransform: "uppercase",
  letterSpacing: "0.14em",
};

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-app-lightMain text-app-lightText dark:bg-app-darkMain dark:text-app-darkText">
      <button
        className="fixed left-4 top-4 z-[60] flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-slate-950/90 text-lg text-white shadow-xl backdrop-blur md:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <span aria-hidden="true">☰</span>
      </button>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 flex-1 pt-16 md:ml-72 md:pt-0">{children}</main>

      <ResultTimer result={null} isStarted={false} />

      <footer className="relative w-full select-none">
        <div
          style={{
            height: 6,
            background: "linear-gradient(to bottom, #2b8b5a 0%, #0f4429 55%, #071f12 100%)",
            boxShadow: "inset 0 2px 5px rgba(0,0,0,0.6)",
          }}
        />
        <div
          className="relative"
          style={{
            height: 78,
            background: WOOD_BG,
            boxShadow: "0 -10px 24px rgba(0,0,0,0.5), inset 0 5px 12px rgba(220,160,80,0.09)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center gap-5 md:justify-end md:pr-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-200/60">Task RNG · make progress playful</span>
            <a href="https://github.com/Doos-exe" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={LINK_STYLE}>
              GitHub
            </a>
            <a href="https://deuxmarquez-portfolio.vercel.app" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={LINK_STYLE}>
              Portfolio
            </a>
          </div>
        </div>
        <div style={{ height: 5, background: "linear-gradient(to bottom, #0d0300 0%, #000 100%)" }} />
        <div className="pointer-events-none absolute top-[-23px]" style={{ left: -23 }}>
          <Pocket />
        </div>
        <div className="pointer-events-none absolute left-1/2 top-[-23px] -translate-x-1/2">
          <Pocket />
        </div>
        <div className="pointer-events-none absolute top-[-23px]" style={{ right: -23 }}>
          <Pocket />
        </div>
      </footer>
    </div>
  );
}
