import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch } from "@/store";
import { resetCatalogFilters, selectHasActiveCatalogFilters } from "@/store/filters/filtersSlice";

import { NationFilterGroup } from "./components/NationFilterGroup";
import { SearchFilter } from "./components/SearchFilter";
import { TierFilterGroup } from "./components/TierFilterGroup";
import { VehicleTypeFilterGroup } from "./components/VehicleTypeFilterGroup";
import { VisibilityFilterGroup } from "./components/VisibilityFilterGroup";
import styles from "./Filters.module.css";

export function Filters() {
  const { t } = useTranslation("filters");
  const dispatch = useDispatch<AppDispatch>();
  const hasActiveFilters = useSelector(selectHasActiveCatalogFilters);
  const handleReset = useCallback(() => {
    dispatch(resetCatalogFilters());
  }, [dispatch]);

  return (
    <aside aria-labelledby="filters-heading" className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title} id="filters-heading">
          {t("title")}
        </h2>
        <button
          className={styles.resetButton}
          disabled={!hasActiveFilters}
          onClick={handleReset}
          type="button"
        >
          {t("reset")}
        </button>
      </div>

      <SearchFilter />

      <div className={styles.filterGroups}>
        <VehicleTypeFilterGroup />
        <NationFilterGroup />
        <TierFilterGroup />
      </div>

      <VisibilityFilterGroup />
    </aside>
  );
}
