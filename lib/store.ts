import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Task {
  id: string;
  title: string;
  emoji: string;
  createdAt: number;
  completed: boolean;
  priority?: "low" | "medium" | "high";
}

export interface Leisure {
  id: string;
  title: string;
  emoji: string;
  createdAt: number;
  isDefault: boolean;
}

export interface ActiveTimer {
  result: string;
  isTask: boolean;
  taskPriority?: "low" | "medium" | "high";
  startTime: number;
  duration: number; // in seconds
}

interface TaskStore {
  tasks: Task[];
  leisures: Leisure[];
  coins: number;
  theme: "light" | "dark";
  lastSpinSkipDate: string;
  currentSkipCost: number;
  spinHistory: string[];
  taskConsecutiveCount: number;
  leisureConsecutiveCount: number;
  activeTimer: ActiveTimer | null;
  addTask: (title: string, priority?: "low" | "medium" | "high", emoji?: string) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, title: string) => void;
  updateTaskEmoji: (id: string, emoji: string) => void;
  pendingCount: () => number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  resetCoins: () => void;
  getSkipCost: () => number;
  checkAndResetSkipCostIfNewDay: () => void;
  useSkip: () => boolean;
  setTheme: (theme: "light" | "dark") => void;
  addLeisure: (title: string) => void;
  removeLeisure: (id: string) => void;
  updateLeisure: (id: string, title: string) => void;
  updateLeisureEmoji: (id: string, emoji: string) => void;
  getLeisures: () => Leisure[];
  addToSpinHistory: (item: string) => void;
  recordSpinOutcome: (isTask: boolean) => void;
  startTimer: (result: string, isTask: boolean, taskPriority?: "low" | "medium" | "high") => void;
  clearTimer: () => void;
}

const DEFAULT_LEISURES: Leisure[] = [
  {
    id: "leisure-rest",
    title: "Rest",
    emoji: "😴",
    createdAt: Date.now(),
    isDefault: true,
  },
  {
    id: "leisure-game",
    title: "Game",
    emoji: "🎮",
    createdAt: Date.now(),
    isDefault: true,
  },
];

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      leisures: DEFAULT_LEISURES,
      coins: 0,
      theme: "light",
      lastSpinSkipDate: "",
      currentSkipCost: 1,
      spinHistory: [],
      taskConsecutiveCount: 0,
      leisureConsecutiveCount: 0,
      activeTimer: null,

  addTask: (title: string, priority?: "low" | "medium" | "high", emoji: string = "✓") =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: Date.now().toString(),
          title,
          emoji,
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

      updateTaskEmoji: (id, emoji) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, emoji } : task
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

      resetCoins: () =>
        set({
          coins: 0,
        }),

      getSkipCost: () => {
        return get().currentSkipCost;
      },

      checkAndResetSkipCostIfNewDay: () => {
        const today = new Date().toDateString();
        const lastDate = get().lastSpinSkipDate;

        // If it's a new day, reset the cost to 1
        if (lastDate !== today) {
          set({
            lastSpinSkipDate: today,
            currentSkipCost: 1,
          });
        }
      },

      useSkip: () => {
        const skipCost = get().getSkipCost();
        const spent = get().spendCoins(skipCost);

        if (spent) {
          // Double the cost for next skip
          set((state) => ({
            currentSkipCost: state.currentSkipCost * 2,
          }));
          return true;
        }
        return false;
      },

      setTheme: (theme: "light" | "dark") =>
        set({
          theme,
        }),

      addLeisure: (title) =>
        set((state) => ({
          leisures: [
            ...state.leisures,
            {
              id: Date.now().toString(),
              title,
              emoji: "🎯",
              createdAt: Date.now(),
              isDefault: false,
            },
          ],
        })),

      removeLeisure: (id) =>
        set((state) => ({
          leisures: state.leisures.filter((leisure) => leisure.id !== id || leisure.isDefault),
        })),

      updateLeisure: (id, title) =>
        set((state) => ({
          leisures: state.leisures.map((leisure) =>
            leisure.id === id ? { ...leisure, title } : leisure
          ),
        })),

      updateLeisureEmoji: (id, emoji) =>
        set((state) => ({
          leisures: state.leisures.map((leisure) =>
            leisure.id === id ? { ...leisure, emoji } : leisure
          ),
        })),

      getLeisures: () => {
        return get().leisures;
      },

      addToSpinHistory: (item: string) => {
        set((state) => ({
          spinHistory: [item, ...state.spinHistory].slice(0, 3),
        }));
      },

      recordSpinOutcome: (isTask: boolean) => {
        set((state) => {
          if (isTask) {
            return {
              taskConsecutiveCount: state.taskConsecutiveCount + 1,
              leisureConsecutiveCount: 0,
            };
          } else {
            return {
              leisureConsecutiveCount: state.leisureConsecutiveCount + 1,
              taskConsecutiveCount: 0,
            };
          }
        });
      },

      startTimer: (result: string, isTask: boolean, taskPriority?: "low" | "medium" | "high") => {
        let duration = 0;

        if (result === "Rest" || result === "Game") {
          // Randomize between 30, 45, or 60 minutes
          const options = [30, 45, 60];
          const randomIndex = Math.floor(Math.random() * options.length);
          duration = options[randomIndex] * 60; // Convert to seconds
        } else if (isTask) {
          // For Tasks, use priority to determine duration
          if (taskPriority === "low") {
            duration = 30 * 60;
          } else if (taskPriority === "medium") {
            duration = 45 * 60;
          } else if (taskPriority === "high") {
            duration = 60 * 60;
          } else {
            duration = 45 * 60; // Default to medium
          }
        } else {
          // Default leisure duration
          duration = 45 * 60;
        }

        set({
          activeTimer: {
            result,
            isTask,
            taskPriority,
            startTime: Date.now(),
            duration,
          },
        });
      },

      clearTimer: () => {
        set({
          activeTimer: null,
        });
      },
    }),
    {
      name: "task-rng-store",
    }
  )
);
