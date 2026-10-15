import { afterEach, describe, expect, it, vi } from "vitest";

import { selectAllCatalogShips } from "./catalogSlice";
import { loadCatalog } from "./catalogThunks";
import { createAppStore } from "../index";

afterEach(() => {
  vi.unstubAllGlobals();
});

const successfulResponses: Record<string, unknown> = {
  vehicles: {
    status: "ok",
    data: {
      "ship-1": {
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

function mockApiResponses(failFirstNationRequest = false) {
  let nationRequests = 0;
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const requestUrl = input instanceof Request ? input.url : String(input);
    const endpoint = new URL(requestUrl).pathname.split("/").filter(Boolean).at(-1) ?? "";
    const endpointName = endpoint.replace(/\.json$/, "");

    if (failFirstNationRequest && endpointName === "nations" && nationRequests++ === 0) {
      return new Response("Service unavailable", { status: 503 });
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
      const requestUrl = input instanceof Request ? input.url : String(input);
      const endpoint = new URL(requestUrl).pathname.split("/").filter(Boolean).at(-1) ?? "";
      const endpointName = endpoint.replace(/\.json$/, "");

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
    expect(store.getState().catalog.ids).toEqual(["ship-1"]);
    expect(selectAllCatalogShips(store.getState())).toMatchObject([
      {
        id: "ship-1",
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

  it("stores request errors and can load again after a failed attempt", async () => {
    const { getNationRequests } = mockApiResponses(true);
    const store = createAppStore();

    await store.dispatch(loadCatalog());

    expect(store.getState().catalog.status).toBe("failed");
    expect(store.getState().catalog.error).toBeTruthy();

    await store.dispatch(loadCatalog());

    expect(store.getState().catalog.status).toBe("succeeded");
    expect(getNationRequests()).toBe(2);
    expect(store.getState().catalog.ids).toEqual(["ship-1"]);
  });
});
