import type { SupportedLocale } from "@/shared/i18n/supportedLocales";
import { normalizeSearchTerm } from "@/shared/utils/normalizeSearchTerm";

import type { PreparedCatalogFilters } from "../filters/filters.types";
import type { CatalogVehicle, CatalogVehicleCollection } from "./catalog.types";
import { getCatalogVehicleName } from "./getCatalogVehicleName";

function matchesSearch(
  vehicle: CatalogVehicle,
  searchTerm: string,
  locale: SupportedLocale,
): boolean {
  if (!searchTerm) {
    return true;
  }

  return getCatalogVehicleName(vehicle, locale).toLowerCase().includes(searchTerm);
}

export function filterCatalogVehicles(
  vehicles: CatalogVehicleCollection,
  filters: PreparedCatalogFilters,
  locale: SupportedLocale,
): CatalogVehicle[] {
  const searchTerm = normalizeSearchTerm(filters.searchTerm);

  return vehicles.filter((vehicle) => {
    if (!matchesSearch(vehicle, searchTerm, locale)) {
      return false;
    }

    if (
      filters.nations.length > 0 &&
      !filters.nations.some((nation) => nation === vehicle.nation?.name)
    ) {
      return false;
    }

    if (
      filters.classes.length > 0 &&
      !filters.classes.some((vehicleType) => vehicleType === vehicle.class?.key)
    ) {
      return false;
    }

    if (filters.tiers.length > 0 && !filters.tiers.some((tier) => tier === vehicle.level)) {
      return false;
    }

    return true;
  });
}
