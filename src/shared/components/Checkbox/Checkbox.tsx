import type { CheckboxProps } from "./Checkbox.types";
import styles from "./Checkbox.module.css";

export function Checkbox({ size = "md", ...inputProps }: CheckboxProps) {
  return <input {...inputProps} className={styles.checkbox} data-size={size} type="checkbox" />;
}
