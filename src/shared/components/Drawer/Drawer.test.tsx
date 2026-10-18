import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Drawer } from "./Drawer";

function renderDrawer() {
  const handleClose = vi.fn();

  render(
    <Drawer closeLabel="Close" onClose={handleClose} open={false} title="Language">
      <button type="button">English</button>
    </Drawer>,
  );

  const dialog = screen.getByRole<HTMLDialogElement>("dialog", { hidden: true });

  vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue(new DOMRect(100, 0, 300, 600));

  return { dialog, handleClose };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Drawer", () => {
  it("keeps the drawer open when its padding is clicked", () => {
    const { dialog, handleClose } = renderDrawer();

    fireEvent.click(dialog, { clientX: 108, clientY: 8 });

    expect(handleClose).not.toHaveBeenCalled();
  });

  it("requests closing when the backdrop is clicked", () => {
    const { dialog, handleClose } = renderDrawer();

    fireEvent.click(dialog, { clientX: 80, clientY: 100 });

    expect(handleClose).toHaveBeenCalledOnce();
  });

  it("does not dismiss when a child is clicked", () => {
    const { handleClose } = renderDrawer();

    fireEvent.click(screen.getByRole("button", { hidden: true, name: "English" }));

    expect(handleClose).not.toHaveBeenCalled();
  });

  it("requests closing through its close button", () => {
    const { handleClose } = renderDrawer();

    fireEvent.click(screen.getByRole("button", { hidden: true, name: "Close" }));

    expect(handleClose).toHaveBeenCalledOnce();
  });

  it("handles native cancellation through the controlled close callback", () => {
    const { dialog, handleClose } = renderDrawer();
    const cancelEvent = new Event("cancel", { cancelable: true });

    fireEvent(dialog, cancelEvent);

    expect(cancelEvent.defaultPrevented).toBe(true);
    expect(handleClose).toHaveBeenCalledOnce();
  });
});
