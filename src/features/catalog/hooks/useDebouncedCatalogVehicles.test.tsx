import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { CatalogVehicle } from "@/store/catalog/catalog.types";
import type { PreparedCatalogFilters } from "@/store/filters/filters.types";
import { useDebouncedCatalogVehicles } from "./useDebouncedCatalogVehicles";

const emptyFilters: PreparedCatalogFilters = {
  searchTerm: "",
  nations: [],
  classes: [],
  tiers: [],
  showHidden: true,
  showMissing: true,
};

const vehicles: CatalogVehicle[] = [
  {
    id: "yamato",
    name: "JPNB110_Yamato",
    level: 10,
    tags: [],
    locales: { name: { en: "Yamato" }, shortName: {}, description: {} },
    nation: null,
    class: null,
    icons: {},
  },
  {
    id: "bismarck",
    name: "GERB018_Bismarck",
    level: 8,
    tags: [],
    locales: { name: { en: "Bismarck" }, shortName: {}, description: {} },
    nation: null,
    class: null,
    icons: {},
  },
];

afterEach(() => {
  vi.useRealTimers();
});

describe("useDebouncedCatalogVehicles", () => {
  it("filters after the debounce and its result length is the catalog count", () => {
    vi.useFakeTimers();

    const filters: PreparedCatalogFilters = {
      ...emptyFilters,
      tiers: [10],
    };
    const { result, rerender } = renderHook(
      ({ activeFilters }) => useDebouncedCatalogVehicles(vehicles, activeFilters, "en", 250),
      { initialProps: { activeFilters: emptyFilters } },
    );

    expect(result.current.map(({ id }) => id)).toEqual(["yamato", "bismarck"]);

    rerender({ activeFilters: filters });

    expect(result.current.map(({ id }) => id)).toEqual(["yamato", "bismarck"]);

    act(() => vi.advanceTimersByTime(249));
    expect(result.current.map(({ id }) => id)).toEqual(["yamato", "bismarck"]);

    act(() => vi.advanceTimersByTime(1));
    expect(result.current.map(({ id }) => id)).toEqual(["yamato"]);
    expect(result.current.length).toBe(1);
  });

  it("uses the latest filters when changes happen before the delay expires", () => {
    vi.useFakeTimers();

    const firstFilters = { ...emptyFilters, searchTerm: "yam" };
    const secondFilters = { ...emptyFilters, searchTerm: "bismarck" };
    const { result, rerender } = renderHook(
      ({ activeFilters }) => useDebouncedCatalogVehicles(vehicles, activeFilters, "en", 250),
      { initialProps: { activeFilters: emptyFilters } },
    );

    rerender({ activeFilters: firstFilters });
    act(() => vi.advanceTimersByTime(100));
    rerender({ activeFilters: secondFilters });
    act(() => vi.advanceTimersByTime(249));
    expect(result.current.map(({ id }) => id)).toEqual(["yamato", "bismarck"]);

    act(() => vi.advanceTimersByTime(1));
    expect(result.current.map(({ id }) => id)).toEqual(["bismarck"]);
  });
});
