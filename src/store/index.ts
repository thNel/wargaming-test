import { configureStore } from "@reduxjs/toolkit";

import { vortexApi } from "@/services/vortexApi";
import { catalogReducer } from "./catalog/catalogSlice";
import { filtersReducer } from "./filters/filtersSlice";

export function createAppStore() {
  return configureStore({
    devTools: import.meta.env.DEV,
    reducer: {
      catalog: catalogReducer,
      filters: filtersReducer,
      [vortexApi.reducerPath]: vortexApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(vortexApi.middleware),
  });
}

export const store = createAppStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
