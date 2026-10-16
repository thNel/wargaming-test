import type { ComponentPropsWithoutRef, ReactNode } from "react";

type NativeDialogProps = Omit<
  ComponentPropsWithoutRef<"dialog">,
  "aria-label" | "aria-labelledby" | "children" | "className" | "onCancel" | "onClose" | "open"
>;

export type DrawerProps = NativeDialogProps & {
  children: ReactNode;
  className?: string;
  closeLabel: string;
  onClose: () => void;
  open: boolean;
  placement?: "left" | "right";
  title: string;
};
