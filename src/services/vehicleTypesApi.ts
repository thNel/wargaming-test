import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { VehicleTypeDto } from "./vehicle-types.dto";
import type { VortexResponseDto } from "./vortex-response.dto";

export const vehicleTypesApi = createApi({
  reducerPath: "vehicleTypesApi",
  baseQuery: fetchBaseQuery({ baseUrl: new URL("/api/", globalThis.location.origin).toString() }),
  endpoints: (build) => ({
    getVehicleTypes: build.query<VortexResponseDto<Record<string, VehicleTypeDto>>, void>({
      query: () => "vehicle_types_common/",
    }),
  }),
});
