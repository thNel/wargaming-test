import { createSlice } from "@reduxjs/toolkit";

import type { CatalogLoadState } from "./catalog.types";
import { loadCatalog } from "./catalogThunks";

const initialState: CatalogLoadState = {
  status: "idle",
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCatalog.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadCatalog.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(loadCatalog.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const catalogReducer = catalogSlice.reducer;
