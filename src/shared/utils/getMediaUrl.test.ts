import { describe, expect, it } from "vitest";

import { getMediaUrl } from "./getMediaUrl";

describe("getMediaUrl", () => {
  it.each([
    [
      "https://cdn.example/icons/",
      "vehicle/ship.png",
      "https://cdn.example/icons/vehicle/ship.png",
    ],
    ["/icons///", "///flag.png", "/icons/flag.png"],
    ["", "flag.png", "/flag.png"],
  ])("joins %s and %s", (base, path, expected) => {
    expect(getMediaUrl(base, path)).toBe(expected);
  });

  it("returns no URL while either source is unavailable", () => {
    expect(getMediaUrl(undefined, "flag.png")).toBeUndefined();
    expect(getMediaUrl("/icons/", undefined)).toBeUndefined();
  });
});
