"use client";

import { useState } from "react";
import { useTaskStore, Task } from "@/lib/store";
import { motion } from "framer-motion";

export function TaskList() {
  const { tasks, addTask, removeTask, toggleTask } = useTaskStore();
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

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-notion-text">Tasks</h2>
          <p className="text-xs text-notion-secondary">
            {completedCount} of {tasks.length} completed
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 text-sm border border-notion-border rounded bg-white text-notion-text placeholder-notion-secondary outline-none focus:border-notion-text transition"
          />
          <button
            onClick={handleAdd}
            disabled={!input.trim()}
            className="px-3 py-2 bg-notion-text text-white text-sm font-medium rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Add
          </button>
        </div>

        {/* Priority Selector */}
        <div className="flex gap-2">
          {(["low", "medium", "high"] as const).map((priority) => (
            <button
              key={priority}
              onClick={() => setSelectedPriority(priority)}
              className={`flex-1 py-1 px-2 text-xs font-medium rounded border transition ${
                selectedPriority === priority
                  ? "border-notion-text bg-notion-text text-white"
                  : "border-notion-border text-notion-secondary hover:border-notion-text"
              }`}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {pendingTasks.length === 0 ? (
          <div className="text-center py-8 border border-notion-border rounded-lg bg-notion-bg">
            <p className="text-notion-secondary text-sm">
              No pending tasks. Great work!
            </p>
          </div>
        ) : (
          pendingTasks.map((task, idx) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: idx * 0.05 }}
              className="group flex items-center gap-2 p-3 bg-white border border-notion-border rounded hover:bg-notion-bg transition"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm truncate ${
                    task.completed ? "line-through text-notion-secondary" : ""
                  }`}
                >
                  {task.title}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  task.priority === "high"
                    ? "bg-red-50 text-red-700"
                    : task.priority === "medium"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-green-50 text-green-700"
                }`}
              >
                {task.priority}
              </span>
              <button
                onClick={() => removeTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-notion-secondary hover:text-notion-text transition"
              >
                ✕
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Completed Tasks */}
      {completedCount > 0 && (
        <details className="group border border-notion-border rounded">
          <summary className="p-3 cursor-pointer hover:bg-notion-bg transition text-sm font-medium text-notion-text">
            {completedCount} Completed
          </summary>
          <div className="px-3 pb-3 space-y-2 border-t border-notion-border">
            {tasks
              .filter((t) => t.completed)
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 p-2 bg-notion-bg rounded text-notion-secondary"
                >
                  <input
                    type="checkbox"
                    checked
                    onChange={() => toggleTask(task.id)}
                    className="cursor-pointer"
                  />
                  <p className="text-sm line-through flex-1 truncate">
                    {task.title}
                  </p>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="text-notion-secondary hover:text-notion-text transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>
        </details>
      )}
    </div>
  );
}
