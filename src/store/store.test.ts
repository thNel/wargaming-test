import { describe, expect, it } from "vitest";

import { mediaApi } from "@/services/mediaApi";
import { nationsApi } from "@/services/nationsApi";
import { vehicleTypesApi } from "../services/vehicleTypesApi.ts";
import { vehiclesApi } from "../services/vehiclesApi.ts";
import { createAppStore } from "./index";

describe("app store API services", () => {
  it("registers four independent API caches", () => {
    const store = createAppStore();
    const stateKeys = Object.keys(store.getState());
    const apiReducerPaths = [
      vehiclesApi.reducerPath,
      nationsApi.reducerPath,
      vehicleTypesApi.reducerPath,
      mediaApi.reducerPath,
    ];

    expect(new Set(apiReducerPaths).size).toBe(4);
    expect(stateKeys).toEqual(expect.arrayContaining(apiReducerPaths));
  });
});
