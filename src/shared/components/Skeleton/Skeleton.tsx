import classNames from "classnames";

import type { SkeletonProps } from "./Skeleton.types";
import styles from "./Skeleton.module.css";

export function Skeleton({ className, w, h }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={classNames(styles.skeleton, className)}
      style={{ width: w, height: h }}
    />
  );
}
