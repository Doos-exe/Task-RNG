"use client";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-task-lightBg dark:bg-task-main dark:text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 dark:text-white">About</h1>

        <div className="bg-white dark:bg-gray-900 rounded-lg p-8 border border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-task-lightText dark:text-white">
            Task RNG
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This is a draft placeholder for the About page. You can edit this content later to add information about Task RNG.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Features to come:
          </p>
          <ul className="list-disc list-inside mt-4 text-gray-700 dark:text-gray-300 space-y-2">
            <li>Task management with priority levels</li>
            <li>Random task selection with probability weighting</li>
            <li>Coin system for task completion</li>
            <li>Light and dark mode support</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
