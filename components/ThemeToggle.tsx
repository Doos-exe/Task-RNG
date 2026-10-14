"use client";

import { useTaskStore } from "@/lib/store";

export function ThemeToggle() {
  const { theme, setTheme } = useTaskStore();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300 transition hover:border-amber-300/50 hover:bg-amber-300/10 hover:text-amber-100"
      title="Toggle theme"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      <span className="text-sm" aria-hidden="true">{theme === "light" ? "☀" : "☾"}</span>
      <span>{theme === "light" ? "Light" : "Dark"}</span>
    </button>
  );
}
