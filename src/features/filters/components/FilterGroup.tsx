import type { FilterGroupProps } from "./FilterGroup.types";
import styles from "./FilterGroup.module.css";

export function FilterGroup({ ariaBusy, children, title }: FilterGroupProps) {
  return (
    <fieldset aria-busy={ariaBusy} className={styles.root}>
      <legend className={styles.title}>{title}</legend>
      {children}
    </fieldset>
  );
}
