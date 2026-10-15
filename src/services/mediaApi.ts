import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { VortexResponseDto } from "./vortex-response.dto";

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: fetchBaseQuery({ baseUrl: new URL("/api/", globalThis.location.origin).toString() }),
  endpoints: (build) => ({
    getMediaPath: build.query<VortexResponseDto<string>, void>({
      query: () => "media_path/",
    }),
  }),
});
