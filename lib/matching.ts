import { inventory } from "./data";
import type { ChefCandidate, IngredientRequirement, InventoryItem } from "./types";

const toBase = (quantity: number, unit: string) => (unit === "kg" || unit === "l" ? quantity * 1000 : quantity);
const available = (item: InventoryItem) => toBase(item.quantity, item.unit);

export function stockCoverage(requirements: IngredientRequirement[]) {
  if (!requirements.length) return { coverage: 75, missing: [] as string[] };
  const missing: string[] = [];
  let ratios = 0;
  for (const requirement of requirements) {
    const item = inventory.find((entry) => entry.name.toLowerCase() === requirement.name.toLowerCase());
    const ratio = item ? Math.min(1, available(item) / toBase(requirement.quantity, requirement.unit)) : 0;
    ratios += ratio;
    if (ratio < 1) missing.push(requirement.name);
  }
  return { coverage: Math.round((ratios / requirements.length) * 100), missing };
}

export function rankChefs(requirements: IngredientRequirement[]): ChefCandidate[] {
  const nadia = stockCoverage(requirements);
  const candidates: ChefCandidate[] = [
    { name: "Nadia Rahman", score: Math.min(99, Math.round(nadia.coverage * 0.65 + 31)), stockCoverage: nadia.coverage, distance: "1.0 km", missingIngredients: nadia.missing },
    { name: "Maya Patel", score: 86, stockCoverage: 91, distance: "1.3 km", missingIngredients: nadia.missing.slice(0, 1) },
    { name: "Asha Begum", score: 79, stockCoverage: 84, distance: "1.8 km", missingIngredients: nadia.missing.slice(0, 2) },
  ];
  return candidates.sort((a, b) => b.score - a.score);
}

export function deductInventory(requirements: IngredientRequirement[]) {
  for (const requirement of requirements) {
    const item = inventory.find((entry) => entry.name.toLowerCase() === requirement.name.toLowerCase());
    if (!item) continue;
    const remaining = Math.max(0, available(item) - toBase(requirement.quantity, requirement.unit));
    item.quantity = item.unit === "kg" || item.unit === "l" ? Number((remaining / 1000).toFixed(2)) : Number(remaining.toFixed(1));
    item.updatedAt = new Date().toISOString();
  }
}
