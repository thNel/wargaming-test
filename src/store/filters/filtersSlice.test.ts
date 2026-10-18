import { describe, expect, it } from "vitest";

import { createAppStore } from "@/store";
import {
  resetCatalogFilters,
  selectCatalogFilters,
  selectHasActiveCatalogFilters,
  selectPreparedCatalogFilters,
  setCatalogSearchTerm,
  toggleCatalogClass,
  toggleCatalogNation,
  toggleCatalogTier,
} from "./filtersSlice";

function defaultFilters() {
  return {
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
  };
}

describe("catalog filters", () => {
  it("selects the complete default filter state", () => {
    const store = createAppStore();

    expect(selectCatalogFilters(store.getState())).toEqual(defaultFilters());
    expect(selectHasActiveCatalogFilters(store.getState())).toBe(false);
  });

  it("checks active filters against the initial values", () => {
    const store = createAppStore();

    store.dispatch(toggleCatalogNation("japan"));
    expect(selectHasActiveCatalogFilters(store.getState())).toBe(true);

    store.dispatch(toggleCatalogNation("japan"));
    expect(selectHasActiveCatalogFilters(store.getState())).toBe(false);

    store.dispatch(setCatalogSearchTerm("  Yamato  "));
    expect(selectHasActiveCatalogFilters(store.getState())).toBe(true);

    store.dispatch(setCatalogSearchTerm("   "));
    expect(selectHasActiveCatalogFilters(store.getState())).toBe(false);
  });

  it("selects prepared criteria for filtering", () => {
    const store = createAppStore();

    store.dispatch(toggleCatalogNation("japan"));
    store.dispatch(toggleCatalogNation("usa"));
    store.dispatch(toggleCatalogClass("Battleship"));
    store.dispatch(toggleCatalogTier(10));
    store.dispatch(setCatalogSearchTerm("  YaMaTo  "));

    expect(selectPreparedCatalogFilters(store.getState())).toEqual({
      searchTerm: "  YaMaTo  ",
      nations: ["japan", "usa"],
      classes: ["Battleship"],
      tiers: [10],
    });
  });

  it("keeps the prepared criteria reference stable until filters change", () => {
    const store = createAppStore();
    const firstResult = selectPreparedCatalogFilters(store.getState());

    expect(selectPreparedCatalogFilters(store.getState())).toBe(firstResult);

    store.dispatch(setCatalogSearchTerm("yamato"));

    expect(selectPreparedCatalogFilters(store.getState())).not.toBe(firstResult);
  });

  it("supports multi-select values and the search term", () => {
    const store = createAppStore();

    store.dispatch(toggleCatalogNation("japan"));
    store.dispatch(toggleCatalogNation("usa"));
    store.dispatch(toggleCatalogClass("Battleship"));
    store.dispatch(toggleCatalogClass("Cruiser"));
    store.dispatch(toggleCatalogTier(8));
    store.dispatch(toggleCatalogTier(10));
    store.dispatch(setCatalogSearchTerm("Yamato"));

    expect(selectCatalogFilters(store.getState())).toEqual({
      searchTerm: "Yamato",
      nations: { ...defaultFilters().nations, japan: true, usa: true },
      classes: { ...defaultFilters().classes, Battleship: true, Cruiser: true },
      tiers: { ...defaultFilters().tiers, 8: true, 10: true },
    });
  });

  it("removes selected values and resets every filter to its default", () => {
    const store = createAppStore();

    store.dispatch(toggleCatalogNation("japan"));
    store.dispatch(toggleCatalogNation("japan"));
    store.dispatch(toggleCatalogTier(10));
    store.dispatch(toggleCatalogTier(10));
    store.dispatch(setCatalogSearchTerm("Yamato"));

    expect(selectCatalogFilters(store.getState())).toEqual({
      searchTerm: "Yamato",
      nations: defaultFilters().nations,
      classes: defaultFilters().classes,
      tiers: defaultFilters().tiers,
    });

    store.dispatch(resetCatalogFilters());

    expect(selectCatalogFilters(store.getState())).toEqual(defaultFilters());
  });
});
