import { useReducer } from "react";
import { useTranslation } from "react-i18next";

import { findSupportedLocale } from "@/shared/i18n/locale.utils";
import { GlassSurface } from "@/shared/components/GlassSurface/GlassSurface";

import { CatalogContent } from "./components/CatalogContent";
import { catalogSortReducer, INITIAL_CATALOG_SORT_STATE } from "./catalogSortReducer";
import { useCatalogVehicles } from "./hooks/useCatalogVehicles";
import { CatalogToolbar } from "./components/CatalogToolbar";
import styles from "./Catalog.module.css";

export function Catalog() {
  const { i18n } = useTranslation("catalog");
  const locale = findSupportedLocale(i18n.resolvedLanguage ?? i18n.language) ?? "en";
  const [sortState, dispatchSortChange] = useReducer(
    catalogSortReducer,
    INITIAL_CATALOG_SORT_STATE,
  );
  const { retry, status, count, vehicles } = useCatalogVehicles(
    locale,
    sortState.mode,
    sortState.direction,
  );
  const isBusy = status === "idle" || status === "loading";

  return (
    <GlassSurface aria-busy={isBusy || undefined} className={styles.root} mode="light">
      <CatalogToolbar
        count={status === "succeeded" ? count : null}
        onSortChange={dispatchSortChange}
        sortDirection={sortState.direction}
        sortMode={sortState.mode}
      />

      <CatalogContent locale={locale} onRetry={retry} status={status} vehicles={vehicles} />
    </GlassSurface>
  );
}
