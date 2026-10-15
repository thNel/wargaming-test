import { describe, expect, it } from "vitest";

import { normalizeCatalogVehicles } from "./normalizeCatalogVehicles";

describe("normalizeCatalogVehicles", () => {
  it("joins each vehicle with its nation, class, localized labels, and media URLs", () => {
    const vehicles = normalizeCatalogVehicles({
      vehicles: {
        "vehicle-1": {
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

    const vehicle = vehicles.find(({ id }) => id === "vehicle-1");

    expect(vehicle).toMatchObject({
      id: "vehicle-1",
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

    expect(vehicle?.nation?.locales.ru).toBe("Япония");
    expect(vehicle?.class?.locales.name.ru).toBe("Линкор");
    expect(vehicle).not.toHaveProperty("localization");
    expect(vehicle).not.toHaveProperty("nationInfo");
    expect(vehicle).not.toHaveProperty("shipTypeInfo");
    expect(Object.isFrozen(vehicles)).toBe(true);
    expect(Object.isFrozen(vehicle)).toBe(true);
    expect(Object.isFrozen(vehicle?.nation)).toBe(true);
    expect(Object.isFrozen(vehicle?.class)).toBe(true);
  });

  it("preserves available language dictionaries and missing reference data", () => {
    const vehicles = normalizeCatalogVehicles({
      vehicles: {
        "vehicle-2": {
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

    const vehicle = vehicles.find(({ id }) => id === "vehicle-2");

    expect(vehicle?.locales).toEqual({
      name: { en: "English name" },
      shortName: {},
      description: { en: "English description" },
    });
    expect(vehicle?.class?.locales.name).toEqual({ en: "Cruiser" });
    expect(vehicle?.nation).toBeNull();
  });

  it("keeps vehicles whose nation or class reference is unavailable", () => {
    const vehicles = normalizeCatalogVehicles({
      vehicles: {
        "vehicle-3": {
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

    expect(vehicles.find(({ id }) => id === "vehicle-3")).toMatchObject({
      id: "vehicle-3",
      locales: { name: {}, shortName: {}, description: {} },
      nation: null,
      class: null,
      icons: { small: "/icons/vehicle/small/unknown.png" },
    });
  });

  it("shares frozen nation and class objects between vehicles", () => {
    const sources = {
      vehicles: {
        "vehicle-1": {
          level: 10,
          name: "Ship One",
          nation: "japan",
          tags: ["Battleship", "special"],
          icons: {},
          localization: { mark: {}, shortmark: {}, description: {} },
        },
        "vehicle-2": {
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
    const vehicles = normalizeCatalogVehicles(sources);

    expect(vehicles[0]?.nation).toBe(vehicles[1]?.nation);
    expect(vehicles[0]?.class).toBe(vehicles[1]?.class);
  });
});
