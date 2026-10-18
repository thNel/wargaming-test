import type { FilterGroupStatusProps } from "./FilterGroupStatus.types";
import styles from "./FilterGroupStatus.module.css";

export function FilterGroupStatus({
  isLoading,
  hasError,
  loadingLabel,
  errorLabel,
  retryLabel,
  onRetry,
}: FilterGroupStatusProps) {
  if (hasError) {
    return (
      <div className={styles.root}>
        <p className={styles.message} role="alert">
          {errorLabel}
        </p>
        <button className={styles.retry} disabled={isLoading} onClick={onRetry} type="button">
          {retryLabel}
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <p className={styles.root} role="status">
        {loadingLabel}
      </p>
    );
  }

  return null;
}
