import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { Skeleton } from "@/shared/components/Skeleton/Skeleton";

import { CATALOG_SKELETON_COUNT } from "../catalog.constants";
import { useVirtualizedCatalogRows } from "../hooks/useVirtualizedCatalogRows";
import { VehicleCard } from "./VehicleCard";
import type { CatalogContentProps } from "./CatalogContent.types";
import styles from "./CatalogContent.module.css";

export function CatalogContent({
  locale,
  onRetry,
  onVehicleSelect,
  status,
  vehicles,
}: CatalogContentProps) {
  const { t } = useTranslation("catalog");
  const { columnCount, listElementRef, measureRef, paddingBottom, paddingTop, rows } =
    useVirtualizedCatalogRows(vehicles.length);

  if (status === "idle" || status === "loading") {
    return (
      <div aria-hidden="true" className={styles.skeletonGrid}>
        {Array.from({ length: CATALOG_SKELETON_COUNT }, (_, index) => (
          <div className={styles.skeletonCard} key={index}>
            <Skeleton className={styles.skeletonArt} h="100%" />
            <div className={styles.skeletonCopy}>
              <Skeleton w="64%" h={8} />
              <Skeleton w="38%" h={6} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className={styles.message} role="alert">
        <p>{t("catalogLoadError")}</p>
        <button className={styles.retryButton} onClick={onRetry} type="button">
          {t("retry")}
        </button>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <p className={styles.message} role="status">
        {t("catalogEmpty")}
      </p>
    );
  }

  return (
    <ul
      aria-label={t("vehicleListLabel")}
      className={styles.grid}
      ref={listElementRef}
      style={{
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        paddingBlockEnd: paddingBottom,
        paddingBlockStart: paddingTop,
      }}
    >
      {rows.map(({ endIndex, index, spacerBefore, startIndex }) => (
        <Fragment key={index}>
          {spacerBefore > 0 && (
            <li
              aria-hidden="true"
              className={styles.virtualSpacer}
              style={{ height: spacerBefore }}
            />
          )}
          {vehicles.slice(startIndex, endIndex).map((vehicle, columnIndex) => (
            <VehicleCard
              key={vehicle.id}
              locale={locale}
              measureRef={startIndex + columnIndex === rows[0]?.startIndex ? measureRef : undefined}
              onSelect={onVehicleSelect}
              vehicle={vehicle}
            />
          ))}
        </Fragment>
      ))}
    </ul>
  );
}
