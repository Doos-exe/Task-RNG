"use client";

import { useEffect, useState } from "react";
import { useTaskStore } from "@/lib/store";
import { Layout } from "@/components/Layout";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const theme = useTaskStore((state) => state.theme);

  useEffect(() => {
    setMounted(true);
    // Apply theme on mount
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return <Layout>{children}</Layout>;
}
