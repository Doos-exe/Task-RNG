"use client";

import { useTaskStore } from "@/lib/store";

export function ThemeToggle() {
  const { theme, setTheme } = useTaskStore();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-bold hover:opacity-80 transition shadow-md"
      title="Toggle theme"
    >
      {theme === "light" ? "☀️" : "🌙"}
    </button>
  );
}
