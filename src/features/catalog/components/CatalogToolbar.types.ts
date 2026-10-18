import type { CatalogSortDirection, CatalogSortMode } from "../catalog.types";

export interface CatalogToolbarProps {
  count: number | null;
  onSortChange: (mode: CatalogSortMode) => void;
  sortDirection: CatalogSortDirection;
  sortMode: CatalogSortMode;
}
