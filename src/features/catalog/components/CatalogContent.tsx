import { useTranslation } from "react-i18next";

import { Skeleton } from "@/shared/components/Skeleton/Skeleton";

import { CATALOG_SKELETON_COUNT } from "../catalog.constants";
import { VehicleCard } from "./VehicleCard";
import type { CatalogContentProps } from "./CatalogContent.types";
import styles from "./CatalogContent.module.css";

export function CatalogContent({ locale, onRetry, status, vehicles }: CatalogContentProps) {
  const { t } = useTranslation("catalog");

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
    <ul aria-label={t("vehicleListLabel")} className={styles.grid}>
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} locale={locale} vehicle={vehicle} />
      ))}
    </ul>
  );
}
