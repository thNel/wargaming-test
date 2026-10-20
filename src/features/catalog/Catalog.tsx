import { useReducer, useState } from "react";
import { useTranslation } from "react-i18next";

import { findSupportedLocale } from "@/shared/i18n/locale.utils";
import { GlassSurface } from "@/shared/components/GlassSurface/GlassSurface";

import { CatalogContent } from "./components/CatalogContent";
import { catalogSortReducer, INITIAL_CATALOG_SORT_STATE } from "./catalogSortReducer";
import { useCatalogVehicles } from "./hooks/useCatalogVehicles";
import { CatalogToolbar } from "./components/CatalogToolbar";
import { VehicleDetailsDrawer } from "./components/VehicleDetailsDrawer";
import styles from "./Catalog.module.css";
import type { CatalogVehicle } from "@/store/catalog/catalog.types";

export function Catalog() {
  const [selectedVehicle, setSelectedVehicle] = useState<CatalogVehicle | null>(null);
  const [sortState, dispatchSortChange] = useReducer(
    catalogSortReducer,
    INITIAL_CATALOG_SORT_STATE,
  );

  const { i18n } = useTranslation("catalog");
  const locale = findSupportedLocale(i18n.resolvedLanguage ?? i18n.language) ?? "en";

  const { retry, status, count, vehicles } = useCatalogVehicles(
    locale,
    sortState.mode,
    sortState.direction,
  );
  const isBusy = status === "idle" || status === "loading";

  function handleCloseDetails(): void {
    setSelectedVehicle(null);
  }

  return (
    <GlassSurface aria-busy={isBusy || undefined} className={styles.root} mode="light">
      <CatalogToolbar
        count={status === "succeeded" ? count : null}
        onSortChange={dispatchSortChange}
        sortDirection={sortState.direction}
        sortMode={sortState.mode}
      />

      <CatalogContent
        locale={locale}
        onRetry={retry}
        onVehicleSelect={setSelectedVehicle}
        status={status}
        vehicles={vehicles}
      />
      <VehicleDetailsDrawer
        locale={locale}
        onClose={handleCloseDetails}
        vehicle={selectedVehicle}
      />
    </GlassSurface>
  );
}
