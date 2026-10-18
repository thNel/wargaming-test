import type { MouseEventHandler } from "react";

export type LanguageButtonProps = {
  expanded: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};
