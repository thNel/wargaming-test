import { useEffect, useMemo, useState } from "react";

import type { SupportedLocale } from "@/shared/i18n/supportedLocales";
import type { CatalogVehicleCollection } from "@/store/catalog/catalog.types";
import { filterCatalogVehicles } from "@/store/catalog/filterCatalogVehicles";
import type { PreparedCatalogFilters } from "@/store/filters/filters.types";

const CATALOG_FILTER_DEBOUNCE_MS = 250;

export function useDebouncedCatalogVehicles(
  vehicles: CatalogVehicleCollection,
  filters: PreparedCatalogFilters,
  locale: SupportedLocale,
  delayMs = CATALOG_FILTER_DEBOUNCE_MS,
): CatalogVehicleCollection {
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedFilters(filters);
    }, delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [delayMs, filters]);

  return useMemo(
    () => filterCatalogVehicles(vehicles, debouncedFilters, locale),
    [debouncedFilters, locale, vehicles],
  );
}
