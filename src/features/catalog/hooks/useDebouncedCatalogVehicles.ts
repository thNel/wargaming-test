import { useEffect, useMemo, useState } from "react";

import type { SupportedLocale } from "@/shared/i18n/supportedLocales";
import type { CatalogVehicleCollection } from "@/store/catalog/catalog.types";
import { filterCatalogVehicles } from "@/store/catalog/filterCatalogVehicles";
import type { PreparedCatalogFilters } from "@/store/filters/filters.types";
import { CATALOG_SEARCH_DEBOUNCE_MS } from "../catalog.constants";

export function useDebouncedCatalogVehicles(
  vehicles: CatalogVehicleCollection,
  filters: PreparedCatalogFilters,
  locale: SupportedLocale,
  delayMs = CATALOG_SEARCH_DEBOUNCE_MS,
): CatalogVehicleCollection {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(filters.searchTerm);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(filters.searchTerm);
    }, delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [delayMs, filters.searchTerm]);

  return useMemo(
    () => filterCatalogVehicles(vehicles, { ...filters, searchTerm: debouncedSearchTerm }, locale),
    [debouncedSearchTerm, filters, locale, vehicles],
  );
}
