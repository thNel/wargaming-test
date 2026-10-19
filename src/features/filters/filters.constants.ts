import { defineConstants } from "@/shared/constants/defineConstants";
import type { NationKey, VehicleTypeKey } from "@/shared/constants/catalogFilters.constants";
import type en from "./locales/en/filters.json";

export const FILTER_SEARCH_DEBOUNCE_MS = 750;

export const NATION_FALLBACK_LABELS: Readonly<Record<NationKey, string>> = defineConstants({
  ussr: "USSR",
  japan: "Japan",
  usa: "United States",
  uk: "UK",
  germany: "Germany",
  france: "France",
  italy: "Italy",
  europe: "Europe",
  pan_asia: "Pan Asia",
  commonwealth: "Commonwealth",
  pan_america: "Pan America",
  netherlands: "Netherlands",
  spain: "Spain",
});

export const VEHICLE_TYPE_TRANSLATION_KEYS: Readonly<Record<VehicleTypeKey, keyof typeof en>> =
  defineConstants({
    Cruiser: "classCruiser",
    AirCarrier: "classAircraftCarrier",
    Battleship: "classBattleship",
    Destroyer: "classDestroyer",
    Submarine: "classSubmarine",
  });
