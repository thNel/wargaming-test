import { mediaApi } from "@/services/mediaApi";
import { nationsApi } from "@/services/nationsApi";
import {
  VORTEX_REFERENCE_DATA_POLLING_INTERVAL_MS,
  VORTEX_VEHICLES_POLLING_INTERVAL_MS,
} from "@/services/vortexApi.constants";
import { vehicleTypesApi } from "@/services/vehicleTypesApi";
import { vehiclesApi } from "@/services/vehiclesApi";
import type { AppDispatch } from "./index";

export function startApiPolling(dispatch: AppDispatch): void {
  const apiSubscriptions = [
    dispatch(
      vehiclesApi.endpoints.getVehicles.initiate(undefined, {
        subscriptionOptions: { pollingInterval: VORTEX_VEHICLES_POLLING_INTERVAL_MS },
      }),
    ),
    dispatch(
      nationsApi.endpoints.getNations.initiate(undefined, {
        subscriptionOptions: { pollingInterval: VORTEX_REFERENCE_DATA_POLLING_INTERVAL_MS },
      }),
    ),
    dispatch(
      vehicleTypesApi.endpoints.getVehicleTypes.initiate(undefined, {
        subscriptionOptions: { pollingInterval: VORTEX_REFERENCE_DATA_POLLING_INTERVAL_MS },
      }),
    ),
    dispatch(
      mediaApi.endpoints.getMediaPath.initiate(undefined, {
        subscriptionOptions: { pollingInterval: VORTEX_REFERENCE_DATA_POLLING_INTERVAL_MS },
      }),
    ),
  ];

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      apiSubscriptions.forEach((subscription) => subscription.unsubscribe());
    });
  }
}
