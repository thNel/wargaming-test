import { afterEach, describe, expect, it, vi } from "vitest";

import { mediaApi } from "@/services/mediaApi";
import { nationsApi } from "@/services/nationsApi";
import { vehicleTypesApi } from "@/services/vehicleTypesApi";
import { createAppStore } from "@/store";

import { selectAllCatalogVehicles, selectCatalogStatus } from "./catalog.selectors";
import { loadCatalog } from "./catalogThunks";

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

function mockApiResponses() {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const endpointName = getEndpoint(input);

    return Response.json(successfulResponses[endpointName]);
  });

  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
}

describe("loadCatalog", () => {
  it("waits for independently loaded reference data before reporting a ready catalog", async () => {
    const fetchMock = mockApiResponses();
    const store = createAppStore();

    await store.dispatch(loadCatalog());

    expect(store.getState().catalog.status).toBe("succeeded");
    expect(selectCatalogStatus(store.getState())).toBe("loading");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(getEndpoint(fetchMock.mock.calls[0][0])).toBe("vehicles");
    expect(selectAllCatalogVehicles(store.getState())).toMatchObject([
      {
        id: "vehicle-1",
        nation: null,
        class: null,
        locales: {
          name: { en: "Yamato", ru: "Ямато" },
          description: { en: "Yamato description", ru: "Описание Ямато" },
        },
      },
    ]);

    await Promise.all([
      store.dispatch(nationsApi.endpoints.getNations.initiate(undefined)),
      store.dispatch(vehicleTypesApi.endpoints.getVehicleTypes.initiate(undefined)),
      store.dispatch(mediaApi.endpoints.getMediaPath.initiate(undefined)),
    ]);

    expect(selectCatalogStatus(store.getState())).toBe("succeeded");
  });

  it("reactively normalizes vehicles when independent reference queries update", async () => {
    const fetchMock = mockApiResponses();
    const store = createAppStore();

    await store.dispatch(loadCatalog());
    expect(selectAllCatalogVehicles(store.getState())[0]?.nation).toBeNull();

    await Promise.all([
      store.dispatch(nationsApi.endpoints.getNations.initiate(undefined)),
      store.dispatch(vehicleTypesApi.endpoints.getVehicleTypes.initiate(undefined)),
      store.dispatch(mediaApi.endpoints.getMediaPath.initiate(undefined)),
    ]);
    expect(selectCatalogStatus(store.getState())).toBe("succeeded");

    expect(selectAllCatalogVehicles(store.getState())).toMatchObject([
      {
        nation: {
          locales: { en: "Japan", ru: "Япония" },
          icons: { small: "/mocks/vortex/images/nation_flags/small/japan.png" },
        },
        class: {
          locales: { name: { en: "Battleship", ru: "Линкор" } },
          icons: { default: "/mocks/vortex/images/vehicle/types/Battleship/standard.png" },
        },
      },
    ]);

    const changedNationResponse = {
      ...(successfulResponses.nations as object),
      data: [
        {
          name: "japan",
          id: 1,
          color: 123,
          tags: ["inTree"],
          icons: { small: "nation_flags/small/japan-updated.png" },
          localization: { mark: { en: "Japan Updated", ru: "Япония обновлена" } },
        },
      ],
    };
    fetchMock.mockImplementation(async (input: RequestInfo | URL) =>
      Response.json(
        getEndpoint(input) === "nations"
          ? changedNationResponse
          : successfulResponses[getEndpoint(input)],
      ),
    );

    await store.dispatch(
      nationsApi.endpoints.getNations.initiate(undefined, { forceRefetch: true }),
    );

    expect(selectAllCatalogVehicles(store.getState())[0]?.nation?.locales.ru).toBe(
      "Япония обновлена",
    );
    expect(selectAllCatalogVehicles(store.getState())[0]?.nation?.icons.small).toBe(
      "/mocks/vortex/images/nation_flags/small/japan-updated.png",
    );
  });

  it("can retry a failed vehicle request", async () => {
    let failVehicles = true;
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const endpointName = getEndpoint(input);

      if (endpointName === "vehicles" && failVehicles) {
        return Response.json({ message: "Service unavailable" }, { status: 503 });
      }

      return Response.json(successfulResponses[endpointName]);
    });
    vi.stubGlobal("fetch", fetchMock);
    const store = createAppStore();

    await store.dispatch(loadCatalog());
    expect(store.getState().catalog.status).toBe("failed");

    failVehicles = false;
    await store.dispatch(loadCatalog());

    expect(store.getState().catalog.status).toBe("succeeded");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
