"use client";

import { motion } from "framer-motion";
import { getTasksVsLeisureRatio } from "@/lib/probability";

interface ProbabilityVisualizerProps {
  pendingTaskCount: number;
}

export function ProbabilityVisualizer({
  pendingTaskCount,
}: ProbabilityVisualizerProps) {
  const { tasks, leisure } = getTasksVsLeisureRatio(pendingTaskCount);

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-notion-border rounded-lg p-4">
      <p className="text-xs uppercase tracking-wide text-notion-secondary mb-4">
        Next Spin Probability
      </p>

      {/* Bar Chart */}
      <div className="space-y-3">
        {/* Work */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-notion-text">Tasks</span>
            <span className="text-sm font-bold text-notion-text">{tasks}%</span>
          </div>
          <div className="w-full bg-notion-bg rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tasks}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-notion-text"
            />
          </div>
        </div>

        {/* Leisure */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-notion-text">Leisure</span>
            <span className="text-sm font-bold text-notion-text">
              {leisure}%
            </span>
          </div>
          <div className="w-full bg-notion-bg rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${leisure}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-notion-text opacity-30"
            />
          </div>
        </div>
      </div>

      {/* Info Text */}
      <p className="text-xs text-notion-secondary mt-4">
        {pendingTaskCount === 0
          ? "No tasks — pure leisure mode!"
          : `${pendingTaskCount} pending task${pendingTaskCount !== 1 ? "s" : ""}`}
      </p>
    </div>
  );
}
