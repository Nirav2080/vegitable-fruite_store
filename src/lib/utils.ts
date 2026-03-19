import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Shared Weight helpers ───────────────────────────────────────────────────

export function parseWeightToGrams(weight: string): number {
  if (!weight) return 0;
  const lower = weight.toLowerCase().trim();
  const kgMatch = lower.match(/^([\d.]+)\s*kg/);
  if (kgMatch) return parseFloat(kgMatch[1]) * 1000;
  const gMatch = lower.match(/^([\d.]+)\s*g/);
  if (gMatch) return parseFloat(gMatch[1]);
  return 0;
}

export function getProductMode(variant: { weight: string }, unitType?: string): 'weight' | 'piece' {
  if (!variant || !variant.weight) return 'piece';
  const gramsFromVariant = parseWeightToGrams(variant.weight);
  if (gramsFromVariant > 0) return 'weight';

  const unit = (unitType || '').toLowerCase();
  if (unit.includes('kg') || unit.includes('gram') || unit.includes('loose')) return 'weight';

  const w = variant.weight.toLowerCase();
  if (w.includes('kg') || w.includes('gram') || w === 'loose') return 'weight';

  return 'piece';
}

export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${Number.isInteger(kg) ? kg : kg.toFixed(2)}kg`;
  }
  return `${Math.round(grams)}g`;
}

export function getPieceLabel(variant: { weight: string }, unitType?: string, qty?: number): string {
  const unit = (unitType || (variant && variant.weight) || 'pc').toLowerCase();
  const count = qty ?? 1;
  if (unit.includes('bunch')) return count === 1 ? 'Bunch' : 'Bunches';
  if (unit.includes('punnet')) return count === 1 ? 'Punnet' : 'Punnets';
  if (unit.includes('bag')) return count === 1 ? 'Bag' : 'Bags';
  if (unit.includes('dozen')) return count === 1 ? 'Dozen' : 'Dozens';
  if (unit.includes('tub')) return count === 1 ? 'Tub' : 'Tubs';
  if (unit.includes('bottle') || unit.includes('liter')) return count === 1 ? 'Bottle' : 'Bottles';
  if (unit.includes('half')) return 'Half';
  if (unit.includes('piece') || unit.includes('quarter')) return count === 1 ? 'Piece' : 'Pieces';
  return count === 1 ? 'pc' : 'pcs';
}
