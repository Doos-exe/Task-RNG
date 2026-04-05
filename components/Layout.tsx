"use client";

import { Sidebar } from "@/components/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-app-lightMain dark:bg-app-darkMain text-app-lightText dark:text-app-darkText">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-96 w-full md:w-auto">{children}</main>
    </div>
  );
}
