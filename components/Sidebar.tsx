"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-task-sidebar text-white rounded-lg"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed left-0 top-0 h-screen w-48 bg-task-sidebar text-white flex flex-col transition-transform duration-300 z-40 md:z-auto`}
      >
        {/* Header with Logo */}
        <div className="p-6 border-b border-red-900">
          <ThemeToggle />
          <h1 className="text-2xl font-bold mt-4 leading-tight">TASK RNG</h1>
          <div className="mt-4 w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600 font-semibold text-center">
            Logo
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-red-900">
          <button className="flex-1 py-4 px-3 text-sm font-semibold bg-red-700 text-white border-r border-red-900">
            Sleep
          </button>
          <button className="flex-1 py-4 px-3 text-sm font-semibold hover:bg-red-700 transition">
            Task
          </button>
          <button className="flex-1 py-4 px-3 text-sm font-semibold hover:bg-red-700 transition">
            Game
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Red Button Area (for slot machine handle) */}
        <div className="p-6 border-t border-red-900 space-y-4">
          <div className="text-sm text-gray-300">Handle Area</div>
          <div className="w-8 h-8 rounded-full bg-red-600 mx-auto"></div>
        </div>

        {/* Bottom Red Bar */}
        <div className="h-16 bg-red-600 rounded-t-lg"></div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
