import { describe, expect, it } from "vitest";

import type { CatalogVehicle } from "./catalog.types";
import { filterCatalogVehicles } from "./filterCatalogVehicles";
import type { PreparedCatalogFilters } from "../filters/filters.types";

const defaultFilters: PreparedCatalogFilters = {
  searchTerm: "",
  nations: [],
  classes: [],
  tiers: [],
  showHidden: true,
  showMissing: true,
};

function createVehicle({
  id,
  name,
  nation,
  classKey,
  level,
  tags = [],
  locales,
}: {
  id: string;
  name: string;
  nation: string;
  classKey: "Battleship" | "Cruiser";
  level: 8 | 10;
  tags?: string[];
  locales?: CatalogVehicle["locales"];
}): CatalogVehicle {
  return {
    id,
    name: id,
    level,
    tags,
    locales: locales ?? { name: { en: name }, shortName: {}, description: {} },
    nation: {
      name: nation,
      id: 1,
      color: 0,
      tags: [],
      locales: { en: nation },
      icons: {},
    },
    class: {
      key: classKey,
      sort_order: 1,
      locales: { name: { en: classKey }, shortName: {} },
      icons: {},
    },
    icons: {},
  };
}

const vehicles = [
  createVehicle({
    id: "yamato",
    name: "SERVER_YAMATO_IDENTIFIER",
    nation: "japan",
    classKey: "Battleship",
    level: 10,
    locales: {
      name: { en: "Yamato", ru: "Ямато" },
      shortName: { en: "Yamato", ru: "Ямато" },
      description: { en: "Legendary battleship", ru: "Легендарный линкор" },
    },
  }),
  createVehicle({
    id: "bismarck",
    name: "Bismarck",
    nation: "germany",
    classKey: "Battleship",
    level: 8,
  }),
  createVehicle({
    id: "des-moines",
    name: "Des Moines",
    nation: "usa",
    classKey: "Cruiser",
    level: 10,
  }),
  createVehicle({
    id: "hidden",
    name: "Hidden vehicle",
    nation: "japan",
    classKey: "Battleship",
    level: 10,
    tags: ["catalogueHidden"],
  }),
  createVehicle({
    id: "missing",
    name: "Missing vehicle",
    nation: "japan",
    classKey: "Battleship",
    level: 10,
    tags: ["catalogueHiddenIfMissing"],
  }),
];

describe("filterCatalogVehicles", () => {
  it("returns the complete collection when no filters are selected", () => {
    const result = filterCatalogVehicles(vehicles, defaultFilters, "en");

    expect(result.map(({ id }) => id)).toEqual(vehicles.map(({ id }) => id));
    expect(result).not.toBe(vehicles);
    expect(result.length).toBe(5);
  });

  it("applies multi-select values as OR within a group and AND between groups", () => {
    const filters: PreparedCatalogFilters = {
      ...defaultFilters,
      nations: ["japan", "germany"],
      classes: ["Battleship"],
      tiers: [8, 10],
    };

    const result = filterCatalogVehicles(vehicles, filters, "en");

    expect(result.map(({ id }) => id)).toEqual(["yamato", "bismarck", "hidden", "missing"]);
  });

  it("normalizes the search term for case-insensitive matching", () => {
    const result = filterCatalogVehicles(
      vehicles,
      { ...defaultFilters, searchTerm: "  yAmAtO  " },
      "en",
    );

    expect(result.map(({ id }) => id)).toEqual(["yamato"]);
  });

  it("searches only the active locale name and short name, with English fallback", () => {
    const russianMatch = filterCatalogVehicles(
      vehicles,
      { ...defaultFilters, searchTerm: "ямато" },
      "ru",
    );
    const englishNameInRussianLocale = filterCatalogVehicles(
      vehicles,
      { ...defaultFilters, searchTerm: "yamato" },
      "ru",
    );
    const serverIdentifier = filterCatalogVehicles(
      vehicles,
      { ...defaultFilters, searchTerm: "server_yamato_identifier" },
      "en",
    );
    const description = filterCatalogVehicles(
      vehicles,
      { ...defaultFilters, searchTerm: "legendary battleship" },
      "en",
    );
    const englishFallback = filterCatalogVehicles(
      vehicles,
      { ...defaultFilters, searchTerm: "bismarck" },
      "ru",
    );

    expect(russianMatch.map(({ id }) => id)).toEqual(["yamato"]);
    expect(englishNameInRussianLocale).toEqual([]);
    expect(serverIdentifier).toEqual([]);
    expect(description).toEqual([]);
    expect(englishFallback.map(({ id }) => id)).toEqual(["bismarck"]);
  });

  it("excludes hidden and missing vehicles only when their include flags are disabled", () => {
    const withoutHidden = filterCatalogVehicles(
      vehicles,
      {
        ...defaultFilters,
        showHidden: false,
      },
      "en",
    );
    const withoutMissing = filterCatalogVehicles(
      vehicles,
      {
        ...defaultFilters,
        showMissing: false,
      },
      "en",
    );

    expect(withoutHidden.map(({ id }) => id)).toEqual([
      "yamato",
      "bismarck",
      "des-moines",
      "missing",
    ]);
    expect(withoutMissing.map(({ id }) => id)).toEqual([
      "yamato",
      "bismarck",
      "des-moines",
      "hidden",
    ]);
  });
});
