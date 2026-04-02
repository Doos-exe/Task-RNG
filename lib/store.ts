import { create } from "zustand";

export interface Task {
  id: string;
  title: string;
  createdAt: number;
  completed: boolean;
  priority?: "low" | "medium" | "high";
}

interface TaskStore {
  tasks: Task[];
  addTask: (title: string, priority?: "low" | "medium" | "high") => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, title: string) => void;
  pendingCount: () => number;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],

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
}));
