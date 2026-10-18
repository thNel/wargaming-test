import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { SupportedLocale } from "@/shared/i18n/supportedLocales";
import type { AppDispatch } from "@/store";
import { selectCatalogStatus, selectAllCatalogVehicles } from "@/store/catalog/catalog.selectors";
import { loadCatalog } from "@/store/catalog/catalogThunks";
import { selectPreparedCatalogFilters } from "@/store/filters/filtersSlice";

import type {
  CatalogSortDirection,
  CatalogSortMode,
  CatalogVehiclesResult,
} from "../catalog.types";
import { sortCatalogVehicles } from "../sortCatalogVehicles";
import { useDebouncedCatalogVehicles } from "./useDebouncedCatalogVehicles";

export function useCatalogVehicles(
  locale: SupportedLocale,
  sortMode: CatalogSortMode,
  sortDirection: CatalogSortDirection,
): CatalogVehiclesResult {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(selectCatalogStatus);
  const vehicles = useSelector(selectAllCatalogVehicles);
  const filters = useSelector(selectPreparedCatalogFilters);

  useEffect(() => {
    if (status === "idle") {
      void dispatch(loadCatalog());
    }
  }, [dispatch, status]);

  function retry() {
    void dispatch(loadCatalog());
  }

  const visibleVehicles = useDebouncedCatalogVehicles(vehicles, filters, locale);
  const sortedVehicles = useMemo(
    () => sortCatalogVehicles(visibleVehicles, sortMode, sortDirection, locale),
    [locale, sortDirection, sortMode, visibleVehicles],
  );

  return { retry, status, count: visibleVehicles.length, vehicles: sortedVehicles };
}
