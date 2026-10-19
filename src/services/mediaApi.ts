import type { VortexResponseDto } from "./vortex-response.dto";
import { vortexApi } from "./vortexApi";

export const mediaApi = vortexApi.injectEndpoints({
  endpoints: (build) => ({
    getMediaPath: build.query<VortexResponseDto<string>, void>({
      query: () => "media_path/",
      providesTags: ["MediaPath"],
    }),
  }),
});
