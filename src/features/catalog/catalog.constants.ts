import { defineConstants } from "@/shared/constants/defineConstants";

export const CATALOG_SKELETON_COUNT = 6;
export const CATALOG_SEARCH_DEBOUNCE_MS = 750;

export const CATALOG_SORT_OPTIONS = defineConstants([
  { mode: "default", labelKey: "sortDefault" },
  { mode: "name", labelKey: "sortByName" },
  { mode: "level", labelKey: "sortByLevel" },
]);

export const CATALOG_DEFAULT_SORT_MODE = "default";
export const CATALOG_DEFAULT_SORT_DIRECTIONS = defineConstants({
  name: "ascending",
  level: "descending",
});
