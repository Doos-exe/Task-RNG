import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Task {
  id: string;
  title: string;
  createdAt: number;
  completed: boolean;
  priority?: "low" | "medium" | "high";
}

interface TaskStore {
  tasks: Task[];
  coins: number;
  theme: "light" | "dark";
  addTask: (title: string, priority?: "low" | "medium" | "high") => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, title: string) => void;
  pendingCount: () => number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  setTheme: (theme: "light" | "dark") => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      coins: 0,
      theme: "light",

      addTask: (title, priority = "medium") =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: Date.now().toString(),
              title,
              createdAt: Date.now(),
              completed: false,
              priority,
            },
          ],
        })),

      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),

      updateTask: (id, title) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, title } : task
          ),
        })),

      pendingCount: () => {
        return get().tasks.filter((task) => !task.completed).length;
      },

      addCoins: (amount: number) =>
        set((state) => ({
          coins: state.coins + amount,
        })),

      spendCoins: (amount: number) => {
        const currentCoins = get().coins;
        if (currentCoins >= amount) {
          set((state) => ({
            coins: state.coins - amount,
          }));
          return true;
        }
        return false;
      },

      setTheme: (theme: "light" | "dark") =>
        set({
          theme,
        }),
    }),
    {
      name: "task-rng-store",
    }
  )
);
