import type { ComponentPropsWithoutRef, CSSProperties } from "react";

type NativeImageProps = Omit<
  ComponentPropsWithoutRef<"img">,
  "alt" | "className" | "height" | "onError" | "onLoad" | "src" | "style" | "width"
>;

export type ImageFit = "contain" | "cover" | "fill" | "none" | "scale-down";

export type ImageLoadState = {
  source: string | undefined;
  status: "loading" | "loaded" | "error";
};

export type ImageProps = NativeImageProps & {
  alt?: string;
  className?: string;
  fit?: ImageFit;
  h?: CSSProperties["height"];
  isLoading?: boolean;
  onError?: ComponentPropsWithoutRef<"img">["onError"];
  onLoad?: ComponentPropsWithoutRef<"img">["onLoad"];
  src?: string;
  w?: CSSProperties["width"];
};
