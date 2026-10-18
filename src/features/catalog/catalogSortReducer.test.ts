import { describe, expect, it } from "vitest";

import { catalogSortReducer, INITIAL_CATALOG_SORT_STATE } from "./catalogSortReducer";

describe("catalogSortReducer", () => {
  it("starts with default ordering", () => {
    expect(INITIAL_CATALOG_SORT_STATE).toEqual({ mode: "default", direction: "descending" });
  });

  it("uses ascending order when name sorting is first selected", () => {
    expect(catalogSortReducer(INITIAL_CATALOG_SORT_STATE, "name")).toEqual({
      mode: "name",
      direction: "ascending",
    });
  });

  it("reverses the active sort direction when its option is selected again", () => {
    const ascendingName = catalogSortReducer(INITIAL_CATALOG_SORT_STATE, "name");
    const descendingName = catalogSortReducer(ascendingName, "name");

    expect(descendingName).toEqual({ mode: "name", direction: "descending" });
    expect(catalogSortReducer(descendingName, "name")).toEqual(ascendingName);
  });

  it("uses descending order when tier sorting is first selected and toggles on repeat", () => {
    const descendingTier = catalogSortReducer(INITIAL_CATALOG_SORT_STATE, "level");

    expect(descendingTier).toEqual({ mode: "level", direction: "descending" });
    expect(catalogSortReducer(descendingTier, "level")).toEqual({
      mode: "level",
      direction: "ascending",
    });
  });

  it("restores default ordering when the default option is selected", () => {
    const sortedByName = catalogSortReducer(INITIAL_CATALOG_SORT_STATE, "name");

    expect(catalogSortReducer(sortedByName, "default")).toEqual({
      mode: "default",
      direction: "ascending",
    });
  });
});
