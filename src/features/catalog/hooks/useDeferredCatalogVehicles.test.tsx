import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SUPPORTED_LOCALES, type SupportedLocale } from "@/shared/i18n/supportedLocales";
import type { CatalogVehicle } from "@/store/catalog/catalog.types";
import type { PreparedCatalogFilters } from "@/store/filters/filters.types";
import { useDeferredCatalogVehicles } from "./useDeferredCatalogVehicles";

const emptyFilters: PreparedCatalogFilters = {
  searchTerm: "",
  nations: [],
  classes: [],
  tiers: [],
};

function createNameByLocale(name: string): Readonly<Record<SupportedLocale, string>> {
  return Object.fromEntries(SUPPORTED_LOCALES.map((locale) => [locale, name])) as Record<
    SupportedLocale,
    string
  >;
}

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
    card: {
      nameByLocale: createNameByLocale("Yamato"),
      tierLabel: "X",
      artwork: { src: undefined, srcSet: undefined, sizes: undefined },
      nationBackdrop: undefined,
      classIconUrl: undefined,
      classTitleByLocale: undefined,
      classTooltipKey: undefined,
      hasPremiumAppearance: false,
    },
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
    card: {
      nameByLocale: createNameByLocale("Bismarck"),
      tierLabel: "VIII",
      artwork: { src: undefined, srcSet: undefined, sizes: undefined },
      nationBackdrop: undefined,
      classIconUrl: undefined,
      classTitleByLocale: undefined,
      classTooltipKey: undefined,
      hasPremiumAppearance: false,
    },
  },
];

describe("useDeferredCatalogVehicles", () => {
  it("applies discrete filters immediately", () => {
    const filters: PreparedCatalogFilters = {
      ...emptyFilters,
      tiers: [10],
    };
    const { result, rerender } = renderHook(
      ({ activeFilters }) => useDeferredCatalogVehicles(vehicles, activeFilters, "en"),
      { initialProps: { activeFilters: emptyFilters } },
    );

    expect(result.current.map(({ id }) => id)).toEqual(["yamato", "bismarck"]);

    rerender({ activeFilters: filters });

    expect(result.current.map(({ id }) => id)).toEqual(["yamato"]);
  });

  it("filters by the applied search term", async () => {
    const { result, rerender } = renderHook(
      ({ activeFilters }) => useDeferredCatalogVehicles(vehicles, activeFilters, "en"),
      { initialProps: { activeFilters: emptyFilters } },
    );

    rerender({ activeFilters: { ...emptyFilters, searchTerm: "bismarck" } });

    await waitFor(() => expect(result.current.map(({ id }) => id)).toEqual(["bismarck"]));
  });
});
