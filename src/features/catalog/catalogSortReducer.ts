import { defineConstants } from "@/shared/constants/defineConstants";

import { CATALOG_DEFAULT_SORT_DIRECTIONS, CATALOG_DEFAULT_SORT_MODE } from "./catalog.constants";
import type { CatalogSortMode, CatalogSortState } from "./catalog.types";

export const INITIAL_CATALOG_SORT_STATE: CatalogSortState = defineConstants({
  mode: CATALOG_DEFAULT_SORT_MODE,
  direction: CATALOG_DEFAULT_SORT_DIRECTIONS.level,
});

export function catalogSortReducer(
  state: CatalogSortState,
  selectedMode: CatalogSortMode,
): CatalogSortState {
  if (selectedMode === "default") {
    return { ...state, mode: selectedMode };
  }

  if (selectedMode === state.mode) {
    return {
      ...state,
      direction: state.direction === "ascending" ? "descending" : "ascending",
    };
  }

  return {
    mode: selectedMode,
    direction: CATALOG_DEFAULT_SORT_DIRECTIONS[selectedMode],
  };
}
