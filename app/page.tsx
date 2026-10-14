"use client";

import { PokerChip } from "@/components/PokerChip";
import { useTaskStore } from "@/lib/store";

const ACTIONS = [
  { label: "SPIN", href: "/spin", kicker: "Let the reels pick your next move", icon: "◉" },
  { label: "ROLL", href: "/roll", kicker: "Challenge the system with a dice roll", icon: "⚄" },
  { label: "BET", href: "/bet", kicker: "Build the task and break menu", icon: "✓" },
  { label: "ABOUT", href: "/about", kicker: "See the rules and the why", icon: "?" },
];

export default function Home() {
  const tasks = useTaskStore((state) => state.tasks);
  const leisures = useTaskStore((state) => state.leisures);
  const coins = useTaskStore((state) => state.coins);
  const pendingTasks = tasks.filter((task) => !task.completed).length;

  return (
    <main className="app-page text-app-lightText dark:text-app-darkText">
      <div className="app-page-inner">
        <section className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow mb-3">Your decision desk</p>
            <h1 className="page-title">Make progress<br /><span className="text-[var(--app-accent)]">a little playful.</span></h1>
            <p className="page-subtitle mt-4">
              Put your tasks on the table, then let a little casino energy decide what deserves your attention next.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="status-chip"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Ready to play</span>
            <span className="status-chip">Coins <strong>{coins}</strong></span>
          </div>
        </section>

        <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          <div className="app-surface rounded-2xl p-4">
            <p className="eyebrow">Open tasks</p>
            <p className="mt-2 text-3xl font-bold">{pendingTasks}</p>
            <p className="mt-1 text-xs text-[var(--app-muted)]">Waiting for a decision</p>
          </div>
          <div className="app-surface rounded-2xl p-4">
            <p className="eyebrow">Break options</p>
            <p className="mt-2 text-3xl font-bold">{leisures.length}</p>
            <p className="mt-1 text-xs text-[var(--app-muted)]">Ways to recharge</p>
          </div>
          <div className="app-surface col-span-2 rounded-2xl p-4 md:col-span-1">
            <p className="eyebrow">Choose your move</p>
            <p className="mt-2 text-lg font-semibold">Spin for momentum, roll for a challenge.</p>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="eyebrow">The house is open</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight md:text-2xl">Pick a game</h2>
            </div>
            <span className="hidden text-xs text-[var(--app-muted)] md:block">Your workspace, your rules</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {ACTIONS.map((action) => (
              <div key={action.href} className="group flex min-h-[230px] flex-col items-center justify-center gap-3 rounded-3xl bg-transparent p-5 text-center transition duration-200 hover:-translate-y-1">
                <PokerChip label={action.label} href={action.href} className="!h-36 !w-36 sm:!h-40 sm:!w-40" />
                <p className="max-w-[14rem] text-xs leading-5 text-[var(--app-muted)]">{action.kicker}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
