"use client";

import { useEffect } from "react";
import { useTaskStore, setCurrentUserId } from "@/lib/store";
import { useAuth } from "@/lib/useAuth";
import { Layout } from "@/components/Layout";
import { AuthGuard } from "@/components/AuthGuard";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const theme = useTaskStore((state) => state.theme);
  const setUserId = useTaskStore((state) => state.setUserId);
  const clearTimer = useTaskStore((state) => state.clearTimer);
  const { user } = useAuth();

  // Restore user data when authenticated
  useEffect(() => {
    if (user?.id) {
      // User is logged in - restore their data
      setUserId(user.id);
      // Clear page-specific UI state to prevent stale UI
      localStorage.removeItem('spinPageState');
      localStorage.removeItem('rollPageState');
    } else {
      // User is logged out - clear the active timer but keep other data
      clearTimer();
      // Don't call setUserId(null) to preserve data in localStorage
    }
  }, [user?.id, setUserId, clearTimer]);

  useEffect(() => {
    // Apply theme class to HTML element
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [theme]);

  return (
    <AuthGuard>
      <Layout>{children}</Layout>
    </AuthGuard>
  );
}
