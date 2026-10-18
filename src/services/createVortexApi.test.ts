import { configureStore } from "@reduxjs/toolkit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createVortexApi } from "./createVortexApi";
import type { VortexResponseDto } from "./vortex-response.dto";

const api = createVortexApi("vortexTestApi").injectEndpoints({
  endpoints: (build) => ({
    getMediaPath: build.query<VortexResponseDto<string>, void>({
      query: () => "media_path/",
    }),
  }),
});

function createTestStore() {
  return configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  });
}

let store: ReturnType<typeof createTestStore>;

beforeEach(() => {
  store = createTestStore();
});

afterEach(() => {
  store.dispatch(api.util.resetApiState());
  vi.unstubAllGlobals();
});

describe("createVortexApi", () => {
  it("keeps a successful envelope in the query cache", async () => {
    const response = { status: "ok", data: "/icons/" };
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json(response)),
    );

    await expect(
      store.dispatch(api.endpoints.getMediaPath.initiate(undefined, { subscribe: false })).unwrap(),
    ).resolves.toEqual(response);
    expect(api.endpoints.getMediaPath.select()(store.getState())).toMatchObject({
      status: "fulfilled",
      data: response,
    });
  });

  it.each([
    { name: "an API failure", response: { status: "error", data: null } },
    { name: "a null envelope", response: null },
    { name: "an array envelope", response: [] },
    { name: "a missing status", response: { data: "/icons/" } },
    { name: "missing data", response: { status: "ok" } },
    { name: "null data", response: { status: "ok", data: null } },
  ])("rejects $name returned with HTTP 200", async ({ response }) => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json(response)),
    );

    await expect(
      store.dispatch(api.endpoints.getMediaPath.initiate(undefined, { subscribe: false })).unwrap(),
    ).rejects.toEqual({
      status: "CUSTOM_ERROR",
      error: "Invalid Vortex API response: expected status ok and non-null data",
    });
    expect(api.endpoints.getMediaPath.select()(store.getState())).toMatchObject({
      status: "rejected",
    });
    expect(api.endpoints.getMediaPath.select()(store.getState()).data).toBeUndefined();
  });

  it("requests data again after an unsuccessful envelope", async () => {
    const response = { status: "ok", data: "/icons/" };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ status: "error", data: null }))
      .mockResolvedValueOnce(Response.json(response));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      store.dispatch(api.endpoints.getMediaPath.initiate(undefined, { subscribe: false })).unwrap(),
    ).rejects.toMatchObject({ status: "CUSTOM_ERROR" });
    await expect(
      store.dispatch(api.endpoints.getMediaPath.initiate(undefined, { subscribe: false })).unwrap(),
    ).resolves.toEqual(response);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("preserves HTTP failures without applying envelope validation", async () => {
    const body = { message: "Service unavailable" };
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json(body, { status: 503 })),
    );

    await expect(
      store.dispatch(api.endpoints.getMediaPath.initiate(undefined, { subscribe: false })).unwrap(),
    ).rejects.toEqual({ status: 503, data: body });
  });

  it("preserves JSON parsing failures", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("invalid JSON", { status: 200 })),
    );

    await expect(
      store.dispatch(api.endpoints.getMediaPath.initiate(undefined, { subscribe: false })).unwrap(),
    ).rejects.toEqual({
      status: "PARSING_ERROR",
      originalStatus: 200,
      data: "invalid JSON",
      error: expect.any(String),
    });
  });
});
