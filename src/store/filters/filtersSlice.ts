import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../index";
import type {
  CatalogFiltersState,
  NationKey,
  PreparedCatalogFilters,
  Tier,
  VehicleTypeKey,
} from "./filters.types";

const initialState: CatalogFiltersState = {
  searchTerm: "",
  nations: {
    ussr: false,
    japan: false,
    usa: false,
    uk: false,
    germany: false,
    france: false,
    italy: false,
    europe: false,
    pan_asia: false,
    commonwealth: false,
    pan_america: false,
    netherlands: false,
    spain: false,
  },
  classes: {
    Cruiser: false,
    AirCarrier: false,
    Battleship: false,
    Destroyer: false,
    Submarine: false,
  },
  tiers: {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    11: false,
  },
  showHidden: true,
  showMissing: true,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCatalogSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
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
    setShowHiddenShips(state, action: PayloadAction<boolean>) {
      state.showHidden = action.payload;
    },
    setShowMissingShips(state, action: PayloadAction<boolean>) {
      state.showMissing = action.payload;
    },
    resetCatalogFilters() {
      return initialState;
    },
  },
});

export const {
  resetCatalogFilters,
  setCatalogSearchTerm,
  setShowHiddenShips,
  setShowMissingShips,
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
    hasSelectionChanges(filters.tiers, initialState.tiers) ||
    filters.showHidden !== initialState.showHidden ||
    filters.showMissing !== initialState.showMissing,
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
      showHidden: filters.showHidden,
      showMissing: filters.showMissing,
    }),
);
