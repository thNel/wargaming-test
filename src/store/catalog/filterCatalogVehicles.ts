import type { SupportedLocale } from "@/shared/i18n/supportedLocales";

import type { PreparedCatalogFilters } from "../filters/filters.types";
import type { CatalogVehicle, CatalogVehicleCollection } from "./catalog.types";

function getSearchableText(vehicle: CatalogVehicle, locale: SupportedLocale): string[] {
  return [
    vehicle.locales.name[locale] ?? vehicle.locales.name.en,
    vehicle.locales.shortName[locale] ?? vehicle.locales.shortName.en,
  ].filter((value): value is string => Boolean(value));
}

function matchesSearch(
  vehicle: CatalogVehicle,
  searchTerm: string,
  locale: SupportedLocale,
): boolean {
  if (!searchTerm) {
    return true;
  }

  return getSearchableText(vehicle, locale).some((value) =>
    value.toLowerCase().includes(searchTerm),
  );
}

export function filterCatalogVehicles(
  vehicles: CatalogVehicleCollection,
  filters: PreparedCatalogFilters,
  locale: SupportedLocale,
): CatalogVehicle[] {
  const searchTerm = filters.searchTerm.trim().toLowerCase();

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

    if (!filters.showHidden && vehicle.tags.includes("catalogueHidden")) {
      return false;
    }

    if (!filters.showMissing && vehicle.tags.includes("catalogueHiddenIfMissing")) {
      return false;
    }

    return true;
  });
}
