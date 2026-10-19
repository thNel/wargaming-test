import { describe, expect, it } from "vitest";

import { SUPPORTED_LOCALES, type SupportedLocale } from "@/shared/i18n/supportedLocales";
import type { CatalogVehicle } from "@/store/catalog/catalog.types";

import { sortCatalogVehicles } from "./sortCatalogVehicles";

function createVehicle(
  id: string,
  name: string,
  localizedNames: CatalogVehicle["locales"]["name"],
  level = 1,
): CatalogVehicle {
  const nameByLocale = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [locale, localizedNames[locale] ?? name]),
  ) as Record<SupportedLocale, string>;

  return {
    id,
    name,
    level,
    tags: [],
    locales: { name: localizedNames, shortName: {}, description: {} },
    nation: null,
    class: null,
    icons: {},
    card: {
      nameByLocale,
      tierLabel: level,
      artwork: { src: undefined, srcSet: undefined, sizes: undefined },
      nationBackdrop: undefined,
      classIconUrl: undefined,
      classTitleByLocale: undefined,
      classTooltipKey: undefined,
      hasPremiumAppearance: false,
    },
  };
}

describe("sortCatalogVehicles", () => {
  it("sorts by the full active-locale name", () => {
    const vehicles = [
      createVehicle("a", "Alpha source", { en: "Zulu translation" }),
      createVehicle("b", "Zulu source", { en: "Alpha translation" }),
    ];

    expect(sortCatalogVehicles(vehicles, "name", "ascending", "en").map(({ id }) => id)).toEqual([
      "b",
      "a",
    ]);
  });

  it("falls back directly to the original full name when no translation exists", () => {
    const vehicles = [
      createVehicle("a", "Zulu source", { en: "Alpha translation" }),
      createVehicle("b", "Alpha source", { en: "Zulu translation" }),
    ];

    expect(sortCatalogVehicles(vehicles, "name", "ascending", "ru").map(({ id }) => id)).toEqual([
      "b",
      "a",
    ]);
  });

  it("sorts by tier in the selected direction", () => {
    const vehicles = [
      createVehicle("a", "Tier six", {}, 6),
      createVehicle("b", "Tier ten", {}, 10),
      createVehicle("c", "Tier eight", {}, 8),
    ];

    expect(sortCatalogVehicles(vehicles, "level", "descending", "en").map(({ id }) => id)).toEqual([
      "b",
      "c",
      "a",
    ]);
    expect(sortCatalogVehicles(vehicles, "level", "ascending", "en").map(({ id }) => id)).toEqual([
      "a",
      "c",
      "b",
    ]);
  });

  it("preserves the source order for the default mode", () => {
    const vehicles = [
      createVehicle("c", "Charlie", {}, 6),
      createVehicle("a", "Alpha", {}, 10),
      createVehicle("b", "Bravo", {}, 8),
    ];

    expect(
      sortCatalogVehicles(vehicles, "default", "descending", "en").map(({ id }) => id),
    ).toEqual(["c", "a", "b"]);
  });
});
