import { useDeferredValue } from "react";

import type { SupportedLocale } from "@/shared/i18n/supportedLocales";
import { normalizeSearchTerm } from "@/shared/utils/normalizeSearchTerm";
import type { CatalogVehicleCollection } from "@/store/catalog/catalog.types";
import { filterCatalogVehicles } from "@/store/catalog/filterCatalogVehicles";
import type { PreparedCatalogFilters } from "@/store/filters/filters.types";

export function useDeferredCatalogVehicles(
  vehicles: CatalogVehicleCollection,
  filters: PreparedCatalogFilters,
  locale: SupportedLocale,
): CatalogVehicleCollection {
  const deferredSearchTerm = useDeferredValue(filters.searchTerm);

  return filterCatalogVehicles(
    vehicles,
    { ...filters, searchTerm: normalizeSearchTerm(deferredSearchTerm) },
    locale,
  );
}
