import type { VehicleDto } from "./vehicles.dto";
import type { VortexResponseDto } from "./vortex-response.dto";
import { createVortexApi } from "./createVortexApi";

export const vehiclesApi = createVortexApi("vehiclesApi").injectEndpoints({
  endpoints: (build) => ({
    getVehicles: build.query<VortexResponseDto<Record<string, VehicleDto>>, void>({
      query: () => "vehicles/",
    }),
  }),
});
