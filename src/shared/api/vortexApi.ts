import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface VortexResponse<Data> {
  status: "ok";
  data: Data;
}

export interface Vehicle {
  level: number;
  name: string;
  icons: Record<string, string>;
  tags: string[];
  localization: {
    mark: Record<string, string>;
    shortmark: Record<string, string>;
    description: Record<string, string>;
  };
  nation: string;
}

export interface Nation {
  name: string;
  icons: Record<string, string>;
  color: number;
  tags: string[];
  localization: {
    mark: Record<string, string>;
  };
  id: number;
}

export interface VehicleType {
  icons: Record<string, string>;
  localization: {
    mark: Record<string, string>;
    shortmark: Record<string, string>;
  };
  sort_order: number;
}

export const VORTEX_API = createApi({
  reducerPath: "vortexApi",
  baseQuery: fetchBaseQuery({ baseUrl: VORTEX_API_CONFIG.baseUrl }),
  endpoints: (build) => ({
    getVehicles: build.query<VortexResponse<Record<string, Vehicle>>, void>({
      query: () => VORTEX_API_CONFIG.endpoints.vehicles,
    }),
    getNations: build.query<VortexResponse<Nation[]>, void>({
      query: () => VORTEX_API_CONFIG.endpoints.nations,
    }),
    getVehicleTypes: build.query<VortexResponse<Record<string, VehicleType>>, void>({
      query: () => VORTEX_API_CONFIG.endpoints.vehicleTypes,
    }),
    getMediaPath: build.query<VortexResponse<string>, void>({
      query: () => VORTEX_API_CONFIG.endpoints.mediaPath,
    }),
  }),
});

export const {
  useGetMediaPathQuery,
  useGetNationsQuery,
  useGetVehicleTypesQuery,
  useGetVehiclesQuery,
} = VORTEX_API;
