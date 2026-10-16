import { Skeleton } from "@/shared/components/Skeleton/Skeleton";

import styles from "./Filters.module.css";

export function Filters() {
  return (
    <aside className={styles.root}>
      <Skeleton h="var(--field-wide-height)" />
      <Skeleton h="var(--field-height)" />
      <Skeleton h="var(--field-height)" />
      <Skeleton h="var(--field-height)" w="var(--short-field-width)" />
      <Skeleton h="var(--field-height)" />
    </aside>
  );
}
