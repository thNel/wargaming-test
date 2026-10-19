import type { VehicleTypeDto } from "./vehicle-types.dto";
import type { VortexResponseDto } from "./vortex-response.dto";
import { vortexApi } from "./vortexApi";

export const vehicleTypesApi = vortexApi.injectEndpoints({
  endpoints: (build) => ({
    getVehicleTypes: build.query<VortexResponseDto<Record<string, VehicleTypeDto>>, void>({
      query: () => "vehicle_types_common/",
      providesTags: ["VehicleTypes"],
    }),
  }),
});
