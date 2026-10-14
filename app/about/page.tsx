"use client";

const FEATURES = [
  { icon: "✓", title: "Task management", copy: "Add, edit, organize, and prioritize the work waiting on your attention." },
  { icon: "◉", title: "Slot machine RNG", copy: "Spin the reels to randomly select a task or a leisure activity." },
  { icon: "⚄", title: "High-low RNG", copy: "Roll the dice and compete with the system to determine your next move." },
  { icon: "¢", title: "Coins system", copy: "Finish tasks early to earn coins for re-spins and re-rolls." },
  { icon: "↻", title: "Pity system", copy: "Consecutive outcomes gently improve the odds of seeing the opposite category." },
];

export default function AboutPage() {
  return (
    <main className="app-page text-app-lightText dark:text-app-darkText">
      <div className="app-page-inner !max-w-5xl">
        <div className="mb-8">
          <p className="eyebrow mb-3">The house rules</p>
          <h1 className="page-title">A little structure.<br /><span className="text-[var(--app-accent)]">A little chance.</span></h1>
          <p className="page-subtitle mt-4">Task RNG turns the hardest part of productivity—the decision—into a small, playful ritual.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_1.4fr]">
          <section className="app-surface rounded-3xl p-6 md:p-8">
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-ink)] text-xl text-[var(--app-accent-bright)]">♠</div>
            <p className="eyebrow mb-3">Task RNG</p>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Let fate break the tie.</h2>
            <p className="mt-4 leading-7 text-[var(--app-muted)]">
              Add the things you need to do and the ways you like to recharge. When you are stuck deciding, spin the slot machine or roll the dice and commit to what comes up.
            </p>
            <div className="mt-8 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--app-accent)]">The loop</p>
              <p className="mt-2 text-sm font-semibold">Plan → Play → Focus → Collect → Repeat</p>
            </div>
          </section>

          <section className="app-surface rounded-3xl p-6 md:p-8">
            <p className="eyebrow mb-5">What is on the table</p>
            <div className="space-y-3">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="flex gap-4 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--app-ink)] font-bold text-[var(--app-accent-bright)]">{feature.icon}</span>
                  <div>
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="mt-1 text-sm leading-5 text-[var(--app-muted)]">{feature.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="app-surface mt-5 rounded-3xl p-6 md:p-8">
          <p className="eyebrow mb-3">How to play</p>
          <div className="grid gap-4 md:grid-cols-5">
            {[
              ["01", "Add", "Put tasks and leisure options on the Bet page."],
              ["02", "Choose", "Pick Spin or Roll when you need a nudge."],
              ["03", "Commit", "Take the result as your next move."],
              ["04", "Finish", "Complete tasks early to earn coins."],
              ["05", "Have fun", "A productive day does not need to feel rigid."],
            ].map(([number, title, copy]) => (
              <div key={number} className="border-t border-[var(--app-border)] pt-3">
                <span className="font-mono text-xs font-bold text-[var(--app-accent)]">{number}</span>
                <h3 className="mt-2 font-bold">{title}</h3>
                <p className="mt-1 text-sm leading-5 text-[var(--app-muted)]">{copy}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
