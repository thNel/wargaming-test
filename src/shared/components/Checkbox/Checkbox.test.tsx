import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("supports label activation, keyboard input, and native form values", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <form aria-label="Filters">
        <label>
          <Checkbox name="nation" onChange={handleChange} value="usa" />
          United States
        </label>
      </form>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "United States" });

    await user.click(screen.getByText("United States"));
    expect(checkbox).toBeChecked();
    expect(handleChange).toHaveBeenCalledOnce();
    expect(screen.getByRole("form", { name: "Filters" })).toHaveFormValues({ nation: true });
    expect(
      new FormData(screen.getByRole("form", { name: "Filters" }) as HTMLFormElement).get("nation"),
    ).toBe("usa");

    await user.keyboard(" ");
    expect(checkbox).not.toBeChecked();
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it("preserves controlled state, forwards its ref, and ignores input when disabled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const inputRef = createRef<HTMLInputElement>();
    const { rerender } = render(
      <Checkbox
        ref={inputRef}
        aria-label="Tier X"
        checked={false}
        disabled
        onChange={handleChange}
        size="sm"
      />,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Tier X" });

    expect(inputRef.current).toBe(checkbox);
    await user.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
    expect(checkbox).not.toBeChecked();

    rerender(<Checkbox aria-label="Tier X" checked onChange={handleChange} size="sm" />);
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeEnabled();
  });
});
