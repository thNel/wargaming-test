import type { ComponentPropsWithRef } from "react";

export type CheckboxSize = "sm" | "md";

export type CheckboxProps = Omit<
  ComponentPropsWithRef<"input">,
  "className" | "size" | "style" | "type"
> & {
  size?: CheckboxSize;
};
