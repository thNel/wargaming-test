import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { GlassSurface } from "@/shared/components/GlassSurface/GlassSurface";
import type { AppDispatch } from "@/store";
import { resetCatalogFilters, selectHasActiveCatalogFilters } from "@/store/filters/filtersSlice";

import { NationFilterGroup } from "./components/NationFilterGroup";
import { SearchFilter } from "./components/SearchFilter";
import { TierFilterGroup } from "./components/TierFilterGroup";
import { VehicleTypeFilterGroup } from "./components/VehicleTypeFilterGroup";
import styles from "./Filters.module.css";

export function Filters() {
  const { t } = useTranslation("filters");
  const dispatch = useDispatch<AppDispatch>();
  const hasActiveFilters = useSelector(selectHasActiveCatalogFilters);
  function handleReset(): void {
    dispatch(resetCatalogFilters());
  }

  return (
    <GlassSurface as="aside" aria-labelledby="filters-heading" className={styles.root} mode="light">
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
    </GlassSurface>
  );
}
