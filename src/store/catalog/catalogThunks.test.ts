import { afterEach, describe, expect, it, vi } from "vitest";

import { mediaApi } from "@/services/mediaApi";
import { nationsApi } from "@/services/nationsApi";
import { vehicleTypesApi } from "@/services/vehicleTypesApi";
import { vehiclesApi } from "@/services/vehiclesApi";
import { selectAllCatalogVehicles } from "./catalogSlice";
import { loadCatalog } from "./catalogThunks";
import { createAppStore } from "../index";

afterEach(() => {
  vi.unstubAllGlobals();
});

const successfulResponses: Record<string, unknown> = {
  vehicles: {
    status: "ok",
    data: {
      "vehicle-1": {
        level: 10,
        name: "JPNB110_Yamato",
        nation: "japan",
        tags: ["Battleship", "premium"],
        icons: { large: "vehicle/large/yamato.png" },
        localization: {
          mark: { en: "Yamato", ru: "Ямато" },
          shortmark: { en: "Yamato", ru: "Ямато" },
          description: { en: "Yamato description", ru: "Описание Ямато" },
        },
      },
    },
  },
  nations: {
    status: "ok",
    data: [
      {
        name: "japan",
        id: 1,
        color: 123,
        tags: ["inTree"],
        icons: { small: "nation_flags/small/japan.png" },
        localization: { mark: { en: "Japan", ru: "Япония" } },
      },
    ],
  },
  vehicle_types_common: {
    status: "ok",
    data: {
      Battleship: {
        sort_order: 4,
        icons: { default: "vehicle/types/Battleship/standard.png" },
        localization: {
          mark: { en: "Battleship", ru: "Линкор" },
          shortmark: { en: "BB", ru: "ЛК" },
        },
      },
    },
  },
  media_path: { status: "ok", data: "/mocks/vortex/images/" },
};

function getEndpoint(input: RequestInfo | URL): string {
  const requestUrl = input instanceof Request ? input.url : String(input);
  const endpoint = new URL(requestUrl).pathname.split("/").filter(Boolean).at(-1) ?? "";

  return endpoint.replace(/\.json$/, "");
}

function mockApiResponses(failFirstNationRequest = false) {
  let nationRequests = 0;
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const endpointName = getEndpoint(input);

    if (failFirstNationRequest && endpointName === "nations" && nationRequests++ === 0) {
      return new Response(JSON.stringify({ message: "Service unavailable" }), {
        headers: { "Content-Type": "application/json" },
        status: 503,
      });
    }

    return new Response(JSON.stringify(successfulResponses[endpointName]), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  });

  vi.stubGlobal("fetch", fetchMock);

  return { fetchMock, getNationRequests: () => nationRequests };
}

describe("loadCatalog", () => {
  it("loads all sources, normalizes complete records, and updates store status", async () => {
    let releaseResponses: () => void = () => undefined;
    const responsesReady = new Promise<void>((resolve) => {
      releaseResponses = resolve;
    });
    const { fetchMock } = mockApiResponses();
    fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
      await responsesReady;
      const endpointName = getEndpoint(input);

      return new Response(JSON.stringify(successfulResponses[endpointName]), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    });

    const store = createAppStore();
    const loadPromise = store.dispatch(loadCatalog());

    expect(store.getState().catalog.status).toBe("loading");
    releaseResponses();
    await loadPromise;

    expect(store.getState().catalog.status).toBe("succeeded");
    expect(store.getState().catalog.ids).toEqual(["vehicle-1"]);
    expect(selectAllCatalogVehicles(store.getState())).toMatchObject([
      {
        id: "vehicle-1",
        locales: {
          name: { en: "Yamato", ru: "Ямато" },
          description: { en: "Yamato description", ru: "Описание Ямато" },
        },
        nation: { locales: { en: "Japan", ru: "Япония" } },
        class: { locales: { name: { en: "Battleship", ru: "Линкор" } } },
        icons: { large: "/mocks/vortex/images/vehicle/large/yamato.png" },
      },
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("marks a failed request and can load again after a failed attempt", async () => {
    const { getNationRequests } = mockApiResponses(true);
    const store = createAppStore();

    await store.dispatch(loadCatalog());

    expect(store.getState().catalog.status).toBe("failed");
    expect(store.getState().catalog).not.toHaveProperty("errors");
    expect(store.getState().catalog.ids).toEqual([]);

    await store.dispatch(loadCatalog());

    expect(store.getState().catalog.status).toBe("succeeded");
    expect(getNationRequests()).toBe(2);
    expect(store.getState().catalog.ids).toEqual(["vehicle-1"]);
  });

  it("waits for all sources and rejects the catalog when any request fails", async () => {
    let releaseMediaResponse: () => void = () => undefined;
    const mediaResponseReady = new Promise<void>((resolve) => {
      releaseMediaResponse = resolve;
    });
    const { fetchMock } = mockApiResponses();
    fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
      const endpoint = getEndpoint(input);

      if (endpoint === "vehicles" || endpoint === "nations") {
        return Response.json({ message: "Service unavailable" }, { status: 503 });
      }

      if (endpoint === "media_path") {
        await mediaResponseReady;
      }

      return Response.json(successfulResponses[endpoint]);
    });
    const store = createAppStore();
    const loadPromise = store.dispatch(loadCatalog());

    try {
      await vi.waitFor(() => {
        expect(vehiclesApi.endpoints.getVehicles.select()(store.getState()).isError).toBe(true);
        expect(nationsApi.endpoints.getNations.select()(store.getState()).isError).toBe(true);
      });
      expect(store.getState().catalog.status).toBe("loading");
    } finally {
      releaseMediaResponse();
    }

    await loadPromise;

    expect(store.getState().catalog.status).toBe("failed");
    expect(store.getState().catalog.ids).toEqual([]);
  });

  it("fails on unsuccessful envelopes and retries them", async () => {
    let nationRequests = 0;
    const { fetchMock } = mockApiResponses();
    fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
      const endpoint = getEndpoint(input);

      if (endpoint === "nations" && nationRequests++ === 0) {
        return Response.json({ status: "error", data: null });
      }

      return Response.json(successfulResponses[endpoint]);
    });
    const store = createAppStore();

    await store.dispatch(loadCatalog());
    expect(store.getState().catalog.status).toBe("failed");

    await store.dispatch(loadCatalog());

    expect(store.getState().catalog.status).toBe("succeeded");
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it("marks normalization failures and does not publish an incomplete catalog", async () => {
    const { fetchMock } = mockApiResponses();
    fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
      const endpoint = getEndpoint(input);

      return Response.json(
        endpoint === "nations" ? { status: "ok", data: {} } : successfulResponses[endpoint],
      );
    });
    const store = createAppStore();

    await store.dispatch(loadCatalog());

    expect(store.getState().catalog.status).toBe("failed");
    expect(store.getState().catalog.ids).toEqual([]);
  });

  it("keeps the thunk error when loading is aborted without a rejection payload", async () => {
    let releaseResponses: () => void = () => undefined;
    const responsesReady = new Promise<void>((resolve) => {
      releaseResponses = resolve;
    });
    const { fetchMock } = mockApiResponses();
    fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
      await responsesReady;
      return Response.json(successfulResponses[getEndpoint(input)]);
    });
    const store = createAppStore();
    const loadPromise = store.dispatch(loadCatalog());

    loadPromise.abort("Catalog loading cancelled");
    const action = await loadPromise;
    releaseResponses();

    await Promise.all([
      store.dispatch(vehiclesApi.endpoints.getVehicles.initiate(undefined, { subscribe: false })),
      store.dispatch(nationsApi.endpoints.getNations.initiate(undefined, { subscribe: false })),
      store.dispatch(
        vehicleTypesApi.endpoints.getVehicleTypes.initiate(undefined, { subscribe: false }),
      ),
      store.dispatch(mediaApi.endpoints.getMediaPath.initiate(undefined, { subscribe: false })),
    ]);

    expect(action).toMatchObject({ payload: undefined, meta: { aborted: true } });
    expect(store.getState().catalog.status).toBe("failed");
    expect(store.getState().catalog.ids).toEqual([]);
  });

  it("loads again after success using the four source caches", async () => {
    const { fetchMock } = mockApiResponses();
    const store = createAppStore();

    await store.dispatch(loadCatalog());
    const action = await store.dispatch(loadCatalog());

    expect(loadCatalog.fulfilled.match(action)).toBe(true);
    expect(store.getState().catalog.status).toBe("succeeded");
    expect(store.getState().catalog.ids).toEqual(["vehicle-1"]);
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("preserves the last catalog when a refreshed source fails", async () => {
    const { fetchMock } = mockApiResponses();
    const store = createAppStore();

    await store.dispatch(loadCatalog());
    const previousVehicles = selectAllCatalogVehicles(store.getState());
    store.dispatch(nationsApi.util.resetApiState());
    fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
      const endpoint = getEndpoint(input);

      return endpoint === "nations"
        ? Response.json({ message: "Service unavailable" }, { status: 503 })
        : Response.json(successfulResponses[endpoint]);
    });

    await store.dispatch(loadCatalog());

    expect(store.getState().catalog.status).toBe("failed");
    expect(selectAllCatalogVehicles(store.getState())).toBe(previousVehicles);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });
});
