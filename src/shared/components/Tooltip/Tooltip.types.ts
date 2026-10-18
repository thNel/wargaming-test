import type { ReactNode } from "react";

export interface TooltipProps {
  accessibleName?: string;
  children: ReactNode;
  focusWithinParent?: boolean;
  tooltip: string;
}
