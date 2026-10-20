import cn from "classnames";
import { useTranslation } from "react-i18next";

import { Selector } from "@/shared/components/Selector/Selector";

import { CATALOG_SORT_OPTIONS } from "../catalog.constants";
import type { CatalogSortControlProps } from "./CatalogSortControl.types";
import styles from "./CatalogSortControl.module.css";

export function CatalogSortControl({
  onSortChange,
  sortDirection,
  sortMode,
}: CatalogSortControlProps) {
  const { t } = useTranslation("catalog");

  const options = CATALOG_SORT_OPTIONS.map(({ labelKey, value }) => ({
    value,
    label: t(labelKey),
  }));

  const selectedOption = options.find((option) => option.value === sortMode) ?? options[0];
  const directionLabel = t(sortDirection);

  return (
    <div className={styles.sortControl}>
      <span className={styles.sortLabel}>{t("sortLabel")}:</span>
      <Selector
        className={styles.selector}
        optionsAriaLabel={t("sortBy")}
        onSelect={onSortChange}
        options={options}
        optionsMode="dark"
        selectedValue={sortMode}
      >
        <summary
          aria-label={
            sortMode === "default"
              ? `${t("sortBy")}: ${selectedOption.label}`
              : `${t("sortBy")}: ${selectedOption.label}, ${directionLabel}`
          }
        >
          <svg aria-hidden="true" className={styles.sortArrows} fill="none" viewBox="0 0 16 16">
            <path
              d="M5 10V3m0 0L2.5 5.5M5 3l2.5 2.5M11 6v7m0 0-2.5-2.5M11 13l2.5-2.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
          <span>{selectedOption.label}</span>
          {sortMode !== "default" && (
            <span aria-hidden="true" className={cn(styles.directionIcon, styles[sortDirection])} />
          )}
        </summary>
      </Selector>
    </div>
  );
}
