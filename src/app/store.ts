import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import { VORTEX_API } from "../shared/api/vortexApi";

export const STORE = configureStore({
  reducer: {
    [VORTEX_API.reducerPath]: VORTEX_API.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(VORTEX_API.middleware),
});

export type RootState = ReturnType<typeof STORE.getState>;
export type AppDispatch = typeof STORE.dispatch;

export function useAppDispatch(): AppDispatch {
  return useDispatch<AppDispatch>();
}

export function useAppSelector<Result>(selector: (state: RootState) => Result): Result {
  return useSelector(selector);
}
