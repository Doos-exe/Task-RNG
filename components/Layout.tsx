"use client";

import { Sidebar } from "@/components/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-task-lightBg dark:bg-task-main">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-48 w-full md:w-auto">{children}</main>
    </div>
  );
}
