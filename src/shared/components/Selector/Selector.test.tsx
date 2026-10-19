import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Selector } from "./Selector";
import type { SelectorOption } from "./Selector.types";

const options: SelectorOption<"default" | "name">[] = [
  { label: "Default order", value: "default" },
  { label: "By name", value: "name" },
];

function renderSelector(onSelect = vi.fn()) {
  const { container } = render(
    <Selector
      optionsAriaLabel="Sort options"
      onSelect={onSelect}
      options={options}
      selectedValue="default"
    >
      <summary aria-label="Sort by: Default order">Default order</summary>
    </Selector>,
  );
  const trigger = container.querySelector("summary");
  const root = container.querySelector("details");

  if (!trigger || !root) {
    throw new Error("Selector trigger and root must be rendered");
  }

  return { onSelect, root, trigger };
}

describe("Selector", () => {
  it("calls onSelect when a different or already selected option is activated", async () => {
    const user = userEvent.setup();
    const { onSelect, root, trigger } = renderSelector();

    await user.click(trigger);
    expect(root.open).toBe(true);
    await user.click(screen.getByRole("button", { name: "By name" }));

    expect(onSelect).toHaveBeenNthCalledWith(1, "name");
    expect(trigger).toHaveFocus();
    expect(root.open).toBe(false);

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Default order" }));

    expect(onSelect).toHaveBeenNthCalledWith(2, "default");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    const { root, trigger } = renderSelector();

    await user.click(trigger);
    await user.tab();
    expect(screen.getByRole("button", { name: "Default order" })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(trigger).toHaveFocus();
    expect(root.open).toBe(false);
  });

  it("closes when the pointer is pressed outside", async () => {
    const user = userEvent.setup();
    const { root, trigger } = renderSelector();

    await user.click(trigger);
    expect(root.open).toBe(true);

    await user.click(document.body);

    expect(root.open).toBe(false);
  });
});
