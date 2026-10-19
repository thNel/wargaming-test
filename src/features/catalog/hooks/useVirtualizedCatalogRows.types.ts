export interface VirtualizedCatalogRowsResult {
  columnCount: number;
  listElementRef: (element: HTMLUListElement | null) => void;
  measureRef: (element: HTMLLIElement | null) => void;
  paddingBottom: number;
  paddingTop: number;
  rows: readonly VirtualizedCatalogRow[];
}

export interface VirtualizedCatalogRow {
  endIndex: number;
  index: number;
  spacerBefore: number;
  startIndex: number;
}

export interface ViewportState {
  height: number;
  listTop: number;
  scrollY: number;
  width: number;
}

export interface RowMetrics {
  gap: number;
  height: number;
}
