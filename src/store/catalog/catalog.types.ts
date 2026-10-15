import type { NationDto } from "@/services/nations.dto";
import type { VehicleDto } from "@/services/vehicles.dto";
import type { VehicleTypeDto } from "@/services/vehicle-types.dto";

export type LocaleMap = Readonly<Record<string, string>>;

export interface CatalogShipLocales {
  readonly name: LocaleMap;
  readonly shortName: LocaleMap;
  readonly description: LocaleMap;
}

export type CatalogNation = Readonly<
  Omit<NationDto, "icons" | "localization"> & {
    locales: LocaleMap;
    icons: Readonly<Record<string, string>>;
  }
>;

export type CatalogShipClass = Readonly<
  Omit<VehicleTypeDto, "icons" | "localization"> & {
    key: string;
    locales: Readonly<{ name: LocaleMap; shortName: LocaleMap }>;
    icons: Readonly<Record<string, string>>;
  }
>;

export type CatalogShip = Readonly<
  Omit<VehicleDto, "icons" | "localization" | "nation" | "tags"> & {
    id: string;
    tags: readonly string[];
    locales: CatalogShipLocales;
    nation: CatalogNation | null;
    class: CatalogShipClass | null;
    icons: Readonly<Record<string, string>>;
  }
>;

export interface CatalogSources {
  vehicles: Record<string, VehicleDto>;
  nations: NationDto[];
  vehicleTypes: Record<string, VehicleTypeDto>;
  mediaPath: string;
}

export type CatalogShipCollection = readonly CatalogShip[];
