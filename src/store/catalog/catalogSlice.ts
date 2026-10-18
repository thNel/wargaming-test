import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import type { CatalogLoadState, CatalogStatus, CatalogVehicle } from "./catalog.types";
import type { RootState } from "../index";
import { loadCatalog } from "./catalogThunks";

const catalogAdapter = createEntityAdapter<CatalogVehicle>();

const initialState = catalogAdapter.getInitialState<CatalogLoadState>({
  status: "idle",
});

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCatalog.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadCatalog.fulfilled, (state, action) => {
        catalogAdapter.setAll(state, [...action.payload]);
        state.status = "succeeded";
      })
      .addCase(loadCatalog.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const catalogReducer = catalogSlice.reducer;
export const { selectAll: selectAllCatalogVehicles } = catalogAdapter.getSelectors<RootState>(
  (state) => state.catalog,
);

export function selectCatalogStatus(state: RootState): CatalogStatus {
  return state.catalog.status;
}
