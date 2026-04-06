"use client";

import { useState } from "react";
import { useTaskStore, Leisure } from "@/lib/store";

export default function PersonalizedPage() {
  const { leisures, addLeisure, removeLeisure, updateLeisure, updateLeisureEmoji } = useTaskStore();
  const [input, setInput] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      addLeisure(input.trim());
      setInput("");
      setEmoji("🎯");
    }
  };

  const handleStartEdit = (leisure: Leisure) => {
    setEditingId(leisure.id);
    setEditValue(leisure.title);
  };

  const handleSaveEdit = (id: string) => {
    if (editValue.trim()) {
      updateLeisure(id, editValue.trim());
      setEditingId(null);
      setEditValue("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  return (
    <main className="ml-96 min-h-screen bg-app-lightMain dark:bg-app-darkMain text-app-lightText dark:text-app-darkText p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 tracking-wider" style={{ fontFamily: "Courier New, monospace", letterSpacing: "0.1em" }}>Personalized</h1>

        {/* Add Leisure Input */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add a new leisure activity..."
              className="flex-1 px-4 py-3 border-2 border-white dark:border-white rounded bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300 outline-none focus:border-yellow-400 dark:focus:border-yellow-400 transition font-semibold"
              style={{ fontFamily: "Courier New, monospace" }}
            />
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
              maxLength={2}
              placeholder="😊"
              className="w-16 px-2 py-3 border-2 border-white dark:border-white rounded bg-white dark:bg-gray-700 text-black dark:text-white text-center font-semibold"
            />
            <button
              onClick={handleAdd}
              disabled={!input.trim()}
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
                <th className="px-6 py-4 text-center font-bold text-black dark:text-white text-lg" style={{ fontFamily: "Courier New, monospace" }}>
                  Emoji
                </th>
                <th className="px-6 py-4 text-left font-bold text-black dark:text-white border-l-2 border-white dark:border-white text-lg" style={{ fontFamily: "Courier New, monospace" }}>
                  Leisure Activity
                </th>
                <th className="px-6 py-4 text-center font-bold text-black dark:text-white border-l-2 border-white dark:border-white text-lg" style={{ fontFamily: "Courier New, monospace" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {leisures.length === 0 ? (
                <tr className="border-2 border-white dark:border-white">
                  <td colSpan={3} className="px-6 py-8 text-center text-white dark:text-white font-semibold" style={{ backgroundColor: "#1a3a32" }}>
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
                      <input
                        type="text"
                        value={leisure.emoji}
                        onChange={(e) => updateLeisureEmoji(leisure.id, e.target.value.slice(0, 2))}
                        maxLength={2}
                        className="w-12 px-1 py-1 border-2 border-yellow-400 rounded bg-gray-700 text-white text-center font-semibold"
                      />
                    </td>
                    <td className="px-6 py-4 text-white dark:text-white font-semibold" style={{ fontFamily: "Courier New, monospace" }}>
                      {editingId === leisure.id ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") handleSaveEdit(leisure.id);
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                          className="px-3 py-2 border-2 border-yellow-400 rounded bg-gray-700 text-white w-full font-semibold"
                          autoFocus
                        />
                      ) : (
                        <span>{leisure.title}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 border-l-2 border-white dark:border-white font-bold text-center">
                      <div className="flex justify-center items-center gap-4">
                        {editingId === leisure.id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(leisure.id)}
                              className="text-green-400 dark:text-green-400 hover:text-green-200 dark:hover:text-green-200 transition font-bold text-lg"
                              title="Save"
                            >
                              ✓
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-red-400 dark:text-red-400 hover:text-red-200 dark:hover:text-red-200 transition font-bold text-lg"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(leisure)}
                              className="text-blue-400 dark:text-blue-400 hover:text-blue-200 dark:hover:text-blue-200 transition font-bold text-lg"
                              title="Edit"
                            >
                              ✎
                            </button>
                            {!leisure.isDefault && (
                              <button
                                onClick={() => removeLeisure(leisure.id)}
                                className="text-yellow-300 dark:text-yellow-300 hover:text-yellow-100 dark:hover:text-yellow-100 transition ml-2 font-bold text-lg"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            )}
                          </>
                        )}
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
