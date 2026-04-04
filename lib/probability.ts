/**
 * Weighted Probability Logic for Fate-Tasker
 * Calculates probabilities based on task load and generates random selections
 */

export type Category = "Tasks" | "Rest" | "Game";

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
  Rest: 10,
  Game: 10,
};

const TASKS_MULTIPLIER = 5; // Each pending task adds 5 to the weight

/**
 * Calculate weighted probabilities based on task count
 * @param pendingTaskCount Number of pending tasks
 * @returns Probability state with calculated weights and percentages
 */
export function calculateProbabilities(
  pendingTaskCount: number
): ProbabilityState {
  const weights: Weight[] = [];

  // Calculate Tasks weight
  const tasksWeight = pendingTaskCount * TASKS_MULTIPLIER;
  if (tasksWeight > 0) {
    weights.push({ category: "Tasks", weight: tasksWeight });
  }

  // Add static categories
  weights.push(
    { category: "Rest", weight: STATIC_WEIGHTS.Rest },
    { category: "Game", weight: STATIC_WEIGHTS.Game }
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
  return "Game";
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
 * Calculate the chance of landing on Tasks vs Leisure
 * @param pendingTaskCount Number of pending tasks
 * @returns Tasks and Leisure percentages
 */
export function getTasksVsLeisureRatio(pendingTaskCount: number): {
  tasks: number;
  leisure: number;
} {
  const state = calculateProbabilities(pendingTaskCount);
  const tasksProb = state.probabilities.find((p) => p.category === "Tasks");
  const leisureProb = state.probabilities.reduce((sum, p) => {
    return p.category !== "Tasks" ? sum + p.percentage : sum;
  }, 0);

  return {
    tasks: tasksProb?.percentage || 0,
    leisure: leisureProb,
  };
}
