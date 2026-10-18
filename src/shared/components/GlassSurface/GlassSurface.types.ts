import type { ComponentPropsWithRef, ElementType } from "react";

export type GlassSurfaceMode = "dark" | "light";

export type GlassSurfaceProps<T extends ElementType = "div"> = {
  as?: T;
  mode: GlassSurfaceMode;
} & Omit<ComponentPropsWithRef<T>, "as">;
