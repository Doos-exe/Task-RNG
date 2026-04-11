"use client";

export default function AboutPage() {
  return (
    <main className="ml-96 min-h-screen bg-app-lightMain dark:bg-app-darkMain text-app-lightText dark:text-app-darkText p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 tracking-wider">About</h1>

        <div className="bg-white dark:bg-gray-900 rounded-lg p-8 border-2 border-app-lightBorder dark:border-app-darkBorder shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-app-sidebar">Task RNG</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6 font-semibold">
            A Task Management website with a twist. Instead of manually choosing what to do, gamble and let fate decide your tasks using our system! Spin the slot machine or bet on a dice to get a random task from your to-do list, or a leisure activity for you to take a break.
          </p>
          
          <h3 className="text-xl font-bold mb-4 text-app-sidebar">Features:</h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 font-semibold">
            <li>
              <span className="font-bold">Task Management:</span> Add, manage, and organize your tasks with priority levels (Low, Medium, High)
            </li>
            <li>
              <span className="font-bold">Slot Machine RNG:</span> Spin the slot machine to randomly select a task or leisure based on what you bet on
            </li>
            <li>
              <span className="font-bold">High-Low RNG:</span> Roll a dice to determine what type of task or leisure you want, fight against the system
            </li>
            <li>
              <span className="font-bold">Coins System:</span> Earn coins by completing tasks early and use them to re-spin or re-roll if you don't like your luck
            </li>
            <li>
              <span className="font-bold">Pity System:</span> Increase your chances of getting the opposite to avoid getting stuck on bad RNG
            </li>
          </ul>

          <h3 className="text-xl font-bold mt-8 mb-4 text-app-sidebar">How It Works:</h3>
          <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-3 font-semibold">
            <li>Add your tasks and leisures on the Bet page for better management</li>
            <li>Visit the Spin page or Roll page to bet on your desired outcome</li>
            <li>Both systems are luck based to determine what you should do with the time being</li>
            <li>Completing tasks early earns you coins for re-spins or re-rolls</li>
            <li>Have fun!</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
