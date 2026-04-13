"use client";

import { useAuth } from "@/lib/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PUBLIC_ROUTES = ["/auth", "/about"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return;

    setIsReady(true);

    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (!isAuthenticated && !isPublic) {
      router.push("/auth");
    } else if (isAuthenticated && pathname === "/auth") {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Don't render until auth is loaded
  if (isLoading || !isReady) {
    return <div className="min-h-screen bg-app-lightMain dark:bg-app-darkMain" />;
  }

  return children;
}
