import { createAsyncThunk } from "@reduxjs/toolkit";

import { vehiclesApi } from "@/services/vehiclesApi";
import { vortexApi } from "@/services/vortexApi";
import type { AppDispatch, RootState } from "@/store";

export const loadCatalog = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>(
  "catalog/load",
  async (_, { dispatch }) => {
    await dispatch(
      vehiclesApi.endpoints.getVehicles.initiate(undefined, { subscribe: false }),
    ).unwrap();
  },
  {
    condition: (_, { getState }) => getState().catalog.status !== "loading",
  },
);

export function invalidateCatalogCache() {
  return (dispatch: AppDispatch): void => {
    dispatch(vortexApi.util.invalidateTags(["Vehicles", "Nations", "VehicleTypes", "MediaPath"]));
  };
}
