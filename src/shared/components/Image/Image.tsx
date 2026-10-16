import { forwardRef, useCallback, useState } from "react";
import classNames from "classnames";

import { Skeleton } from "@/shared/components/Skeleton/Skeleton";

import type { ImageProps } from "./Image.types";
import styles from "./Image.module.css";

const imageWithRef = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      alt,
      className,
      fit = "cover",
      h,
      isLoading,
      loading,
      onError,
      onLoad,
      src,
      w,
      ...imageProps
    },
    ref,
  ) => {
    const [failedSource, setFailedSource] = useState<string>();
    const [loadedSource, setLoadedSource] = useState<string>();
    const hasError = !src || failedSource === src;
    const showSkeleton = isLoading ?? (!hasError && loadedSource !== src);
    const wrapperClassName = classNames(styles.image, className);
    const wrapperStyle = { width: w, height: h };
    const handleError = useCallback<NonNullable<ImageProps["onError"]>>(
      (event) => {
        onError?.(event);
        setFailedSource(src);
      },
      [onError, src],
    );
    const handleLoad = useCallback<NonNullable<ImageProps["onLoad"]>>(
      (event) => {
        setLoadedSource(src);
        onLoad?.(event);
      },
      [onLoad, src],
    );

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
          loading={loading}
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
