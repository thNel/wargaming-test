import { forwardRef, useCallback, useState } from "react";
import classNames from "classnames";

import { Skeleton } from "@/shared/components/Skeleton/Skeleton";

import type { ImageLoadState, ImageProps } from "./Image.types";
import styles from "./Image.module.css";

const imageWithRef = forwardRef<HTMLImageElement, ImageProps>(
  (
    { alt, className, fit = "cover", h, isLoading, onError, onLoad, src, w, ...imageProps },
    ref,
  ) => {
    const [loadState, setLoadState] = useState<ImageLoadState>({ source: src, status: "loading" });
    const hasError = !src || (loadState.source === src && loadState.status === "error");
    const showSkeleton =
      isLoading ?? (!hasError && (loadState.source !== src || loadState.status !== "loaded"));
    const wrapperClassName = classNames(styles.image, className);
    const wrapperStyle = { width: w, height: h };
    const handleError = useCallback<NonNullable<ImageProps["onError"]>>(
      (event) => {
        onError?.(event);
        setLoadState({ source: src, status: "error" });
      },
      [onError, src],
    );
    const handleLoad = useCallback<NonNullable<ImageProps["onLoad"]>>(
      (event) => {
        setLoadState({ source: src, status: "loaded" });
        onLoad?.(event);
      },
      [onLoad, src],
    );

    if (loadState.source !== src) {
      setLoadState({ source: src, status: "loading" });
    }

    if (hasError && !showSkeleton) {
      const isDecorative = !alt;

      return (
        <div
          aria-hidden={isDecorative || undefined}
          aria-label={isDecorative ? undefined : alt}
          className={classNames(wrapperClassName, styles.fallback)}
          role={isDecorative ? undefined : "img"}
          style={wrapperStyle}
        >
          <span aria-hidden="true" className={styles.fallbackIcon} />
        </div>
      );
    }

    return (
      <div aria-busy={showSkeleton || undefined} className={wrapperClassName} style={wrapperStyle}>
        <img
          {...imageProps}
          ref={ref}
          alt={alt ?? ""}
          className={styles.imageContent}
          data-fit={fit}
          onError={handleError}
          onLoad={handleLoad}
          src={src || undefined}
        />
        {showSkeleton && <Skeleton className={styles.skeleton} h="100%" />}
      </div>
    );
  },
);

imageWithRef.displayName = "Image";

export { imageWithRef as Image };
