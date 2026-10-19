import { useEffect } from "react";
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
import { useDeferredCatalogVehicles } from "./useDeferredCatalogVehicles";

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

  const visibleVehicles = useDeferredCatalogVehicles(vehicles, filters, locale);
  const sortedVehicles = sortCatalogVehicles(visibleVehicles, sortMode, sortDirection, locale);

  return {
    retry,
    status,
    count: visibleVehicles.length,
    vehicles: sortedVehicles,
  };
}
