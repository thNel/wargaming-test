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
  focusWithinParent = false,
  tooltip,
}: TooltipProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isOpen = Boolean(tooltip) && (isHovered || isFocused);
  function handleBlur(): void {
    setIsFocused(false);
  }

  function handleFocus(event: ReactFocusEvent<HTMLDivElement>): void {
    setIsFocused(event.currentTarget.matches(":focus-visible"));
  }

  function handlePointerEnter(event: ReactPointerEvent<HTMLDivElement>): void {
    if (event.pointerType !== "touch") {
      setIsHovered(true);
    }
  }

  function handlePointerLeave(event: ReactPointerEvent<HTMLDivElement>): void {
    if (event.pointerType !== "touch") {
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
      setIsFocused(event.target instanceof HTMLElement && event.target.matches(":focus-visible"));
    };
    const handleFocusOut = (event: FocusEvent) => {
      if (!parent.contains(event.relatedTarget as Node | null)) {
        setIsFocused(false);
      }
    };

    parent.addEventListener("focusin", handleFocusIn);
    parent.addEventListener("focusout", handleFocusOut);

    return () => {
      parent.removeEventListener("focusin", handleFocusIn);
      parent.removeEventListener("focusout", handleFocusOut);
    };
  }, [focusWithinParent]);

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
        tabIndex={accessibleName ? 0 : undefined}
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
