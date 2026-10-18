import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

if (!("ResizeObserver" in globalThis)) {
  globalThis.ResizeObserver = class ResizeObserverMock {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

if (!HTMLElement.prototype.showPopover) {
  HTMLElement.prototype.showPopover = function showPopover(this: HTMLElement): void {
    this.dataset.testPopoverOpen = "true";
  };
  HTMLElement.prototype.hidePopover = function hidePopover(this: HTMLElement): void {
    delete this.dataset.testPopoverOpen;
  };

  const nativeMatches = HTMLElement.prototype.matches;
  HTMLElement.prototype.matches = function matches(this: HTMLElement, selector: string): boolean {
    if (selector === ":popover-open") {
      return this.dataset.testPopoverOpen === "true";
    }

    return nativeMatches.call(this, selector);
  } as typeof HTMLElement.prototype.matches;
}

afterEach(() => {
  cleanup();
});
