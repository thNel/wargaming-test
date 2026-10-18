import { useEffect, useRef, type MouseEvent } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import { GlassSurface } from "@/shared/components/GlassSurface/GlassSurface";
import { CATALOG_SORT_OPTIONS } from "../catalog.constants";
import type { CatalogSortMode } from "../catalog.types";
import type { CatalogToolbarProps } from "./CatalogToolbar.types";
import styles from "./CatalogToolbar.module.css";

export function CatalogToolbar({
  count,
  onSortChange,
  sortDirection,
  sortMode,
}: CatalogToolbarProps) {
  const { t } = useTranslation("catalog");
  const rootRef = useRef<HTMLDetailsElement>(null);
  const selectedOption =
    CATALOG_SORT_OPTIONS.find((option) => option.mode === sortMode) ?? CATALOG_SORT_OPTIONS[0];

  function handleOptionClick(event: MouseEvent<HTMLButtonElement>): void {
    const mode: CatalogSortMode | undefined = CATALOG_SORT_OPTIONS.find(
      (option) => option.mode === event.currentTarget.dataset.sortMode,
    )?.mode;
    if (!mode) {
      return;
    }

    onSortChange(mode);
    if (rootRef.current) {
      rootRef.current.open = false;
    }
    rootRef.current?.querySelector("summary")?.focus();
  }

  useEffect(() => {
    function handleOutsidePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node) && rootRef.current) {
        rootRef.current.open = false;
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && rootRef.current?.open) {
        rootRef.current.open = false;
        rootRef.current.querySelector("summary")?.focus();
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <GlassSurface as="div" className={styles.root} mode="light">
      {count !== null && (
        <p aria-live="polite" className={styles.count}>
          {t("catalogCount", { count })}
        </p>
      )}

      <div className={styles.sortControl}>
        <span className={styles.sortLabel}>{t("sortLabel")}:</span>
        <details className={styles.sortMenu} ref={rootRef}>
          <summary
            aria-label={
              sortMode === "default"
                ? `${t("sortBy")}: ${t(selectedOption.labelKey)}`
                : `${t("sortBy")}: ${t(selectedOption.labelKey)}, ${t(
                    sortDirection === "ascending" ? "sortAscending" : "sortDescending",
                  )}`
            }
            className={styles.trigger}
          >
            <span>{t(selectedOption.labelKey)}</span>
            {sortMode !== "default" && (
              <span
                aria-hidden="true"
                className={classNames(
                  styles.directionIcon,
                  sortDirection === "ascending" ? styles.ascending : styles.descending,
                )}
              />
            )}
          </summary>

          <GlassSurface
            aria-label={t("sortBy")}
            className={styles.options}
            mode="light"
            role="group"
          >
            {CATALOG_SORT_OPTIONS.map((option) => (
              <button
                aria-label={
                  sortMode === option.mode && sortMode !== "default"
                    ? `${t(option.labelKey)}, ${t(
                        sortDirection === "ascending" ? "sortAscending" : "sortDescending",
                      )}`
                    : undefined
                }
                aria-pressed={sortMode === option.mode}
                className={styles.option}
                data-sort-mode={option.mode}
                key={option.mode}
                onClick={handleOptionClick}
                type="button"
              >
                <span>{t(option.labelKey)}</span>
                {sortMode === option.mode && sortMode !== "default" && (
                  <span
                    aria-hidden="true"
                    className={classNames(
                      styles.directionIcon,
                      sortDirection === "ascending" ? styles.ascending : styles.descending,
                    )}
                  />
                )}
              </button>
            ))}
          </GlassSurface>
        </details>
      </div>
    </GlassSurface>
  );
}
