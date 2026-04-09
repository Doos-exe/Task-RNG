"use client";

import { useState } from "react";
import { useTaskStore, Task } from "@/lib/store";
import EmojiPicker from "@/components/EmojiPicker";

export default function TasksPage() {
  const { tasks, addTask, removeTask, updateTaskEmoji } = useTaskStore();
  const [input, setInput] = useState("");
  const [emoji, setEmoji] = useState("✓");
  const [selectedPriority, setSelectedPriority] = useState<
    "low" | "medium" | "high"
  >("medium");

  const handleAdd = () => {
    if (input.trim()) {
      addTask(input.trim(), selectedPriority, emoji);
      setInput("");
      setEmoji("✓");
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
    <main className="ml-96 min-h-screen bg-app-lightMain dark:bg-app-darkMain text-app-lightText dark:text-app-darkText p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 tracking-wider" style={{ fontFamily: "Courier New, monospace", letterSpacing: "0.1em" }}>Tasks</h1>

        {/* Add Task Input */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 border-2 border-white dark:border-white rounded bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300 outline-none focus:border-yellow-400 dark:focus:border-yellow-400 transition font-semibold"
              style={{ fontFamily: "Courier New, monospace" }}
            />
            <EmojiPicker value={emoji} onChange={setEmoji} />
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
                    ? "bg-app-sidebar text-white border-white dark:border-white shadow-md"
                    : "border-white dark:border-white text-white dark:text-white hover:border-yellow-400 dark:hover:border-yellow-400"
                }`}
                style={{ fontFamily: "Courier New, monospace" }}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full border-collapse border-2 border-white dark:border-white">
            <thead>
              <tr className="border-2 border-white dark:border-white bg-white dark:bg-gray-700">
                <th className="px-6 py-4 text-center font-bold text-black dark:text-white text-lg" style={{ fontFamily: "Courier New, monospace" }}>
                  Emoji
                </th>
                <th className="px-6 py-4 text-left font-bold text-black dark:text-white border-l-2 border-white dark:border-white text-lg" style={{ fontFamily: "Courier New, monospace" }}>
                  Tasks
                </th>
                <th className="px-6 py-4 text-left font-bold text-black dark:text-white border-l-2 border-white dark:border-white text-lg" style={{ fontFamily: "Courier New, monospace" }}>
                  Risk
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingTasks.length === 0 ? (
                <tr className="border-2 border-white dark:border-white">
                  <td colSpan={3} className="px-6 py-8 text-center text-white dark:text-white font-semibold" style={{ backgroundColor: "#1a3a32" }}>
                    No tasks yet. Add one to get started!
                  </td>
                </tr>
              ) : (
                pendingTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-2 border-white dark:border-white dark:bg-gray-600 hover:opacity-90 transition"
                    style={{ backgroundColor: "#1a3a32" }}
                  >
                    <td className="px-6 py-4 border-r-2 border-white dark:border-white text-center font-bold text-2xl">
                      <EmojiPicker value={task.emoji} onChange={(newEmoji) => updateTaskEmoji(task.id, newEmoji)} />
                    </td>
                    <td className="px-6 py-4 text-white dark:text-white font-semibold" style={{ fontFamily: "Courier New, monospace" }}>
                      <div className="flex justify-between items-center">
                        <span>{task.title}</span>
                        <button
                          onClick={() => removeTask(task.id)}
                          className="text-yellow-300 dark:text-yellow-300 hover:text-yellow-100 dark:hover:text-yellow-100 transition ml-4 font-bold text-lg"
                          title="Delete task"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                    <td className={`px-6 py-4 border-l-2 border-white dark:border-white font-bold ${getRiskColor(task.priority || "medium")}`} style={{ fontFamily: "Courier New, monospace" }}>
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
