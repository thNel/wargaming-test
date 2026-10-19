import type { NationDto } from "./nations.dto";
import type { VortexResponseDto } from "./vortex-response.dto";
import { vortexApi } from "./vortexApi";

export const nationsApi = vortexApi.injectEndpoints({
  endpoints: (build) => ({
    getNations: build.query<VortexResponseDto<NationDto[]>, void>({
      query: () => "nations/",
      providesTags: ["Nations"],
    }),
  }),
});
