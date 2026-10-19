import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { GlassSurface } from "@/shared/components/GlassSurface/GlassSurface";

import type { TooltipProps } from "./Tooltip.types";
import styles from "./Tooltip.module.css";

export function Tooltip({
  accessibleName,
  children,
  focusable = true,
  focusWithinParent = false,
  tooltip,
}: TooltipProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const isOpen = Boolean(tooltip) && !isDismissed && (isHovered || isFocused);
  function handleBlur(): void {
    setIsFocused(false);
    setIsDismissed(false);
  }

  function handleFocus(event: ReactFocusEvent<HTMLDivElement>): void {
    setIsDismissed(false);
    setIsFocused(event.currentTarget.matches(":focus-visible"));
  }

  function handlePointerEnter(event: ReactPointerEvent<HTMLDivElement>): void {
    if (event.pointerType !== "touch") {
      setIsDismissed(false);
      setIsHovered(true);
    }
  }

  function handlePointerLeave(event: ReactPointerEvent<HTMLDivElement>): void {
    if (event.pointerType !== "touch") {
      setIsDismissed(false);
      setIsHovered(false);
    }
  }
  useEffect(() => {
    if (!focusWithinParent) {
      return;
    }

    const parent = scopeRef.current?.parentElement;

    if (!parent) {
      return;
    }

    const handleFocusIn = (event: FocusEvent) => {
      setIsDismissed(false);
      setIsFocused(event.target instanceof HTMLElement && event.target.matches(":focus-visible"));
    };
    const handleFocusOut = (event: FocusEvent) => {
      if (!parent.contains(event.relatedTarget as Node | null)) {
        setIsFocused(false);
        setIsDismissed(false);
      }
    };

    parent.addEventListener("focusin", handleFocusIn);
    parent.addEventListener("focusout", handleFocusOut);

    return () => {
      parent.removeEventListener("focusin", handleFocusIn);
      parent.removeEventListener("focusout", handleFocusOut);
    };
  }, [focusWithinParent]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const eventTarget = focusWithinParent ? scopeRef.current?.parentElement : scopeRef.current;

    if (!eventTarget) {
      return;
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key !== "Escape") {
        return;
      }

      setIsHovered(false);
      setIsFocused(false);
      setIsDismissed(true);
    }

    eventTarget.addEventListener("keydown", handleEscape);

    return () => eventTarget.removeEventListener("keydown", handleEscape);
  }, [focusWithinParent, isOpen]);

  useLayoutEffect(() => {
    const tooltipElement = tooltipRef.current;

    if (!tooltipElement) {
      return;
    }

    if (isOpen && !tooltipElement.matches(":popover-open")) {
      tooltipElement.showPopover();
    } else if (!isOpen && tooltipElement.matches(":popover-open")) {
      tooltipElement.hidePopover();
    }
  }, [isOpen]);

  return (
    <div ref={scopeRef} className={styles.scope}>
      <div
        aria-describedby={isOpen ? tooltipId : undefined}
        aria-label={accessibleName}
        className={styles.anchor}
        data-tooltip={tooltip}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        role={accessibleName ? "img" : undefined}
        tabIndex={accessibleName && focusable ? 0 : undefined}
      >
        {children}
      </div>
      <GlassSurface
        as="span"
        ref={tooltipRef}
        className={styles.tooltip}
        id={tooltipId}
        mode="dark"
        popover="manual"
        role="tooltip"
      >
        {tooltip}
      </GlassSurface>
    </div>
  );
}
