import { defineConstants } from "./defineConstants";

export const TIERS = defineConstants([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

export type Tier = (typeof TIERS)[number];

export const TIER_LABELS = defineConstants({
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
  8: "VIII",
  9: "IX",
  10: "X",
  11: "★",
} satisfies Record<Tier, string>);
