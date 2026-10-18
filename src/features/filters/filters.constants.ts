import type { NationKey, Tier, VehicleTypeKey } from "@/store/filters/filters.types";
import type en from "./locales/en/filters.json";

export const NATION_KEYS: readonly NationKey[] = Object.freeze([
  "ussr",
  "japan",
  "usa",
  "uk",
  "germany",
  "france",
  "italy",
  "europe",
  "pan_asia",
  "commonwealth",
  "pan_america",
  "netherlands",
  "spain",
]);

export const VEHICLE_TYPES: readonly VehicleTypeKey[] = Object.freeze([
  "Cruiser",
  "AirCarrier",
  "Battleship",
  "Destroyer",
  "Submarine",
]);

export const TIERS: readonly Tier[] = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

export const TIER_LABELS: Readonly<Record<Tier, string>> = Object.freeze({
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
});

export const VEHICLE_TYPE_TRANSLATION_KEYS: Readonly<Record<VehicleTypeKey, keyof typeof en>> =
  Object.freeze({
    Cruiser: "classCruiser",
    AirCarrier: "classAircraftCarrier",
    Battleship: "classBattleship",
    Destroyer: "classDestroyer",
    Submarine: "classSubmarine",
  });
