import { create } from "zustand";

// Global variable to track current userId for storage
let currentUserId: string | null = null;

export const setCurrentUserId = (userId: string | null) => {
  currentUserId = userId;
};

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
  source?: "spin" | "roll"; // Which page the timer was created from
}

interface TaskStore {
  userId: string | null;
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
  setUserId: (userId: string | null) => void;
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
  startTimer: (result: string, isTask: boolean, taskPriority?: "low" | "medium" | "high", source?: "spin" | "roll") => void;
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

// Helper function to save store to localStorage
const saveToLocalStorage = (state: TaskStore) => {
  if (!currentUserId) return;
  try {
    const userKey = `task-rng-store-${currentUserId}`;
    localStorage.setItem(userKey, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save store to localStorage:", e);
  }
};

// Helper function to load store from localStorage
const loadFromLocalStorage = (userId: string): TaskStore | null => {
  try {
    const userKey = `task-rng-store-${userId}`;
    const stored = localStorage.getItem(userKey);
    if (!stored || stored === "[object Object]") return null;
    const parsed = JSON.parse(stored);
    return parsed as TaskStore;
  } catch (e) {
    console.error("Failed to load store from localStorage:", e);
    return null;
  }
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  userId: null,
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

  setUserId: (userId: string | null) => {
    setCurrentUserId(userId);

    if (userId) {
      // Try to load user data from localStorage
      const loaded = loadFromLocalStorage(userId);
      if (loaded) {
        set(loaded);
        return;
      }
    }

    // If no stored data, reset to default state
    set({
      userId,
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
    });
  },

  addTask: (title: string, priority?: "low" | "medium" | "high", emoji: string = "✓") =>
    set((state) => {
      const newState = {
        ...state,
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
      };
      saveToLocalStorage(newState);
      return newState;
    }),

  removeTask: (id) =>
    set((state) => {
      const newState = {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== id),
      };
      saveToLocalStorage(newState);
      return newState;
    }),

  toggleTask: (id) =>
    set((state) => {
      const newState = {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        ),
      };
      saveToLocalStorage(newState);
      return newState;
    }),

  updateTask: (id, title) =>
    set((state) => {
      const newState = {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, title } : task
        ),
      };
      saveToLocalStorage(newState);
      return newState;
    }),

  updateTaskEmoji: (id, emoji) =>
    set((state) => {
      const newState = {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, emoji } : task
        ),
      };
      saveToLocalStorage(newState);
      return newState;
    }),

  pendingCount: () => {
    return get().tasks.filter((task) => !task.completed).length;
  },

  addCoins: (amount: number) =>
    set((state) => {
      const newState = {
        ...state,
        coins: state.coins + amount,
      };
      saveToLocalStorage(newState);
      return newState;
    }),

  spendCoins: (amount: number) => {
    const currentCoins = get().coins;
    if (currentCoins >= amount) {
      set((state) => {
        const newState = {
          ...state,
          coins: state.coins - amount,
        };
        saveToLocalStorage(newState);
        return newState;
      });
      return true;
    }
    return false;
  },

  resetCoins: () =>
    set((state) => {
      const newState = {
        ...state,
        coins: 0,
      };
      saveToLocalStorage(newState);
      return newState;
    }),

  getSkipCost: () => {
    return get().currentSkipCost;
  },

  checkAndResetSkipCostIfNewDay: () => {
    const today = new Date().toDateString();
    const lastDate = get().lastSpinSkipDate;

    if (lastDate !== today) {
      set((state) => {
        const newState = {
          ...state,
          lastSpinSkipDate: today,
          currentSkipCost: 1,
        };
        saveToLocalStorage(newState);
        return newState;
      });
    }
  },

  useSkip: () => {
    const skipCost = get().getSkipCost();
    const spent = get().spendCoins(skipCost);

    if (spent) {
      set((state) => {
        const newState = {
          ...state,
          currentSkipCost: state.currentSkipCost * 2,
        };
        saveToLocalStorage(newState);
        return newState;
      });
      return true;
    }
    return false;
  },

  setTheme: (theme: "light" | "dark") =>
    set((state) => {
      const newState = {
        ...state,
        theme,
      };
      saveToLocalStorage(newState);
      return newState;
    }),

  addLeisure: (title) =>
    set((state) => {
      const newState = {
        ...state,
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
      };
      saveToLocalStorage(newState);
      return newState;
    }),

  removeLeisure: (id) =>
    set((state) => {
      const newState = {
        ...state,
        leisures: state.leisures.filter((leisure) => leisure.id !== id || leisure.isDefault),
      };
      saveToLocalStorage(newState);
      return newState;
    }),

  updateLeisure: (id, title) =>
    set((state) => {
      const newState = {
        ...state,
        leisures: state.leisures.map((leisure) =>
          leisure.id === id ? { ...leisure, title } : leisure
        ),
      };
      saveToLocalStorage(newState);
      return newState;
    }),

  updateLeisureEmoji: (id, emoji) =>
    set((state) => {
      const newState = {
        ...state,
        leisures: state.leisures.map((leisure) =>
          leisure.id === id ? { ...leisure, emoji } : leisure
        ),
      };
      saveToLocalStorage(newState);
      return newState;
    }),

  getLeisures: () => {
    return get().leisures;
  },

  addToSpinHistory: (item: string) => {
    set((state) => {
      const newState = {
        ...state,
        spinHistory: [item, ...state.spinHistory].slice(0, 3),
      };
      saveToLocalStorage(newState);
      return newState;
    });
  },

  recordSpinOutcome: (isTask: boolean) => {
    set((state) => {
      let newState;
      if (isTask) {
        newState = {
          ...state,
          taskConsecutiveCount: state.taskConsecutiveCount + 1,
          leisureConsecutiveCount: 0,
        };
      } else {
        newState = {
          ...state,
          leisureConsecutiveCount: state.leisureConsecutiveCount + 1,
          taskConsecutiveCount: 0,
        };
      }
      saveToLocalStorage(newState);
      return newState;
    });
  },

  startTimer: (result: string, isTask: boolean, taskPriority?: "low" | "medium" | "high", source?: "spin" | "roll") => {
    let duration = 0;

    if (result === "Rest" || result === "Game") {
      const options = [30, 45, 60];
      const randomIndex = Math.floor(Math.random() * options.length);
      duration = options[randomIndex] * 60;
    } else if (isTask) {
      if (taskPriority === "low") {
        duration = 30 * 60;
      } else if (taskPriority === "medium") {
        duration = 45 * 60;
      } else if (taskPriority === "high") {
        duration = 60 * 60;
      } else {
        duration = 45 * 60;
      }
    } else {
      duration = 45 * 60;
    }

    set((state) => {
      const newState = {
        ...state,
        activeTimer: {
          result,
          isTask,
          taskPriority,
          startTime: Date.now(),
          duration,
          source,
        },
      };
      saveToLocalStorage(newState);
      return newState;
    });
  },

  clearTimer: () => {
    set((state) => {
      const newState = {
        ...state,
        activeTimer: null,
      };
      saveToLocalStorage(newState);
      return newState;
    });
  },
}));
