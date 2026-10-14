import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CatalogFeature } from "./CatalogFeature";

describe("CatalogFeature", () => {
  it("renders the catalog content in the active locale", async () => {
    render(<CatalogFeature />);

    expect(
      await screen.findByRole("heading", { name: "World of Warships ship catalog" }),
    ).toBeInTheDocument();
    expect(screen.getByText("The ship catalog is being prepared.")).toBeInTheDocument();
  });
});
