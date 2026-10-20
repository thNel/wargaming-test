import { forwardRef, useState } from "react";
import cn from "classnames";

import { Skeleton } from "@/shared/components/Skeleton/Skeleton";

import type { ImageLoadState, ImageProps } from "./Image.types";
import styles from "./Image.module.css";

const imageWithRef = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      alt,
      className,
      fit = "cover",
      h,
      isLoading,
      onError,
      onLoad,
      sources,
      src,
      w,
      ...imageProps
    },
    ref,
  ) => {
    const [loadState, setLoadState] = useState<ImageLoadState>({ source: src, status: "loading" });
    const hasError = !src || (loadState.source === src && loadState.status === "error");
    const showSkeleton =
      isLoading ?? (!hasError && (loadState.source !== src || loadState.status !== "loaded"));
    const wrapperClassName = cn(styles.image, className);
    const wrapperStyle = { width: w, height: h };
    function handleError(event: Parameters<NonNullable<ImageProps["onError"]>>[0]): void {
      onError?.(event);
      setLoadState({ source: src, status: "error" });
    }

    function handleLoad(event: Parameters<NonNullable<ImageProps["onLoad"]>>[0]): void {
      setLoadState({ source: src, status: "loaded" });
      onLoad?.(event);
    }

    if (loadState.source !== src) {
      setLoadState({ source: src, status: "loading" });
    }

    if (hasError && !showSkeleton) {
      const isDecorative = !alt;

      return (
        <div
          aria-hidden={isDecorative || undefined}
          aria-label={isDecorative ? undefined : alt}
          className={cn(wrapperClassName, styles.fallback)}
          role={isDecorative ? undefined : "img"}
          style={wrapperStyle}
        >
          <span aria-hidden="true" className={styles.fallbackIcon} />
        </div>
      );
    }

    return (
      <div aria-busy={showSkeleton || undefined} className={wrapperClassName} style={wrapperStyle}>
        <picture className={styles.picture}>
          {sources?.map((source) => (
            <source key={`${source.media ?? ""}-${source.type ?? ""}`} {...source} />
          ))}
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
        </picture>
        {showSkeleton && <Skeleton className={styles.skeleton} h="100%" />}
      </div>
    );
  },
);

imageWithRef.displayName = "Image";

export { imageWithRef as Image };
