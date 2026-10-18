import type { VortexResponseDto } from "./vortex-response.dto";
import { createVortexApi } from "./createVortexApi";

export const mediaApi = createVortexApi("mediaApi").injectEndpoints({
  endpoints: (build) => ({
    getMediaPath: build.query<VortexResponseDto<string>, void>({
      query: () => "media_path/",
    }),
  }),
});
