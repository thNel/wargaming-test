import type { ReactNode } from "react";

export interface TooltipProps {
  accessibleName?: string;
  children: ReactNode;
  focusable?: boolean;
  focusWithinParent?: boolean;
  tooltip: string;
}
