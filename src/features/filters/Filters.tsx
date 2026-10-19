import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { GlassSurface } from "@/shared/components/GlassSurface/GlassSurface";
import type { AppDispatch } from "@/store";
import {
  resetCatalogFilters,
  selectHasActiveCatalogFilters,
  setCatalogSearchTerm,
} from "@/store/filters/filtersSlice";

import { NationFilterGroup } from "./components/NationFilterGroup";
import { SearchFilter } from "./components/SearchFilter";
import { TierFilterGroup } from "./components/TierFilterGroup";
import { VehicleTypeFilterGroup } from "./components/VehicleTypeFilterGroup";
import styles from "./Filters.module.css";

export function Filters() {
  const { i18n, t } = useTranslation("filters");
  const dispatch = useDispatch<AppDispatch>();
  const [hasPendingSearch, setHasPendingSearch] = useState(false);
  const [searchResetVersion, setSearchResetVersion] = useState(0);
  const hasActiveFilters = useSelector(selectHasActiveCatalogFilters);
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const previousLocale = useRef(locale);

  useEffect(() => {
    if (previousLocale.current === locale) {
      return;
    }

    previousLocale.current = locale;
    dispatch(setCatalogSearchTerm(""));
    setHasPendingSearch(false);
    setSearchResetVersion((currentVersion) => currentVersion + 1);
  }, [dispatch, locale]);

  function handleReset(): void {
    dispatch(resetCatalogFilters());
    setHasPendingSearch(false);
    setSearchResetVersion((currentVersion) => currentVersion + 1);
  }

  return (
    <GlassSurface as="aside" aria-labelledby="filters-heading" className={styles.root} mode="light">
      <div className={styles.header}>
        <h2 className={styles.title} id="filters-heading">
          {t("title")}
        </h2>
        <button
          className={styles.resetButton}
          disabled={!hasActiveFilters && !hasPendingSearch}
          onClick={handleReset}
          type="button"
        >
          {t("reset")}
        </button>
      </div>

      <SearchFilter onPendingChange={setHasPendingSearch} resetVersion={searchResetVersion} />

      <div className={styles.filterGroups}>
        <VehicleTypeFilterGroup />
        <NationFilterGroup />
        <TierFilterGroup />
      </div>
    </GlassSurface>
  );
}
