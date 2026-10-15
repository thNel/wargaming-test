import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { NationDto } from "./nations.dto";
import type { VortexResponseDto } from "./vortex-response.dto";

export const nationsApi = createApi({
  reducerPath: "nationsApi",
  baseQuery: fetchBaseQuery({ baseUrl: new URL("/api/", globalThis.location.origin).toString() }),
  endpoints: (build) => ({
    getNations: build.query<VortexResponseDto<NationDto[]>, void>({
      query: () => "nations/",
    }),
  }),
});
