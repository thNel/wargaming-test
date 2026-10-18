import { createAsyncThunk } from "@reduxjs/toolkit";

import { vehiclesApi } from "@/services/vehiclesApi";
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
