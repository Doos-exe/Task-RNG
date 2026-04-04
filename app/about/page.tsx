"use client";

export default function AboutPage() {
  return (
    <main className="ml-48 min-h-screen bg-app-lightMain dark:bg-app-darkMain text-app-lightText dark:text-app-darkText p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 tracking-wider">About</h1>

        <div className="bg-white dark:bg-gray-900 rounded-lg p-8 border-2 border-app-lightBorder dark:border-app-darkBorder shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-app-sidebar">Task RNG</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6 font-semibold">
            Task RNG is a task management website with a twist. Instead of manually choosing what to do, let fate decide your tasks using our slot machine! Spin the wheel and get a random task from your to-do list, or a leisure activity if you need a break.
          </p>
          
          <h3 className="text-xl font-bold mb-4 text-app-sidebar">Features:</h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 font-semibold">
            <li>
              <span className="font-bold">Task Management:</span> Add, manage, and organize your tasks with priority levels (Low, Medium, High)
            </li>
            <li>
              <span className="font-bold">Slot Machine RNG:</span> Spin the wheel to randomly select a task or leisure activity based on your workload
            </li>
            <li>
              <span className="font-bold">Coin System:</span> Earn coins by completing tasks early and use them to re-spin if you don't like the result
            </li>
            <li>
              <span className="font-bold">Risk Levels:</span> Each task has a risk level that determines the time commitment (Low: 30 mins, Medium: 45 mins, High: 60 mins)
            </li>
            <li>
              <span className="font-bold">Light & Dark Mode:</span> Switch between light and dark themes for comfortable viewing
            </li>
          </ul>

          <h3 className="text-xl font-bold mt-8 mb-4 text-app-sidebar">How It Works:</h3>
          <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-3 font-semibold">
            <li>Add your tasks to the task list with a priority level</li>
            <li>Visit the Spin page and pull the handle to spin the slot machine</li>
            <li>The machine will randomly select a task or suggest a break</li>
            <li>Complete the task and earn coins for early completion</li>
            <li>Use coins to re-spin if you want a different task</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
