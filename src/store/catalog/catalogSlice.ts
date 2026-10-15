import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import type { RootState } from "../index";
import { loadCatalog } from "./catalogThunks";
import type { CatalogShip } from "./catalog.types";

export type CatalogStatus = "idle" | "loading" | "succeeded" | "failed";

const catalogAdapter = createEntityAdapter<CatalogShip>();

const initialState = catalogAdapter.getInitialState({
  status: "idle" as CatalogStatus,
  error: null as string | null,
});

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCatalog.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadCatalog.fulfilled, (state, action) => {
        catalogAdapter.setAll(state, [...action.payload]);
        state.status = "succeeded";
      })
      .addCase(loadCatalog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? "Catalog request failed";
      });
  },
});

export const catalogReducer = catalogSlice.reducer;
export const { selectAll: selectAllCatalogShips, selectById: selectCatalogShipById } =
  catalogAdapter.getSelectors<RootState>((state) => state.catalog);

export function selectCatalogStatus(state: RootState): CatalogStatus {
  return state.catalog.status;
}

export function selectCatalogError(state: RootState): string | null {
  return state.catalog.error;
}
