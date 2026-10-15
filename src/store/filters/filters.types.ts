export type NationKey =
  | "ussr"
  | "japan"
  | "usa"
  | "uk"
  | "germany"
  | "france"
  | "italy"
  | "europe"
  | "pan_asia"
  | "commonwealth"
  | "pan_america"
  | "netherlands"
  | "spain";

export type VehicleTypeKey = "Cruiser" | "AirCarrier" | "Battleship" | "Destroyer" | "Submarine";

export type Tier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface CatalogFiltersState {
  searchTerm: string;
  nations: Record<NationKey, boolean>;
  classes: Record<VehicleTypeKey, boolean>;
  tiers: Record<Tier, boolean>;
  showHidden: boolean;
  showMissing: boolean;
}

export interface PreparedCatalogFilters {
  searchTerm: string;
  nations: readonly NationKey[];
  classes: readonly VehicleTypeKey[];
  tiers: readonly Tier[];
  showHidden: boolean;
  showMissing: boolean;
}
