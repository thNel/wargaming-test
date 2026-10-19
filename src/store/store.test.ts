import { describe, expect, it } from "vitest";

import { mediaApi } from "@/services/mediaApi";
import { nationsApi } from "@/services/nationsApi";
import { vehicleTypesApi } from "@/services/vehicleTypesApi";
import { vehiclesApi } from "@/services/vehiclesApi";
import { vortexApi } from "@/services/vortexApi";
import { createAppStore } from "./index";

describe("app store API services", () => {
  it("registers all Vortex endpoints under one API cache", () => {
    const store = createAppStore();
    const stateKeys = Object.keys(store.getState());
    const apiReducerPaths = new Set([
      vehiclesApi.reducerPath,
      nationsApi.reducerPath,
      vehicleTypesApi.reducerPath,
      mediaApi.reducerPath,
    ]);

    expect(apiReducerPaths).toEqual(new Set([vortexApi.reducerPath]));
    expect(stateKeys).toContain(vortexApi.reducerPath);
    expect(Object.keys(vortexApi.endpoints)).toEqual(
      expect.arrayContaining(["getVehicles", "getNations", "getVehicleTypes", "getMediaPath"]),
    );
  });
});
