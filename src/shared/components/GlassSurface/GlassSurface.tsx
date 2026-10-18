import { createElement, type ElementType } from "react";
import classNames from "classnames";

import type { GlassSurfaceProps } from "./GlassSurface.types";
import styles from "./GlassSurface.module.css";

export function GlassSurface<T extends ElementType = "div">({
  as,
  className,
  mode,
  ...props
}: GlassSurfaceProps<T>) {
  const element: ElementType = as ?? "div";
  const modeClassName = mode === "dark" ? styles.dark : styles.light;

  return createElement(element, {
    ...props,
    className: classNames(styles.surface, modeClassName, className),
  });
}
