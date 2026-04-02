/**
 * Weighted Probability Logic for Fate-Tasker
 * Calculates probabilities based on task load and generates random selections
 */

export type Category = "Work" | "Sleep" | "Play" | "Eat";

export interface Weight {
  category: Category;
  weight: number;
}

export interface ProbabilityState {
  weights: Weight[];
  totalWeight: number;
  probabilities: { category: Category; percentage: number }[];
}

const STATIC_WEIGHTS = {
  Sleep: 10,
  Play: 10,
  Eat: 10,
};

const WORK_MULTIPLIER = 5; // Each pending task adds 5 to the weight

/**
 * Calculate weighted probabilities based on task count
 * @param pendingTaskCount Number of pending tasks
 * @returns Probability state with calculated weights and percentages
 */
export function calculateProbabilities(
  pendingTaskCount: number
): ProbabilityState {
  const weights: Weight[] = [];

  // Calculate Work weight
  const workWeight = pendingTaskCount * WORK_MULTIPLIER;
  if (workWeight > 0) {
    weights.push({ category: "Work", weight: workWeight });
  }

  // Add static categories
  weights.push(
    { category: "Sleep", weight: STATIC_WEIGHTS.Sleep },
    { category: "Play", weight: STATIC_WEIGHTS.Play },
    { category: "Eat", weight: STATIC_WEIGHTS.Eat }
  );

  // Calculate total weight
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);

  // Calculate percentages
  const probabilities = weights.map((w) => ({
    category: w.category,
    percentage: Math.round((w.weight / totalWeight) * 100),
  }));

  return {
    weights,
    totalWeight,
    probabilities,
  };
}

/**
 * Select a random category based on weighted probabilities
 * @param pendingTaskCount Number of pending tasks
 * @returns Selected category
 */
export function selectWeightedCategory(
  pendingTaskCount: number
): Category {
  const state = calculateProbabilities(pendingTaskCount);
  let random = Math.random() * state.totalWeight;

  for (const weight of state.weights) {
    random -= weight.weight;
    if (random <= 0) {
      return weight.category;
    }
  }

  // Fallback (should never reach here)
  return "Play";
}

/**
 * Get the probability state for UI display
 * @param pendingTaskCount Number of pending tasks
 * @returns Probability state
 */
export function getProbabilityState(
  pendingTaskCount: number
): ProbabilityState {
  return calculateProbabilities(pendingTaskCount);
}

/**
 * Calculate the chance of landing on Work vs Leisure
 * @param pendingTaskCount Number of pending tasks
 * @returns Work and Leisure percentages
 */
export function getWorkVsLeisureRatio(pendingTaskCount: number): {
  work: number;
  leisure: number;
} {
  const state = calculateProbabilities(pendingTaskCount);
  const workProb = state.probabilities.find((p) => p.category === "Work");
  const leisureProb = state.probabilities.reduce((sum, p) => {
    return p.category !== "Work" ? sum + p.percentage : sum;
  }, 0);

  return {
    work: workProb?.percentage || 0,
    leisure: leisureProb,
  };
}
