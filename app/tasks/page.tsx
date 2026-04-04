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
        return "text-red-600 dark:text-red-400 font-bold";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400 font-bold";
      case "low":
        return "text-green-600 dark:text-green-400 font-bold";
      default:
        return "text-app-lightText dark:text-app-darkText font-bold";
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case "high":
        return "High (60 mins)";
      case "medium":
        return "Medium (45 mins)";
      case "low":
        return "Low (30 mins)";
      default:
        return "Medium (45 mins)";
    }
  };

  return (
    <main className="ml-48 min-h-screen bg-app-lightMain dark:bg-app-darkMain text-app-lightText dark:text-app-darkText p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 tracking-wider">Tasks</h1>

        {/* Add Task Input */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 border-2 border-app-lightBorder dark:border-app-darkBorder rounded bg-white dark:bg-gray-800 text-app-lightText dark:text-app-darkText placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-app-sidebar dark:focus:border-app-sidebar transition font-semibold"
            />
            <button
              onClick={handleAdd}
              disabled={!input.trim()}
              className="px-6 py-3 bg-app-sidebar text-white rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-lg shadow-md"
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
                className={`px-4 py-2 rounded border-2 font-bold transition ${
                  selectedPriority === priority
                    ? "bg-app-sidebar text-white border-app-sidebar shadow-md"
                    : "border-app-lightBorder dark:border-app-darkBorder text-app-lightText dark:text-app-darkText hover:border-app-sidebar"
                }`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full border-collapse border-2 border-app-lightBorder dark:border-app-darkBorder">
            <thead>
              <tr className="border-2 border-app-lightBorder dark:border-app-darkBorder bg-gray-100 dark:bg-gray-800">
                <th className="px-6 py-4 text-left font-bold text-app-lightText dark:text-app-darkText text-lg">
                  Tasks
                </th>
                <th className="px-6 py-4 text-left font-bold text-app-lightText dark:text-app-darkText border-l-2 border-app-lightBorder dark:border-app-darkBorder text-lg">
                  Risk
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingTasks.length === 0 ? (
                <tr className="border-2 border-app-lightBorder dark:border-app-darkBorder">
                  <td colSpan={2} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 font-semibold">
                    No tasks yet. Add one to get started!
                  </td>
                </tr>
              ) : (
                pendingTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-2 border-app-lightBorder dark:border-app-darkBorder hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                  >
                    <td className="px-6 py-4 text-app-lightText dark:text-app-darkText font-semibold">
                      <div className="flex justify-between items-center">
                        <span>{task.title}</span>
                        <button
                          onClick={() => removeTask(task.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition ml-4 font-bold text-lg"
                          title="Delete task"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                    <td className={`px-6 py-4 border-l-2 border-app-lightBorder dark:border-app-darkBorder ${getRiskColor(task.priority || "medium")}`}>
                      {getRiskLabel(task.priority || "medium")}
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
