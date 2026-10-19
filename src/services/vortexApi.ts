import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const fetchQuery = fetchBaseQuery({
  baseUrl: new URL("/api/", globalThis.location.origin).toString(),
});

const baseQuery: typeof fetchQuery = async (args, api, extraOptions) => {
  const result = await fetchQuery(args, api, extraOptions);

  if (result.error) {
    return result;
  }

  const response = result.data;

  if (
    typeof response !== "object" ||
    response === null ||
    !("status" in response) ||
    response.status !== "ok" ||
    !("data" in response) ||
    response.data === null ||
    response.data === undefined
  ) {
    return {
      error: {
        status: "CUSTOM_ERROR",
        error: "Invalid Vortex API response: expected status ok and non-null data",
      },
      meta: result.meta,
    };
  }

  return result;
};

export const vortexApi = createApi({
  reducerPath: "vortexApi",
  tagTypes: ["Vehicles", "Nations", "VehicleTypes", "MediaPath"],
  keepUnusedDataFor: Infinity,
  baseQuery,
  endpoints: () => ({}),
});
