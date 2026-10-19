import type { VehicleDto } from "./vehicles.dto";
import type { VortexResponseDto } from "./vortex-response.dto";
import { vortexApi } from "./vortexApi";

export const vehiclesApi = vortexApi.injectEndpoints({
  endpoints: (build) => ({
    getVehicles: build.query<VortexResponseDto<Record<string, VehicleDto>>, void>({
      query: () => "vehicles/",
      providesTags: ["Vehicles"],
    }),
  }),
});
