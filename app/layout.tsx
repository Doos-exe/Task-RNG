import type { Metadata } from "next";
import "./globals.css";
import { RootLayoutClient } from "@/components/RootLayoutClient";

export const metadata: Metadata = {
  title: "Task RNG | Playful productivity",
  description: "A playful productivity desk for making the next move easier.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-app-lightMain text-app-lightText dark:bg-app-darkMain dark:text-app-darkText font-sans">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
