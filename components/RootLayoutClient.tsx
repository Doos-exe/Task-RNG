"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/lib/store";
import { Layout } from "@/components/Layout";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const theme = useTaskStore((state) => state.theme);

  useEffect(() => {
    // Apply theme class to HTML element
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [theme]);

  return <Layout>{children}</Layout>;
}
