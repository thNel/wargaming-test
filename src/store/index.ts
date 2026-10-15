import { configureStore } from "@reduxjs/toolkit";

import { mediaApi } from "@/services/mediaApi";
import { nationsApi } from "@/services/nationsApi";
import { vehicleTypesApi } from "../services/vehicleTypesApi.ts";
import { vehiclesApi } from "../services/vehiclesApi.ts";
import { catalogReducer } from "./catalog/catalogSlice";
import { filtersReducer } from "./filters/filtersSlice";

export function createAppStore() {
  return configureStore({
    devTools: import.meta.env.DEV,
    reducer: {
      catalog: catalogReducer,
      filters: filtersReducer,
      [vehiclesApi.reducerPath]: vehiclesApi.reducer,
      [nationsApi.reducerPath]: nationsApi.reducer,
      [vehicleTypesApi.reducerPath]: vehicleTypesApi.reducer,
      [mediaApi.reducerPath]: mediaApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        vehiclesApi.middleware,
        nationsApi.middleware,
        vehicleTypesApi.middleware,
        mediaApi.middleware,
      ),
  });
}

export const store = createAppStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
