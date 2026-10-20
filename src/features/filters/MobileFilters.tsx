import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Drawer } from "@/shared/components/Drawer/Drawer";
import type { AppDispatch } from "@/store";
import {
  applyCatalogFilters,
  createInitialCatalogFilters,
  resetCatalogFilters,
  selectCatalogFilters,
} from "@/store/filters/filtersSlice";
import type {
  CatalogFiltersState,
  NationKey,
  Tier,
  VehicleTypeKey,
} from "@/store/filters/filters.types";

import { NationFilterGroup } from "./components/NationFilterGroup";
import { SearchFilter } from "./components/SearchFilter";
import { TierFilterGroup } from "./components/TierFilterGroup";
import { VehicleTypeFilterGroup } from "./components/VehicleTypeFilterGroup";
import styles from "./MobileFilters.module.css";

function cloneCatalogFilters(filters: CatalogFiltersState): CatalogFiltersState {
  return {
    ...filters,
    nations: { ...filters.nations },
    classes: { ...filters.classes },
    tiers: { ...filters.tiers },
  };
}

function hasAnyCatalogFilters(filters: CatalogFiltersState): boolean {
  return (
    filters.searchTerm.trim() !== "" ||
    Object.values(filters.nations).some(Boolean) ||
    Object.values(filters.classes).some(Boolean) ||
    Object.values(filters.tiers).some(Boolean)
  );
}

export function MobileFilters() {
  const { i18n, t } = useTranslation("filters");
  const { t: tMain } = useTranslation("main");
  const dispatch = useDispatch<AppDispatch>();
  const appliedFilters = useSelector(selectCatalogFilters);
  const [isOpen, setIsOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<CatalogFiltersState>(() =>
    createInitialCatalogFilters(),
  );
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const previousLocale = useRef(locale);

  useEffect(() => {
    if (previousLocale.current === locale) {
      return;
    }

    previousLocale.current = locale;
    setDraftFilters((currentFilters) => ({ ...currentFilters, searchTerm: "" }));
  }, [locale]);

  function openDrawer(): void {
    setDraftFilters(cloneCatalogFilters(appliedFilters));
    setIsOpen(true);
  }

  function resetFilters(): void {
    dispatch(resetCatalogFilters());
    setDraftFilters(createInitialCatalogFilters());
    setIsOpen(false);
  }

  function applyDraftFilters(): void {
    dispatch(applyCatalogFilters(cloneCatalogFilters(draftFilters)));
    setIsOpen(false);
  }

  function closeDrawer(): void {
    setIsOpen(false);
  }

  function updateSearchTerm(searchTerm: string): void {
    setDraftFilters((currentFilters) => ({ ...currentFilters, searchTerm }));
  }

  function toggleNation(key: NationKey): void {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      nations: { ...currentFilters.nations, [key]: !currentFilters.nations[key] },
    }));
  }

  function toggleClass(key: VehicleTypeKey): void {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      classes: { ...currentFilters.classes, [key]: !currentFilters.classes[key] },
    }));
  }

  function toggleTier(key: Tier): void {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      tiers: { ...currentFilters.tiers, [key]: !currentFilters.tiers[key] },
    }));
  }

  return (
    <div className={styles.root}>
      <button
        aria-label={t("title")}
        aria-controls="mobile-catalog-filters"
        aria-expanded={isOpen}
        className={styles.openButton}
        onClick={openDrawer}
        type="button"
      >
        <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
          <path
            d="M3 4h14l-5.2 6v5l-3.6 1.8V10L3 4Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </button>

      {isOpen && (
        <Drawer
          closeLabel={tMain("close")}
          className={styles.drawerWidth}
          id="mobile-catalog-filters"
          onClose={closeDrawer}
          open
          tone="glass"
          footer={
            <div className={styles.footerActions}>
              <button
                className={styles.resetButton}
                disabled={!hasAnyCatalogFilters(draftFilters)}
                onClick={resetFilters}
                type="button"
              >
                {t("reset")}
              </button>
              <button className={styles.applyButton} onClick={applyDraftFilters} type="button">
                {t("apply")}
              </button>
            </div>
          }
          footerClassName={styles.drawerFooter}
          title={t("title")}
        >
          <SearchFilter
            id="mobile-catalog-search"
            onValueChange={updateSearchTerm}
            resetVersion={0}
            value={draftFilters.searchTerm}
          />

          <div className={styles.filterGroups}>
            <VehicleTypeFilterGroup
              idPrefix="mobile-"
              onSelectionChange={toggleClass}
              selectedVehicleTypes={draftFilters.classes}
            />
            <NationFilterGroup
              idPrefix="mobile-"
              onSelectionChange={toggleNation}
              selectedNations={draftFilters.nations}
            />
            <TierFilterGroup
              idPrefix="mobile-"
              onSelectionChange={toggleTier}
              selectedTiers={draftFilters.tiers}
            />
          </div>
        </Drawer>
      )}
    </div>
  );
}
