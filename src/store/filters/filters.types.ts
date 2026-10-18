import type { Tier as SharedTier } from "@/shared/constants/tiers.constants";
import type {
  NationKey as SharedNationKey,
  VehicleTypeKey as SharedVehicleTypeKey,
} from "@/shared/constants/catalogFilters.constants";

export type NationKey = SharedNationKey;
export type VehicleTypeKey = SharedVehicleTypeKey;

export type Tier = SharedTier;

export interface CatalogFiltersState {
  searchTerm: string;
  nations: Record<NationKey, boolean>;
  classes: Record<VehicleTypeKey, boolean>;
  tiers: Record<Tier, boolean>;
}

export interface PreparedCatalogFilters {
  searchTerm: string;
  nations: readonly NationKey[];
  classes: readonly VehicleTypeKey[];
  tiers: readonly Tier[];
}
