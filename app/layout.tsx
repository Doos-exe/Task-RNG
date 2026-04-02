import type { Metadata } from "next";
import "./globals.css";
import { RootLayoutClient } from "@/components/RootLayoutClient";

export const metadata: Metadata = {
  title: "Task RNG",
  description: "Let fate decide your tasks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-task-lightBg text-task-lightText dark:bg-task-main dark:text-white font-sans">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
