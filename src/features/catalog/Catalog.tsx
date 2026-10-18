import { Skeleton } from "@/shared/components/Skeleton/Skeleton";

import { PLACEHOLDER_CARD_IDS } from "./catalog.constants";
import styles from "./Catalog.module.css";

export function Catalog() {
  return (
    <div className={styles.root}>
      <div className={styles.toolbar} aria-hidden="true">
        <Skeleton w="min(100%, 320px)" h="var(--toolbar-field-height)" />
        <Skeleton
          className={styles.sortField}
          w="var(--sort-field-width)"
          h="var(--toolbar-field-height)"
        />
      </div>

      <div className={styles.grid} aria-hidden="true">
        {PLACEHOLDER_CARD_IDS.map((cardId) => (
          <div className={styles.card} key={cardId}>
            <Skeleton className={styles.cardArt} h="var(--card-art-height)" />
            <div className={styles.cardCopy}>
              <Skeleton w="64%" h={8} />
              <Skeleton w="38%" h={6} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
