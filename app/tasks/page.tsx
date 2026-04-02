"use client";

import { useState } from "react";
import { useTaskStore, Task } from "@/lib/store";

export default function TasksPage() {
  const { tasks, addTask, removeTask } = useTaskStore();
  const [input, setInput] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<
    "low" | "medium" | "high"
  >("medium");

  const handleAdd = () => {
    if (input.trim()) {
      addTask(input.trim(), selectedPriority);
      setInput("");
    }
  };

  const pendingTasks = tasks.filter((t) => !t.completed);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-red-600 dark:text-red-400";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "low":
        return "text-green-600 dark:text-green-400";
      default:
        return "";
    }
  };

  const getTimer = (risk: string) => {
    switch (risk) {
      case "high":
        return "60 mins";
      case "medium":
        return "45 mins";
      case "low":
        return "30 mins";
      default:
        return "-";
    }
  };

  return (
    <main className="min-h-screen bg-task-lightBg dark:bg-task-main dark:text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 dark:text-white">Tasks</h1>

        {/* Add Task Input */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-task-lightText dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-task-sidebar transition"
            />
            <button
              onClick={handleAdd}
              disabled={!input.trim()}
              className="px-4 py-2 bg-task-sidebar dark:bg-red-700 text-white rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              +
            </button>
          </div>

          {/* Priority Selector */}
          <div className="flex gap-2">
            {(["low", "medium", "high"] as const).map((priority) => (
              <button
                key={priority}
                onClick={() => setSelectedPriority(priority)}
                className={`px-4 py-2 rounded border font-medium transition ${
                  selectedPriority === priority
                    ? "bg-task-sidebar text-white border-task-sidebar dark:bg-red-700 dark:border-red-700"
                    : "border-gray-300 dark:border-gray-600 text-task-lightText dark:text-white hover:border-task-sidebar dark:hover:border-red-700"
                }`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="px-6 py-4 text-left font-semibold text-task-lightText dark:text-white">
                  Tasks
                </th>
                <th className="px-6 py-4 text-left font-semibold text-task-lightText dark:text-white w-32">
                  Risk
                </th>
                <th className="px-6 py-4 text-left font-semibold text-task-lightText dark:text-white w-32">
                  Timer
                </th>
                <th className="px-6 py-4 text-center font-semibold text-task-lightText dark:text-white w-12">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingTasks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No tasks yet. Add one to get started!
                  </td>
                </tr>
              ) : (
                pendingTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-6 py-4 text-task-lightText dark:text-white">
                      {task.title}
                    </td>
                    <td className={`px-6 py-4 font-semibold ${getRiskColor(task.priority || "medium")}`}>
                      {task.priority
                        ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
                        : "Medium"}
                    </td>
                    <td className="px-6 py-4 text-task-lightText dark:text-white">
                      {getTimer(task.priority || "medium")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => removeTask(task.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition font-bold"
                        title="Delete task"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
