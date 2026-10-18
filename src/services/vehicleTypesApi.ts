import type { VehicleTypeDto } from "./vehicle-types.dto";
import type { VortexResponseDto } from "./vortex-response.dto";
import { createVortexApi } from "./createVortexApi";

export const vehicleTypesApi = createVortexApi("vehicleTypesApi").injectEndpoints({
  endpoints: (build) => ({
    getVehicleTypes: build.query<VortexResponseDto<Record<string, VehicleTypeDto>>, void>({
      query: () => "vehicle_types_common/",
    }),
  }),
});
