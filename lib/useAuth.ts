import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  theme?: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error?: string; success?: boolean }>;
  signin: (
    email: string,
    password: string
  ) => Promise<{ error?: string; success?: boolean }>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check session on mount and subscribe to auth changes
  useEffect(() => {
    setIsLoading(true);

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ error?: string; success?: boolean }> => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        return { error: error || "Signup failed" };
      }

      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return { error: "Signup failed - check your connection" };
    }
  };

  const signin = async (
    email: string,
    password: string
  ): Promise<{ error?: string; success?: boolean }> => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        return { error: error || "Sign in failed" };
      }

      const data = await response.json();

      // Restore the session on the client-side Supabase instance
      if (data.session?.access_token) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }

      // Auth state will update automatically via onAuthStateChange
      return { success: true };
    } catch (error) {
      console.error("Signin error:", error);
      return { error: "Sign in failed - check your connection" };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    signup,
    signin,
    logout,
  };
}
