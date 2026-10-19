import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import type { GlassSurfaceMode } from "@/shared/components/GlassSurface/GlassSurface.types";

export interface SelectorOption<Value extends string> {
  value: Value;
  label: ReactNode;
}

export interface SelectorProps<Value extends string> {
  children: ReactElement<HTMLAttributes<HTMLElement>>;
  className?: string;
  optionsMode?: GlassSurfaceMode;
  onSelect: (value: Value) => void;
  options: readonly SelectorOption<Value>[];
  optionsAriaLabel: string;
  selectedValue: Value;
}

export interface SelectorOptionButtonProps<Value extends string> {
  onSelect: (value: Value) => void;
  option: SelectorOption<Value>;
  selected: boolean;
}
