import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fate-Tasker",
  description: "Let fate decide your next hour of productivity",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-notion-bg text-notion-text font-sans">{children}</body>
    </html>
  );
}
