import type { CATALOG_SORT_OPTIONS } from "./catalog.constants";
import type { CatalogStatus, CatalogVehicleCollection } from "@/store/catalog/catalog.types";

export type CatalogSortMode = (typeof CATALOG_SORT_OPTIONS)[number]["value"];
export type CatalogSortDirection = "ascending" | "descending";

export interface CatalogSortState {
  mode: CatalogSortMode;
  direction: CatalogSortDirection;
}

export interface CatalogVehiclesResult {
  count: number;
  retry: () => void;
  status: CatalogStatus;
  vehicles: CatalogVehicleCollection;
}
