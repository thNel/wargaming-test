import { defineConstants } from "@/shared/constants/defineConstants";

export const CATALOG_SKELETON_COUNT = 6;
export const CATALOG_VIRTUALIZATION_OVERSCAN_ROWS = 2;
export const CATALOG_ESTIMATED_ROW_HEIGHT = 220;
export const CATALOG_SINGLE_COLUMN_MAX_WIDTH = 420;
export const CATALOG_TWO_COLUMN_MAX_WIDTH = 1024;

export const CATALOG_SORT_OPTIONS = defineConstants([
  { value: "default", labelKey: "sortDefault" },
  { value: "name", labelKey: "sortByName" },
  { value: "level", labelKey: "sortByLevel" },
]);

export const CATALOG_DEFAULT_SORT_MODE = "default";
export const CATALOG_DEFAULT_SORT_DIRECTIONS = defineConstants({
  name: "ascending",
  level: "descending",
});
