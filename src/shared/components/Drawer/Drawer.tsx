import {
  useCallback,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type MouseEvent,
} from "react";
import classNames from "classnames";

import type { DrawerProps } from "./Drawer.types";
import styles from "./Drawer.module.css";

export function Drawer({
  children,
  className,
  closeLabel,
  onClose,
  open,
  placement = "right",
  title,
  ...dialogProps
}: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const handleCancel = useCallback<NonNullable<ComponentPropsWithoutRef<"dialog">["onCancel"]>>(
    (event) => {
      event.preventDefault();
      onClose();
    },
    [onClose],
  );
  const handleBackdropClick = useCallback(
    (event: MouseEvent<HTMLDialogElement>) => {
      if (event.target !== event.currentTarget) {
        return;
      }

      const { bottom, left, right, top } = event.currentTarget.getBoundingClientRect();
      const isOutside =
        event.clientX < left ||
        event.clientX > right ||
        event.clientY < top ||
        event.clientY > bottom;

      if (isOutside) {
        onClose();
      }
    },
    [onClose],
  );

  useLayoutEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // The native dialog's backdrop click is the equivalent of a dismiss control; Escape remains available through onCancel.
  return (
    <dialog
      {...dialogProps}
      ref={dialogRef}
      aria-label={title}
      className={classNames(styles.drawer, className)}
      data-placement={placement}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <header className={styles.header}>
        <div className={styles.title}>{title}</div>
        <button
          aria-label={closeLabel}
          className={styles.closeButton}
          onClick={onClose}
          type="button"
        >
          <span aria-hidden="true">×</span>
        </button>
      </header>
      <div className={styles.content}>{children}</div>
    </dialog>
  );
}
