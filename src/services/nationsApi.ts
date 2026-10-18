import type { NationDto } from "./nations.dto";
import type { VortexResponseDto } from "./vortex-response.dto";
import { createVortexApi } from "./createVortexApi";

export const nationsApi = createVortexApi("nationsApi").injectEndpoints({
  endpoints: (build) => ({
    getNations: build.query<VortexResponseDto<NationDto[]>, void>({
      query: () => "nations/",
    }),
  }),
});
