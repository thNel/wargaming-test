import { describe, expect, it } from "vitest";

import { normalizeCatalogShips } from "./normalizeCatalogShips";

describe("normalizeCatalogShips", () => {
  it("joins each ship with its nation, class, localized labels, and media URLs", () => {
    const ships = normalizeCatalogShips({
      vehicles: {
        "ship-1": {
          level: 10,
          name: "JPNB110_Yamato",
          nation: "japan",
          tags: ["Battleship", "special"],
          icons: {
            small: "vehicle/small/yamato.png",
            large: "vehicle/large/yamato.png",
            local_small: "gui/ship_previews/yamato.png",
          },
          localization: {
            mark: { en: "Yamato", ru: "Ямато" },
            shortmark: { en: "Yamato", ru: "Ямато" },
            description: { en: "The Yamato description.", ru: "Описание Ямато." },
          },
        },
      },
      nations: [
        {
          name: "japan",
          id: 1,
          color: 123,
          tags: ["inTree"],
          icons: {
            small: "nation_flags/small/japan.png",
            local_small: "gui/nation_flags/small/japan.png",
          },
          localization: { mark: { en: "Japan", ru: "Япония" } },
        },
      ],
      vehicleTypes: {
        Battleship: {
          sort_order: 4,
          icons: {
            default: "vehicle/types/Battleship/standard.png",
            special: "vehicle/types/Battleship/special.png",
          },
          localization: {
            mark: { en: "Battleship", ru: "Линкор" },
            shortmark: { en: "BB", ru: "ЛК" },
          },
        },
      },
      mediaPath: "https://cdn.example.test/icons/",
    });

    const ship = ships.find(({ id }) => id === "ship-1");

    expect(ship).toMatchObject({
      id: "ship-1",
      level: 10,
      name: "JPNB110_Yamato",
      tags: ["special"],
      locales: {
        name: { en: "Yamato", ru: "Ямато" },
        shortName: { en: "Yamato", ru: "Ямато" },
        description: { en: "The Yamato description.", ru: "Описание Ямато." },
      },
      nation: {
        name: "japan",
        id: 1,
        locales: { en: "Japan", ru: "Япония" },
        icons: {
          small: "https://cdn.example.test/icons/nation_flags/small/japan.png",
        },
      },
      class: {
        key: "Battleship",
        locales: {
          name: { en: "Battleship", ru: "Линкор" },
          shortName: { en: "BB", ru: "ЛК" },
        },
        icons: {
          default: "https://cdn.example.test/icons/vehicle/types/Battleship/standard.png",
          special: "https://cdn.example.test/icons/vehicle/types/Battleship/special.png",
        },
      },
      icons: {
        small: "https://cdn.example.test/icons/vehicle/small/yamato.png",
        large: "https://cdn.example.test/icons/vehicle/large/yamato.png",
      },
    });

    expect(ship?.nation?.locales.ru).toBe("Япония");
    expect(ship?.class?.locales.name.ru).toBe("Линкор");
    expect(ship).not.toHaveProperty("localization");
    expect(ship).not.toHaveProperty("nationInfo");
    expect(ship).not.toHaveProperty("shipTypeInfo");
    expect(Object.isFrozen(ships)).toBe(true);
    expect(Object.isFrozen(ship)).toBe(true);
    expect(Object.isFrozen(ship?.nation)).toBe(true);
    expect(Object.isFrozen(ship?.class)).toBe(true);
  });

  it("preserves available language dictionaries and missing reference data", () => {
    const ships = normalizeCatalogShips({
      vehicles: {
        "ship-2": {
          level: 3,
          name: "USSB003_InternalName",
          nation: "missing-nation",
          tags: ["Cruiser"],
          icons: {},
          localization: {
            mark: { en: "English name" },
            shortmark: {},
            description: { en: "English description" },
          },
        },
      },
      nations: [],
      vehicleTypes: {
        Cruiser: {
          sort_order: 3,
          icons: {},
          localization: { mark: { en: "Cruiser" }, shortmark: {} },
        },
      },
      mediaPath: "/icons",
    });

    const ship = ships.find(({ id }) => id === "ship-2");

    expect(ship?.locales).toEqual({
      name: { en: "English name" },
      shortName: {},
      description: { en: "English description" },
    });
    expect(ship?.class?.locales.name).toEqual({ en: "Cruiser" });
    expect(ship?.nation).toBeNull();
  });

  it("keeps ships whose nation or class reference is unavailable", () => {
    const ships = normalizeCatalogShips({
      vehicles: {
        "ship-3": {
          level: 1,
          name: "UnknownShip",
          nation: "unknown",
          tags: ["unknown-class"],
          icons: { small: "vehicle/small/unknown.png" },
          localization: { mark: {}, shortmark: {}, description: {} },
        },
      },
      nations: [],
      vehicleTypes: {},
      mediaPath: "/icons/",
    });

    expect(ships.find(({ id }) => id === "ship-3")).toMatchObject({
      id: "ship-3",
      locales: { name: {}, shortName: {}, description: {} },
      nation: null,
      class: null,
      icons: { small: "/icons/vehicle/small/unknown.png" },
    });
  });

  it("shares frozen nation and class objects between ships", () => {
    const sources = {
      vehicles: {
        "ship-1": {
          level: 10,
          name: "Ship One",
          nation: "japan",
          tags: ["Battleship", "special"],
          icons: {},
          localization: { mark: {}, shortmark: {}, description: {} },
        },
        "ship-2": {
          level: 9,
          name: "Ship Two",
          nation: "japan",
          tags: ["Battleship", "premium"],
          icons: {},
          localization: { mark: {}, shortmark: {}, description: {} },
        },
      },
      nations: [
        {
          name: "japan",
          id: 1,
          color: 123,
          tags: [],
          icons: {},
          localization: { mark: { en: "Japan" } },
        },
      ],
      vehicleTypes: {
        Battleship: {
          sort_order: 4,
          icons: {},
          localization: { mark: { en: "Battleship" }, shortmark: {} },
        },
      },
      mediaPath: "/icons",
    };
    const ships = normalizeCatalogShips(sources);

    expect(ships[0]?.nation).toBe(ships[1]?.nation);
    expect(ships[0]?.class).toBe(ships[1]?.class);
  });
});
