"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "warning" | "success" | "info";
}

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "info",
}: ConfirmationDialogProps) {
  const borderColor = type === "warning" ? "border-red-600" : type === "success" ? "border-green-600" : "border-yellow-600";
  const titleColor = type === "warning" ? "text-red-400" : type === "success" ? "text-green-400" : "text-yellow-400";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black bg-opacity-70 z-[100]"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] bg-gradient-to-br from-gray-900 to-black border-4 ${borderColor} rounded-2xl p-8 shadow-2xl max-w-sm`}
          >
            {/* Title */}
            <p className={`text-2xl font-black mb-4 ${titleColor}`}>{title}</p>

            {/* Message */}
            <p className="text-white text-center mb-8 leading-relaxed">{message}</p>

            {/* Buttons */}
            <div className="flex gap-4">
              {cancelText && (
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 px-4 rounded-lg font-bold text-gray-900 bg-gray-400 hover:bg-gray-300 transition transform hover:scale-105 active:scale-95"
                >
                  {cancelText}
                </button>
              )}
              <button
                onClick={onConfirm}
                className={`${cancelText ? "flex-1" : "w-full"} py-3 px-4 rounded-lg font-bold text-white transition transform hover:scale-105 active:scale-95 ${
                  type === "warning"
                    ? "bg-red-600 hover:bg-red-500"
                    : type === "success"
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-yellow-600 hover:bg-yellow-500"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
