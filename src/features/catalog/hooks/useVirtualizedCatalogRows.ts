import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  CATALOG_ESTIMATED_ROW_HEIGHT,
  CATALOG_SINGLE_COLUMN_MAX_WIDTH,
  CATALOG_TWO_COLUMN_MAX_WIDTH,
  CATALOG_VIRTUALIZATION_OVERSCAN_ROWS,
} from "../catalog.constants";
import type {
  RowMetrics,
  ViewportState,
  VirtualizedCatalogRowsResult,
} from "./useVirtualizedCatalogRows.types";

const initialViewport: ViewportState = { height: 768, listTop: 0, scrollY: 0, width: 1024 };

function requestViewportFrame(callback: FrameRequestCallback): number {
  if (typeof window.requestAnimationFrame === "function") {
    return window.requestAnimationFrame(callback);
  }

  return window.setTimeout(() => callback(Date.now()), 16);
}

function cancelViewportFrame(frameId: number): void {
  if (typeof window.cancelAnimationFrame === "function") {
    window.cancelAnimationFrame(frameId);
    return;
  }

  window.clearTimeout(frameId);
}

function getColumnCount(width: number): number {
  if (width <= CATALOG_SINGLE_COLUMN_MAX_WIDTH) {
    return 1;
  }

  return width <= CATALOG_TWO_COLUMN_MAX_WIDTH ? 2 : 3;
}

export function useVirtualizedCatalogRows(itemCount: number): VirtualizedCatalogRowsResult {
  const listRef = useRef<HTMLUListElement>(null);
  const [measureElement, setMeasureElement] = useState<HTMLLIElement | null>(null);
  const [viewport, setViewport] = useState(initialViewport);
  const [rowMetrics, setRowMetrics] = useState<RowMetrics>({
    gap: 14,
    height: CATALOG_ESTIMATED_ROW_HEIGHT,
  });

  const measureRef = useCallback((element: HTMLLIElement | null) => {
    setMeasureElement(element);
  }, []);
  const listElementRef = useCallback((element: HTMLUListElement | null) => {
    listRef.current = element;
  }, []);

  useEffect(() => {
    let frameId = 0;

    function updateViewport(): void {
      if (frameId) {
        return;
      }

      frameId = requestViewportFrame(() => {
        frameId = 0;
        const height = window.innerHeight;
        const scrollY = window.scrollY;
        const width = window.innerWidth;
        const list = listRef.current;
        const listTop = list ? list.getBoundingClientRect().top + scrollY : scrollY;
        const rowPitch = rowMetrics.height + rowMetrics.gap;
        const visibleRow = Math.max(0, Math.floor((scrollY - listTop) / rowPitch));

        setViewport((current) => {
          const currentVisibleRow = Math.max(
            0,
            Math.floor((current.scrollY - current.listTop) / rowPitch),
          );

          if (
            current.height === height &&
            current.width === width &&
            current.listTop === listTop &&
            currentVisibleRow === visibleRow
          ) {
            return current;
          }

          return { height, listTop, scrollY, width };
        });
      });
    }

    updateViewport();
    window.addEventListener("scroll", updateViewport, { passive: true });
    window.addEventListener("resize", updateViewport, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
      cancelViewportFrame(frameId);
    };
  }, [itemCount, rowMetrics]);

  useEffect(() => {
    const list = listRef.current;
    const element = measureElement;

    if (!list || !element) {
      return;
    }

    const observedList: HTMLUListElement = list;
    const observedElement: HTMLLIElement = element;

    function updateRowMetrics(): void {
      const height = observedElement.getBoundingClientRect().height;
      const gap = Number.parseFloat(window.getComputedStyle(observedList).rowGap);

      if (height > 0) {
        const nextGap = Number.isFinite(gap) ? gap : 0;

        setRowMetrics((current) => {
          if (current.height === height && current.gap === nextGap) {
            return current;
          }

          return { gap: nextGap, height };
        });
      }
    }

    const observer = new ResizeObserver(updateRowMetrics);
    observer.observe(observedElement);
    observer.observe(observedList);
    updateRowMetrics();

    return () => observer.disconnect();
  }, [measureElement]);

  return useMemo(() => {
    const columnCount = getColumnCount(viewport.width);
    const totalRows = Math.ceil(itemCount / columnCount);
    const rowPitch = rowMetrics.height + rowMetrics.gap;
    const firstVisibleRow = Math.max(
      0,
      Math.floor((viewport.scrollY - viewport.listTop) / rowPitch),
    );
    const lastRow = Math.max(0, totalRows - 1);
    const startRow = Math.min(
      lastRow,
      Math.max(0, firstVisibleRow - CATALOG_VIRTUALIZATION_OVERSCAN_ROWS),
    );
    const visibleRowCount =
      Math.ceil(viewport.height / rowPitch) + 1 + CATALOG_VIRTUALIZATION_OVERSCAN_ROWS * 2;
    const endRow = Math.min(totalRows, startRow + visibleRowCount);
    const visibleRows = new Set<number>();

    for (let rowIndex = startRow; rowIndex < endRow; rowIndex += 1) {
      visibleRows.add(rowIndex);
    }

    const rowIndexes = [...visibleRows].sort((first, second) => first - second);
    const rows = rowIndexes.map((index, rowPosition) => {
      const previousRowIndex = rowIndexes[rowPosition - 1];
      const missingRows = previousRowIndex === undefined ? 0 : index - previousRowIndex - 1;
      const spacerBefore =
        missingRows > 0
          ? missingRows * rowMetrics.height + Math.max(0, missingRows - 1) * rowMetrics.gap
          : 0;

      return {
        endIndex: Math.min(itemCount, (index + 1) * columnCount),
        index,
        spacerBefore,
        startIndex: index * columnCount,
      };
    });
    const firstRenderedRow = rowIndexes[0] ?? 0;
    const lastRenderedRow = rowIndexes.at(-1) ?? -1;

    return {
      columnCount,
      listElementRef,
      measureRef,
      paddingBottom: Math.max(0, totalRows - lastRenderedRow - 1) * rowPitch,
      paddingTop: firstRenderedRow * rowPitch,
      rows,
    };
  }, [itemCount, listElementRef, measureRef, rowMetrics, viewport]);
}
