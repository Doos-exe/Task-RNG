/**
 * Filter out recently spun items to implement a pity system
 * @param items Available items to pick from
 * @param spinHistory Recent spin results
 * @returns Filtered items excluding recent spins, or all items if all were recent
 */
export function filterPityItems(items: string[], spinHistory: string[]): string[] {
  if (spinHistory.length === 0 || items.length <= 1) {
    return items;
  }

  const filtered = items.filter(item => !spinHistory.includes(item));

  // If all items were recent, allow all items again
  return filtered.length > 0 ? filtered : items;
}

/**
 * Check if a category should be forced due to consecutive count threshold (4 = 25% rate)
 * @param taskConsecutiveCount Number of consecutive task outcomes
 * @param leisureConsecutiveCount Number of consecutive leisure outcomes
 * @returns "Tasks", "Leisure", or null if no forced outcome
 */
export function checkForcedCategory(
  taskConsecutiveCount: number,
  leisureConsecutiveCount: number
): "Tasks" | "Leisure" | null {
  if (taskConsecutiveCount >= 4) {
    return "Leisure";
  }
  if (leisureConsecutiveCount >= 4) {
    return "Tasks";
  }
  return null;
}


/**
 * Select a weighted random item from available options with pity protection
 * @param items Available items
 * @param spinHistory Recent spin results
 * @returns Selected item
 */
export function selectWeightedItem(items: string[], spinHistory: string[] = []): string {
  const available = filterPityItems(items, spinHistory);
  return available[Math.floor(Math.random() * available.length)];
}

export type Category = "Tasks" | string; // String covers leisure items

export interface Weight {
  category: Category;
  weight: number;
}

export interface ProbabilityState {
  weights: Weight[];
  totalWeight: number;
  probabilities: { category: Category; percentage: number }[];
}

const TASKS_MULTIPLIER = 5; // Each pending task adds 5 to the weight
const LEISURE_WEIGHT = 10; // Weight for each leisure activity

/**
 * Calculate weighted probabilities based on task count and leisures
 * @param pendingTaskCount Number of pending tasks
 * @param leisureItems Array of leisure activity titles
 * @returns Probability state with calculated weights and percentages
 */
export function calculateProbabilities(
  pendingTaskCount: number,
  leisureItems: string[] = ["Rest", "Game"]
): ProbabilityState {
  const weights: Weight[] = [];

  // Calculate Tasks weight
  const tasksWeight = pendingTaskCount * TASKS_MULTIPLIER;
  if (tasksWeight > 0) {
    weights.push({ category: "Tasks", weight: tasksWeight });
  }

  // Add leisure categories
  for (const leisure of leisureItems) {
    weights.push({ category: leisure, weight: LEISURE_WEIGHT });
  }

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
 * @param leisureItems Array of leisure activity titles
 * @returns Selected category
 */
export function selectWeightedCategory(
  pendingTaskCount: number,
  leisureItems: string[] = ["Rest", "Game"]
): Category {
  const state = calculateProbabilities(pendingTaskCount, leisureItems);
  let random = Math.random() * state.totalWeight;

  for (const weight of state.weights) {
    random -= weight.weight;
    if (random <= 0) {
      return weight.category;
    }
  }

  // Fallback
  return leisureItems[0] || "Rest";
}

/**
 * Get the probability state for UI display
 * @param pendingTaskCount Number of pending tasks
 * @param leisureItems Array of leisure activity titles
 * @returns Probability state
 */
export function getProbabilityState(
  pendingTaskCount: number,
  leisureItems: string[] = ["Rest", "Game"]
): ProbabilityState {
  return calculateProbabilities(pendingTaskCount, leisureItems);
}

/**
 * Calculate the chance of landing on Tasks vs Leisure
 * @param pendingTaskCount Number of pending tasks
 * @param leisureItems Array of leisure activity titles
 * @returns Tasks and Leisure percentages
 */
export function getTasksVsLeisureRatio(
  pendingTaskCount: number,
  leisureItems: string[] = ["Rest", "Game"]
): {
  tasks: number;
  leisure: number;
} {
  const state = calculateProbabilities(pendingTaskCount, leisureItems);
  const tasksProb = state.probabilities.find((p) => p.category === "Tasks");
  const leisureProb = state.probabilities.reduce((sum, p) => {
    return p.category !== "Tasks" ? sum + p.percentage : sum;
  }, 0);

  return {
    tasks: tasksProb?.percentage || 0,
    leisure: leisureProb,
  };
}
