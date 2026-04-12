"use client";

import { useAuthStore } from "@/lib/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PUBLIC_ROUTES = ["/auth"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Allow hydration to complete
    setIsReady(true);

    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (!isAuthenticated && !isPublic) {
      router.push("/auth");
    } else if (isAuthenticated && pathname === "/auth") {
      router.push("/");
    }
  }, [isAuthenticated, pathname, router]);

  // Don't render until hydration is complete
  if (!isReady) {
    return null;
  }

  return children;
}
