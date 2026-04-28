"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ResultTimer } from "@/components/ResultTimer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-app-lightMain dark:bg-app-darkMain text-app-lightText dark:text-app-darkText">
      {/* Mobile hamburger button */}
      <button
        className="fixed top-4 left-4 z-[60] md:hidden bg-black text-white p-2 rounded-md border-2 border-yellow-500 text-xl leading-none w-10 h-10 flex items-center justify-center"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content — offset by sidebar width on md+ and leave room for hamburger on mobile */}
      <main className="flex-1 md:ml-96 min-w-0 pt-14 md:pt-0">{children}</main>

      <ResultTimer result={null} isStarted={false} />
    </div>
  );
}
