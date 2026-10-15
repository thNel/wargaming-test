import { createAsyncThunk } from "@reduxjs/toolkit";

import { mediaApi } from "@/services/mediaApi";
import { nationsApi } from "@/services/nationsApi";
import { vehicleTypesApi } from "../../services/vehicleTypesApi.ts";
import { vehiclesApi } from "../../services/vehiclesApi.ts";
import type { RootState } from "../index";
import { normalizeCatalogShips } from "./normalizeCatalogShips";
import type { CatalogShipCollection } from "./catalog.types";

export const loadCatalog = createAsyncThunk<
  CatalogShipCollection,
  void,
  { state: RootState; rejectValue: string }
>(
  "catalog/load",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const [vehicles, nations, vehicleTypes, mediaPath] = await Promise.all([
        dispatch(
          vehiclesApi.endpoints.getVehicles.initiate(undefined, { subscribe: false }),
        ).unwrap(),
        dispatch(
          nationsApi.endpoints.getNations.initiate(undefined, { subscribe: false }),
        ).unwrap(),
        dispatch(
          vehicleTypesApi.endpoints.getVehicleTypes.initiate(undefined, { subscribe: false }),
        ).unwrap(),
        dispatch(
          mediaApi.endpoints.getMediaPath.initiate(undefined, { subscribe: false }),
        ).unwrap(),
      ]);

      return normalizeCatalogShips({
        vehicles: vehicles.data,
        nations: nations.data,
        vehicleTypes: vehicleTypes.data,
        mediaPath: mediaPath.data,
      });
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Catalog request failed");
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().catalog;
      return status !== "loading" && status !== "succeeded";
    },
  },
);
