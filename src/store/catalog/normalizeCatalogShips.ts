import type {
  CatalogNation,
  CatalogShipClass,
  CatalogShipCollection,
  CatalogSources,
} from "./catalog.types";
import type { NationDto } from "@/services/nations.dto";
import type { VehicleTypeDto } from "@/services/vehicle-types.dto";

function buildIconUrls(icons: Record<string, string>, mediaPath: string): Record<string, string> {
  const normalizedBase = mediaPath.replace(/\/+$/, "");

  return Object.fromEntries(
    Object.entries(icons)
      .filter(([key, path]) => !key.startsWith("local_") && !path.startsWith("gui/"))
      .map(([key, path]) => [key, `${normalizedBase}/${path.replace(/^\/+/, "")}`]),
  );
}

function createCatalogNation(nation: NationDto, mediaPath: string): CatalogNation {
  const { icons, localization, ...nationData } = nation;

  return Object.freeze({
    ...nationData,
    locales: localization.mark,
    icons: Object.freeze(buildIconUrls(icons, mediaPath)),
  });
}

function createCatalogVehicleType(
  key: string,
  vehicleType: VehicleTypeDto,
  mediaPath: string,
): CatalogShipClass {
  const { icons, localization, ...vehicleTypeData } = vehicleType;

  return Object.freeze({
    ...vehicleTypeData,
    key,
    locales: Object.freeze({
      name: localization.mark,
      shortName: localization.shortmark,
    }),
    icons: Object.freeze(buildIconUrls(icons, mediaPath)),
  });
}

export function normalizeCatalogShips({
  vehicles,
  nations,
  vehicleTypes,
  mediaPath,
}: CatalogSources): CatalogShipCollection {
  const nationsByName = new Map(
    nations.map((nation) => [nation.name, createCatalogNation(nation, mediaPath)]),
  );
  const vehicleTypesByKey = new Map(
    Object.entries(vehicleTypes).map(([key, vehicleType]) => [
      key,
      createCatalogVehicleType(key, vehicleType, mediaPath),
    ]),
  );

  return Object.freeze(
    Object.entries(vehicles).map(([id, vehicle]) => {
      const { icons, localization, nation: nationKey, tags, ...vehicleData } = vehicle;
      const shipClassKey = tags[0];
      const shipClass = shipClassKey ? (vehicleTypesByKey.get(shipClassKey) ?? null) : null;

      return Object.freeze({
        ...vehicleData,
        id,
        tags: Object.freeze(shipClass ? tags.slice(1) : [...tags]),
        locales: Object.freeze({
          name: localization.mark,
          shortName: localization.shortmark,
          description: localization.description,
        }),
        nation: nationsByName.get(nationKey) ?? null,
        class: shipClass,
        icons: Object.freeze(buildIconUrls(icons, mediaPath)),
      });
    }),
  );
}
