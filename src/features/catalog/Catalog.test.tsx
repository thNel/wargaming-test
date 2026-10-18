import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Catalog } from "./Catalog";
import styles from "./Catalog.module.css";

describe("Catalog placeholder", () => {
  it("renders six decorative skeleton cards", () => {
    const { container } = render(<Catalog />);
    const grid = container.querySelector(`.${styles.grid}`);

    expect(grid).toHaveAttribute("aria-hidden", "true");
    expect(grid?.children).toHaveLength(6);
    expect(grid?.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
