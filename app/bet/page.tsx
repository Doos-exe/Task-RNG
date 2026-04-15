"use client";
/*
  This is the bet page where users can manage their tasks and leisure activities.
  Users can add, edit, and delete tasks and leisure activities.
*/

import { useState } from "react";
import { useTaskStore, Task, Leisure } from "@/lib/store";
import EmojiPicker from "@/components/EmojiPicker";

export default function TasksPage() {
  const { tasks, addTask, removeTask, updateTaskEmoji, updateTask, leisures, addLeisure, removeLeisure, updateLeisure, updateLeisureEmoji } = useTaskStore();
  const [input, setInput] = useState("");
  const [emoji, setEmoji] = useState("✓");
  const [selectedPriority, setSelectedPriority] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [leisureInput, setLeisureInput] = useState("");
  const [leisureEmoji, setLeisureEmoji] = useState("🎯");
  const [editingLeisureId, setEditingLeisureId] = useState<string | null>(null);
  const [editLeisureValue, setEditLeisureValue] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskValue, setEditTaskValue] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      addTask(input.trim(), selectedPriority, emoji);
      setInput("");
      setEmoji("✓");
    }
  };

  const handleAddLeisure = () => {
    if (leisureInput.trim()) {
      addLeisure(leisureInput.trim(), leisureEmoji);
      setLeisureInput("");
      setLeisureEmoji("🎯");
    }
  };

  const handleStartEditLeisure = (leisure: Leisure) => {
    setEditingLeisureId(leisure.id);
    setEditLeisureValue(leisure.title);
  };

  const handleSaveEditLeisure = (id: string) => {
    if (editLeisureValue.trim()) {
      updateLeisure(id, editLeisureValue.trim());
      setEditingLeisureId(null);
      setEditLeisureValue("");
    }
  };

  const handleCancelEditLeisure = () => {
    setEditingLeisureId(null);
    setEditLeisureValue("");
  };

  const handleStartEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTaskValue(task.title);
  };

  const handleSaveEditTask = (id: string) => {
    if (editTaskValue.trim()) {
      updateTask(id, editTaskValue.trim());
      setEditingTaskId(null);
      setEditTaskValue("");
    }
  };

  const handleCancelEditTask = () => {
    setEditingTaskId(null);
    setEditTaskValue("");
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
        <h1 className="text-4xl font-bold mb-8 tracking-wider" style={{ fontFamily: "Courier New, monospace", letterSpacing: "0.1em" }}>Bet</h1>

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
                <th className="px-6 py-4 text-center font-bold text-black dark:text-white text-lg w-24" style={{ fontFamily: "Courier New, monospace" }}>
                  Symbol
                </th>
                <th className="px-6 py-4 text-left font-bold text-black dark:text-white border-l-2 border-white dark:border-white text-lg flex-1" style={{ fontFamily: "Courier New, monospace" }}>
                  Tasks
                </th>
                <th className="px-6 py-4 text-left font-bold text-black dark:text-white border-l-2 border-white dark:border-white text-lg w-48" style={{ fontFamily: "Courier New, monospace" }}>
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
                        {editingTaskId === task.id ? (
                          <input
                            type="text"
                            value={editTaskValue}
                            onChange={(e) => setEditTaskValue(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") handleSaveEditTask(task.id);
                              if (e.key === "Escape") handleCancelEditTask();
                            }}
                            className="px-3 py-2 border-2 border-yellow-400 rounded bg-gray-700 text-white flex-1 font-semibold"
                            autoFocus
                          />
                        ) : (
                          <span>{task.title}</span>
                        )}
                        <div className="flex items-center gap-3 ml-4">
                          {editingTaskId === task.id ? (
                            <>
                              <button
                                onClick={() => handleSaveEditTask(task.id)}
                                className="text-green-400 dark:text-green-400 hover:text-green-200 dark:hover:text-green-200 transition font-bold text-lg"
                                title="Save"
                              >
                                ✓
                              </button>
                              <button
                                onClick={handleCancelEditTask}
                                className="text-red-400 dark:text-red-400 hover:text-red-200 dark:hover:text-red-200 transition font-bold text-lg"
                                title="Cancel"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEditTask(task)}
                                className="text-blue-400 dark:text-blue-400 hover:text-blue-200 dark:hover:text-blue-200 transition font-bold text-lg"
                                title="Edit"
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => removeTask(task.id)}
                                className="text-yellow-300 dark:text-yellow-300 hover:text-yellow-100 dark:hover:text-yellow-100 transition font-bold text-lg"
                                title="Delete task"
                              >
                                🗑️
                              </button>
                            </>
                          )}
                        </div>
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

        {/* Add Leisure Input */}
        <div className="mt-12 mb-8 space-y-4">
          <h2 className="text-2xl font-bold tracking-wider" style={{ fontFamily: "Courier New, monospace", letterSpacing: "0.1em" }}>Leisure Activities</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={leisureInput}
              onChange={(e) => setLeisureInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddLeisure()}
              placeholder="Add a new leisure activity..."
              className="flex-1 px-4 py-3 border-2 border-white dark:border-white rounded bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300 outline-none focus:border-yellow-400 dark:focus:border-yellow-400 transition font-semibold"
              style={{ fontFamily: "Courier New, monospace" }}
            />
            <EmojiPicker value={leisureEmoji} onChange={setLeisureEmoji} />
            <button
              onClick={handleAddLeisure}
              disabled={!leisureInput.trim()}
              className="px-6 py-3 bg-app-sidebar text-white rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-lg shadow-md"
            >
              +
            </button>
          </div>
        </div>

        {/* Leisure Table */}
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full border-collapse border-2 border-white dark:border-white">
            <thead>
              <tr className="border-2 border-white dark:border-white bg-white dark:bg-gray-700">
                <th className="px-6 py-4 text-center font-bold text-black dark:text-white text-lg w-24" style={{ fontFamily: "Courier New, monospace" }}>
                  Symbol
                </th>
                <th className="px-6 py-4 text-left font-bold text-black dark:text-white border-l-2 border-white dark:border-white text-lg flex-1" style={{ fontFamily: "Courier New, monospace" }}>
                  Leisure Activity
                </th>
              </tr>
            </thead>
            <tbody>
              {leisures.length === 0 ? (
                <tr className="border-2 border-white dark:border-white">
                  <td colSpan={2} className="px-6 py-8 text-center text-white dark:text-white font-semibold" style={{ backgroundColor: "#1a3a32" }}>
                    No leisure activities yet. Add one to get started!
                  </td>
                </tr>
              ) : (
                leisures.map((leisure) => (
                  <tr
                    key={leisure.id}
                    className="border-2 border-white dark:border-white dark:bg-gray-600 hover:opacity-90 transition"
                    style={{ backgroundColor: "#1a3a32" }}
                  >
                    <td className="px-6 py-4 border-r-2 border-white dark:border-white text-center font-bold text-2xl">
                      <EmojiPicker value={leisure.emoji} onChange={(newEmoji) => updateLeisureEmoji(leisure.id, newEmoji)} />
                    </td>
                    <td className="px-6 py-4 text-white dark:text-white font-semibold" style={{ fontFamily: "Courier New, monospace" }}>
                      <div className="flex justify-between items-center">
                        {editingLeisureId === leisure.id ? (
                          <input
                            type="text"
                            value={editLeisureValue}
                            onChange={(e) => setEditLeisureValue(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") handleSaveEditLeisure(leisure.id);
                              if (e.key === "Escape") handleCancelEditLeisure();
                            }}
                            className="px-3 py-2 border-2 border-yellow-400 rounded bg-gray-700 text-white flex-1 font-semibold"
                            autoFocus
                          />
                        ) : (
                          <span>{leisure.title}</span>
                        )}
                        <div className="flex items-center gap-3 ml-4">
                          {editingLeisureId === leisure.id ? (
                            <>
                              <button
                                onClick={() => handleSaveEditLeisure(leisure.id)}
                                className="text-green-400 dark:text-green-400 hover:text-green-200 dark:hover:text-green-200 transition font-bold text-lg"
                                title="Save"
                              >
                                ✓
                              </button>
                              <button
                                onClick={handleCancelEditLeisure}
                                className="text-red-400 dark:text-red-400 hover:text-red-200 dark:hover:text-red-200 transition font-bold text-lg"
                                title="Cancel"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEditLeisure(leisure)}
                                className="text-blue-400 dark:text-blue-400 hover:text-blue-200 dark:hover:text-blue-200 transition font-bold text-lg"
                                title="Edit"
                              >
                                ✎
                              </button>
                              {!leisure.isDefault && (
                                <button
                                  onClick={() => removeLeisure(leisure.id)}
                                  className="text-yellow-300 dark:text-yellow-300 hover:text-yellow-100 dark:hover:text-yellow-100 transition font-bold text-lg"
                                  title="Delete"
                                >
                                  🗑️
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Info */}
        <div className="mt-8 p-6 bg-blue-100 dark:bg-blue-900 border-2 border-blue-600 rounded-lg">
          <p className="text-lg font-bold text-blue-800 dark:text-blue-200" style={{ fontFamily: "Courier New, monospace" }}>
            💡 Rest and Game are default leisure activities. You can add more custom activities that will appear in your spins with their emojis!
          </p>
        </div>
      </div>
    </main>
  );
}
