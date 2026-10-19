import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from "react";
import classNames from "classnames";

import { GlassSurface } from "@/shared/components/GlassSurface/GlassSurface";

import type { SelectorOptionButtonProps, SelectorProps } from "./Selector.types";
import styles from "./Selector.module.css";

export function Selector<Value extends string>({
  children,
  className,
  onSelect,
  options,
  optionsAriaLabel,
  selectedValue,
}: SelectorProps<Value>) {
  const rootRef = useRef<HTMLDetailsElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const closeSelector = useCallback((restoreFocus: boolean) => {
    setIsOpen(false);
    if (rootRef.current) {
      rootRef.current.open = false;
    }
    if (restoreFocus) {
      rootRef.current?.querySelector("summary")?.focus();
    }
  }, []);

  function handleToggle(event: SyntheticEvent<HTMLDetailsElement>): void {
    setIsOpen(event.currentTarget.open);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleOutsidePointerDown(event: PointerEvent): void {
      const root = rootRef.current;
      const target = event.target;

      if (root && target instanceof Node && !root.contains(target)) {
        closeSelector(false);
      }
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        closeSelector(true);
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeSelector, isOpen]);

  function handleOptionSelect(value: Value): void {
    onSelect(value);
    closeSelector(true);
  }

  return (
    <details
      className={classNames(styles.root, className)}
      onToggle={handleToggle}
      open={isOpen}
      ref={rootRef}
    >
      {children}

      <GlassSurface
        aria-label={optionsAriaLabel}
        className={styles.options}
        mode="light"
        role="group"
      >
        {options.map((option) => (
          <SelectorOptionButton
            key={option.value}
            onSelect={handleOptionSelect}
            option={option}
            selected={option.value === selectedValue}
          />
        ))}
      </GlassSurface>
    </details>
  );
}

function SelectorOptionButton<Value extends string>({
  onSelect,
  option,
  selected,
}: SelectorOptionButtonProps<Value>) {
  function handleClick(): void {
    onSelect(option.value);
  }

  return (
    <button aria-pressed={selected} className={styles.option} onClick={handleClick} type="button">
      <span>{option.label}</span>
    </button>
  );
}
