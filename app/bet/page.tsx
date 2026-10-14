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
    <main className="app-page text-app-lightText dark:text-app-darkText">
      <div className="app-page-inner !max-w-6xl">
        <div className="mb-8"><p className="eyebrow mb-3">Your control room</p><h1 className="page-title">Plan the table.</h1><p className="page-subtitle mt-3">Add the tasks and breaks you want the roulette system to choose from.</p></div>

        {/* Add Task Input */}
        <div className="app-surface mb-8 rounded-2xl p-4 md:p-5 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add a new task..."
              className="app-field flex-1 font-medium"
              style={{ fontFamily: "Courier New, monospace" }}
            />
            <EmojiPicker value={emoji} onChange={setEmoji} />
            <button
              onClick={handleAdd}
              disabled={!input.trim()}
              className="app-button app-button-primary px-5 text-lg"
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
                className={`rounded-lg border px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition ${
                  selectedPriority === priority
                    ? "bg-[var(--app-ink)] text-[var(--app-surface-strong)] border-[var(--app-ink)] shadow-md"
                    : "border-[var(--app-border)] text-[var(--app-muted)] hover:border-[var(--app-accent)] hover:text-[var(--app-ink)]"
                }`}
                style={{ fontFamily: "Courier New, monospace" }}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Table */}
        <div className="app-surface overflow-x-auto rounded-2xl">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="border-b border-[var(--app-border)] bg-[var(--app-surface-strong)]">
                <th className="px-4 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--app-muted)] md:px-6 w-24">
                  Symbol
                </th>
                <th className="px-4 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--app-muted)] md:px-6">
                  Tasks
                </th>
                <th className="px-4 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--app-muted)] md:px-6 w-48">
                  Risk
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingTasks.length === 0 ? (
                <tr className="border-b border-[var(--app-border)]">
                  <td colSpan={3} className="px-6 py-10 text-center text-sm font-medium text-[var(--app-muted)]" style={{ backgroundColor: "transparent" }}>
                    No tasks yet. Add one to get started!
                  </td>
                </tr>
              ) : (
                pendingTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-[var(--app-border)] bg-transparent transition hover:bg-[var(--app-surface-strong)]"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <td className="border-b border-[var(--app-border)] px-4 py-4 text-center text-2xl md:px-6">
                      <EmojiPicker value={task.emoji} onChange={(newEmoji) => updateTaskEmoji(task.id, newEmoji)} />
                    </td>
                    <td className="border-b border-[var(--app-border)] px-4 py-4 font-medium text-[var(--app-ink)] md:px-6" style={{ fontFamily: "Courier New, monospace" }}>
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
                            className="app-field flex-1 font-medium"
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
                    <td className={`border-b border-[var(--app-border)] px-4 py-4 font-bold md:px-6 ${getRiskColor(task.priority || "medium")}`} style={{ fontFamily: "Courier New, monospace" }}>
                      {getRiskLabel(task.priority || "medium")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Leisure Input */}
        <div className="mt-12 mb-8 space-y-4"><div><p className="eyebrow mb-2">Recharge menu</p>
          <h2 className="text-2xl font-bold tracking-tight">Leisure activities</h2></div>
          <div className="flex gap-2">
            <input
              type="text"
              value={leisureInput}
              onChange={(e) => setLeisureInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddLeisure()}
              placeholder="Add a new leisure activity..."
              className="app-field flex-1 font-medium"
              style={{ fontFamily: "Courier New, monospace" }}
            />
            <EmojiPicker value={leisureEmoji} onChange={setLeisureEmoji} />
            <button
              onClick={handleAddLeisure}
              disabled={!leisureInput.trim()}
              className="app-button app-button-primary px-5 text-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Leisure Table */}
        <div className="app-surface overflow-x-auto rounded-2xl">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="border-b border-[var(--app-border)] bg-[var(--app-surface-strong)]">
                <th className="px-4 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--app-muted)] md:px-6 w-24">
                  Symbol
                </th>
                <th className="px-4 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--app-muted)] md:px-6">
                  Leisure Activity
                </th>
              </tr>
            </thead>
            <tbody>
              {leisures.length === 0 ? (
                <tr className="border-b border-[var(--app-border)]">
                  <td colSpan={2} className="px-6 py-10 text-center text-sm font-medium text-[var(--app-muted)]" style={{ backgroundColor: "transparent" }}>
                    No leisure activities yet. Add one to get started!
                  </td>
                </tr>
              ) : (
                leisures.map((leisure) => (
                  <tr
                    key={leisure.id}
                    className="border-b border-[var(--app-border)] bg-transparent transition hover:bg-[var(--app-surface-strong)]"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <td className="border-b border-[var(--app-border)] px-4 py-4 text-center text-2xl md:px-6">
                      <EmojiPicker value={leisure.emoji} onChange={(newEmoji) => updateLeisureEmoji(leisure.id, newEmoji)} />
                    </td>
                    <td className="border-b border-[var(--app-border)] px-4 py-4 font-medium text-[var(--app-ink)] md:px-6" style={{ fontFamily: "Courier New, monospace" }}>
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
                            className="app-field flex-1 font-medium"
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
        <div className="mt-8 flex gap-3 rounded-2xl border border-sky-400/25 bg-sky-500/10 p-5">
          <p className="text-sm font-medium leading-6 text-[var(--app-ink)]">
            💡 Rest and Game are default leisure activities. You can add more custom activities that will appear in your spins with their emojis!
          </p>
        </div>
      </div>
    </main>
  );
}
