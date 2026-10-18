import { mediaApi } from "@/services/mediaApi";
import { nationsApi } from "@/services/nationsApi";
import { vehicleTypesApi } from "@/services/vehicleTypesApi";
import { vehiclesApi } from "@/services/vehiclesApi";
import type { AppDispatch } from "@/store";
import type { CatalogVehicleCollection } from "./catalog.types";
import { normalizeCatalogVehicles } from "./normalizeCatalogVehicles";

export async function loadCatalogData(dispatch: AppDispatch): Promise<CatalogVehicleCollection> {
  const [vehicles, nations, vehicleTypes, mediaPath] = await Promise.allSettled([
    dispatch(vehiclesApi.endpoints.getVehicles.initiate(undefined, { subscribe: false })).unwrap(),
    dispatch(nationsApi.endpoints.getNations.initiate(undefined, { subscribe: false })).unwrap(),
    dispatch(
      vehicleTypesApi.endpoints.getVehicleTypes.initiate(undefined, { subscribe: false }),
    ).unwrap(),
    dispatch(mediaApi.endpoints.getMediaPath.initiate(undefined, { subscribe: false })).unwrap(),
  ]);

  if (
    vehicles.status === "rejected" ||
    nations.status === "rejected" ||
    vehicleTypes.status === "rejected" ||
    mediaPath.status === "rejected"
  ) {
    throw new Error("Catalog sources failed to load");
  }

  return normalizeCatalogVehicles({
    vehicles: vehicles.value.data,
    nations: nations.value.data,
    vehicleTypes: vehicleTypes.value.data,
    mediaPath: mediaPath.value.data,
  });
}
