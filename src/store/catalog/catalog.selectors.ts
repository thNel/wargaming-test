import { createSelector } from "@reduxjs/toolkit";

import { mediaApi } from "@/services/mediaApi";
import { nationsApi } from "@/services/nationsApi";
import { vehicleTypesApi } from "@/services/vehicleTypesApi";
import { vehiclesApi } from "@/services/vehiclesApi";
import type { RootState } from "@/store";

import type { CatalogStatus, CatalogVehicleCollection } from "./catalog.types";
import { normalizeCatalogVehicles } from "./normalizeCatalogVehicles";

const emptyNations: [] = [];
const emptyVehicleTypes: Record<string, never> = {};
const EMPTY_VEHICLES: CatalogVehicleCollection = Object.freeze([]);

const selectVehiclesResult = vehiclesApi.endpoints.getVehicles.select(undefined);
const selectNationsResult = nationsApi.endpoints.getNations.select(undefined);
const selectVehicleTypesResult = vehicleTypesApi.endpoints.getVehicleTypes.select(undefined);
const selectMediaPathResult = mediaApi.endpoints.getMediaPath.select(undefined);

export const selectAllCatalogVehicles = createSelector(
  [
    (state: RootState) => selectVehiclesResult(state).data?.data,
    (state: RootState) => selectNationsResult(state).data?.data,
    (state: RootState) => selectVehicleTypesResult(state).data?.data,
    (state: RootState) => selectMediaPathResult(state).data?.data,
  ],
  (vehicles, nations, vehicleTypes, mediaPath): CatalogVehicleCollection => {
    if (!vehicles) {
      return EMPTY_VEHICLES;
    }

    return normalizeCatalogVehicles({
      vehicles,
      nations: nations ?? emptyNations,
      vehicleTypes: vehicleTypes ?? emptyVehicleTypes,
      mediaPath: mediaPath ?? "",
    });
  },
);

export const selectCatalogStatus = createSelector(
  [
    (state: RootState) => state.catalog.status,
    (state: RootState) => selectVehiclesResult(state).data,
    (state: RootState) => selectNationsResult(state).data,
    (state: RootState) => selectVehicleTypesResult(state).data,
    (state: RootState) => selectMediaPathResult(state).data,
  ],
  (status, vehicles, nations, vehicleTypes, mediaPath): CatalogStatus => {
    const hasAllReferenceData = nations && vehicleTypes && mediaPath;
    const hasLoadedVehicles = status === "succeeded" || (status === "failed" && vehicles);

    if (hasLoadedVehicles && !hasAllReferenceData) {
      return "loading";
    }

    return status === "failed" && vehicles ? "succeeded" : status;
  },
);
