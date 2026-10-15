import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { VehicleDto } from "./vehicles.dto";
import type { VortexResponseDto } from "./vortex-response.dto";

export const vehiclesApi = createApi({
  reducerPath: "vehiclesApi",
  baseQuery: fetchBaseQuery({ baseUrl: new URL("/api/", globalThis.location.origin).toString() }),
  endpoints: (build) => ({
    getVehicles: build.query<VortexResponseDto<Record<string, VehicleDto>>, void>({
      query: () => "vehicles/",
    }),
  }),
});
