import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, name: string) => void;
  signup: (email: string, password: string, name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, password: string, name: string) => {
        // Simple client-side auth (for demo purposes)
        // In production, you'd validate against a backend
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
        };
        set({ user, isAuthenticated: true });
      },
      signup: (email: string, password: string, name: string) => {
        // Simple client-side auth (for demo purposes)
        // In production, you'd validate against a backend
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
        };
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-store",
    }
  )
);
