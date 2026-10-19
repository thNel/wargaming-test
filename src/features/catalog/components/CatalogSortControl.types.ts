import type { CatalogSortDirection, CatalogSortMode } from "../catalog.types";

export interface CatalogSortControlProps {
  onSortChange: (mode: CatalogSortMode) => void;
  sortDirection: CatalogSortDirection;
  sortMode: CatalogSortMode;
}
