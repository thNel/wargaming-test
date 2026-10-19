import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { NATION_KEYS, VEHICLE_TYPE_KEYS } from "@/shared/constants/catalogFilters.constants";
import { TIERS } from "@/shared/constants/tiers.constants";

import type { RootState } from "../index";
import type {
  CatalogFiltersState,
  NationKey,
  PreparedCatalogFilters,
  Tier,
  VehicleTypeKey,
} from "./filters.types";

function createSelectionMap<Key extends string | number>(
  keys: readonly Key[],
): Record<Key, boolean> {
  return Object.fromEntries(keys.map((key) => [key, false])) as Record<Key, boolean>;
}

export function createInitialCatalogFilters(): CatalogFiltersState {
  return {
    searchTerm: "",
    nations: createSelectionMap(NATION_KEYS),
    classes: createSelectionMap(VEHICLE_TYPE_KEYS),
    tiers: createSelectionMap(TIERS),
  };
}

const initialState = createInitialCatalogFilters();

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCatalogSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    applyCatalogFilters(_state, action: PayloadAction<CatalogFiltersState>) {
      return action.payload;
    },
    toggleCatalogNation(state, action: PayloadAction<NationKey>) {
      state.nations[action.payload] = !state.nations[action.payload];
    },
    toggleCatalogClass(state, action: PayloadAction<VehicleTypeKey>) {
      state.classes[action.payload] = !state.classes[action.payload];
    },
    toggleCatalogTier(state, action: PayloadAction<Tier>) {
      state.tiers[action.payload] = !state.tiers[action.payload];
    },
    resetCatalogFilters() {
      return initialState;
    },
  },
});

export const {
  applyCatalogFilters,
  resetCatalogFilters,
  setCatalogSearchTerm,
  toggleCatalogClass,
  toggleCatalogNation,
  toggleCatalogTier,
} = filtersSlice.actions;

export const filtersReducer = filtersSlice.reducer;

export function selectCatalogFilters(state: RootState): CatalogFiltersState {
  return state.filters;
}

function hasSelectionChanges<Key extends string>(
  selections: Readonly<Record<Key, boolean>>,
  initialSelections: Readonly<Record<Key, boolean>>,
): boolean {
  return Object.keys(initialSelections).some((key) => {
    const selectionKey = key as Key;

    return selections[selectionKey] !== initialSelections[selectionKey];
  });
}

export const selectHasActiveCatalogFilters = createSelector(
  [selectCatalogFilters],
  (filters) =>
    filters.searchTerm.trim() !== initialState.searchTerm ||
    hasSelectionChanges(filters.nations, initialState.nations) ||
    hasSelectionChanges(filters.classes, initialState.classes) ||
    hasSelectionChanges(filters.tiers, initialState.tiers),
);

function selectEnabledKeys<Key extends string>(
  selections: Readonly<Record<Key, boolean>>,
): readonly Key[] {
  return Object.freeze((Object.keys(selections) as Key[]).filter((key) => selections[key]));
}

function selectEnabledTiers(selections: Readonly<Record<Tier, boolean>>): readonly Tier[] {
  return Object.freeze(
    Object.keys(selections)
      .filter((tier) => selections[Number(tier) as Tier])
      .map((tier) => Number(tier) as Tier),
  );
}

export const selectPreparedCatalogFilters = createSelector(
  [selectCatalogFilters],
  (filters): PreparedCatalogFilters =>
    Object.freeze({
      searchTerm: filters.searchTerm,
      nations: selectEnabledKeys(filters.nations),
      classes: selectEnabledKeys(filters.classes),
      tiers: selectEnabledTiers(filters.tiers),
    }),
);
