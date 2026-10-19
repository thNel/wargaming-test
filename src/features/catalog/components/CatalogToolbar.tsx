import { useTranslation } from "react-i18next";

import { GlassSurface } from "@/shared/components/GlassSurface/GlassSurface";

import { CatalogSortControl } from "./CatalogSortControl";
import type { CatalogToolbarProps } from "./CatalogToolbar.types";
import styles from "./CatalogToolbar.module.css";

export function CatalogToolbar({
  count,
  onSortChange,
  sortDirection,
  sortMode,
}: CatalogToolbarProps) {
  const { t } = useTranslation("catalog");

  return (
    <GlassSurface as="div" className={styles.root} mode="light">
      {count !== null && (
        <p aria-live="polite" className={styles.count}>
          {t("catalogCount", { count })}
        </p>
      )}

      <CatalogSortControl
        onSortChange={onSortChange}
        sortDirection={sortDirection}
        sortMode={sortMode}
      />
    </GlassSurface>
  );
}
