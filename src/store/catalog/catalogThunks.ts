import { createAsyncThunk } from "@reduxjs/toolkit";

import type { AppDispatch, RootState } from "@/store";
import type { CatalogVehicleCollection } from "./catalog.types";
import { loadCatalogData } from "./loadCatalogData";

export const loadCatalog = createAsyncThunk<
  CatalogVehicleCollection,
  void,
  { dispatch: AppDispatch; state: RootState }
>("catalog/load", async (_, { dispatch }) => loadCatalogData(dispatch), {
  condition: (_, { getState }) => getState().catalog.status !== "loading",
});
