import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { nationsApi } from "@/services/nationsApi";
import { vehicleTypesApi } from "@/services/vehicleTypesApi";
import { i18nInstance } from "@/shared/i18n";
import { createAppStore } from "@/store";

import { Filters } from "./Filters";

const API_RESPONSES: Readonly<Record<string, unknown>> = Object.freeze({
  media_path: { status: "ok", data: "/icons/" },
  nations: {
    status: "ok",
    data: [
      {
        name: "usa",
        icons: { tiny: "usa.png" },
        color: 0,
        tags: [],
        localization: { mark: { en: "United States", ru: "США" } },
        id: 1,
      },
    ],
  },
  vehicle_types_common: {
    status: "ok",
    data: {
      Cruiser: {
        icons: { default: "cruiser.png" },
        localization: {
          mark: { en: "Cruiser", ru: "Крейсер" },
          shortmark: { en: "Cruiser", ru: "Крейсер" },
        },
        sort_order: 0,
      },
    },
  },
});

const FILTER_GROUPS = Object.freeze([
  { endpoint: "nations", name: "Nations", option: "United States" },
  { endpoint: "vehicle_types_common", name: "Vehicle type", option: "Cruiser" },
]);

function mockFilterApi(failedEndpoints = new Set<string>()) {
  const requestedEndpoints: string[] = [];
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const requestUrl = input instanceof Request ? input.url : String(input);
    const endpoint = new URL(requestUrl, window.location.origin).pathname
      .split("/")
      .filter(Boolean)
      .at(-1);

    if (!endpoint || !(endpoint in API_RESPONSES)) {
      throw new Error(`Unexpected filter request: ${requestUrl}`);
    }

    requestedEndpoints.push(endpoint);
    const hasError = failedEndpoints.has(endpoint);

    return new Response(JSON.stringify(hasError ? { status: "error" } : API_RESPONSES[endpoint]), {
      headers: { "Content-Type": "application/json" },
      status: hasError ? 503 : 200,
    });
  });

  vi.stubGlobal("fetch", fetchMock);

  return requestedEndpoints;
}

function renderFilters() {
  const store = createAppStore();

  render(
    <Provider store={store}>
      <I18nextProvider i18n={i18nInstance}>
        <Filters />
      </I18nextProvider>
    </Provider>,
  );

  return store;
}

beforeEach(async () => {
  await i18nInstance.changeLanguage("en");
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Filters", () => {
  it("announces initial loading and replaces it with available options", async () => {
    mockFilterApi();
    renderFilters();

    for (const { name } of FILTER_GROUPS) {
      const group = screen.getByRole("group", { name });

      expect(group).toHaveAttribute("aria-busy", "true");
      expect(within(group).getByRole("status")).toHaveTextContent("Loading options…");
    }

    expect(await screen.findByRole("checkbox", { name: "United States" })).toBeEnabled();
    expect(await screen.findByRole("checkbox", { name: "Cruiser" })).toBeEnabled();
    await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
  });

  it.each(FILTER_GROUPS)(
    "keeps the hardcoded $name options visible while retrying a failed source",
    async ({ endpoint, name, option }) => {
      const user = userEvent.setup();
      const failedEndpoints = new Set([endpoint]);
      const requestedEndpoints = mockFilterApi(failedEndpoints);

      renderFilters();
      const group = screen.getByRole("group", { name });

      expect(await within(group).findByRole("alert")).toHaveTextContent(
        "Could not load filter options.",
      );
      const checkbox = within(group).getByRole("checkbox", { name: option });
      expect(checkbox).toBeEnabled();

      failedEndpoints.delete(endpoint);
      await user.click(within(group).getByRole("button", { name: "Retry" }));

      expect(await within(group).findByRole("checkbox", { name: option })).toBe(checkbox);
      expect(within(group).queryByRole("alert")).not.toBeInTheDocument();
      expect(requestedEndpoints.filter((requested) => requested === endpoint)).toHaveLength(2);
      expect(requestedEndpoints.filter((requested) => requested === "media_path")).toHaveLength(1);
    },
  );

  it.each(FILTER_GROUPS)(
    "announces loading while retrying $name after its first request fails",
    async ({ endpoint, name }) => {
      const user = userEvent.setup();
      let endpointRequests = 0;
      let releaseRetry: ((response: Response) => void) | undefined;
      const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
        const requestUrl = input instanceof Request ? input.url : String(input);
        const requestedEndpoint = new URL(requestUrl, window.location.origin).pathname
          .split("/")
          .filter(Boolean)
          .at(-1);

        if (!requestedEndpoint || !(requestedEndpoint in API_RESPONSES)) {
          throw new Error(`Unexpected filter request: ${requestUrl}`);
        }

        if (requestedEndpoint === endpoint) {
          endpointRequests += 1;

          if (endpointRequests === 1) {
            return new Response(JSON.stringify({ status: "error" }), { status: 503 });
          }

          return await new Promise<Response>((resolve) => {
            releaseRetry = resolve;
          });
        }

        return Response.json(API_RESPONSES[requestedEndpoint]);
      });

      vi.stubGlobal("fetch", fetchMock);
      renderFilters();

      const group = screen.getByRole("group", { name });

      await within(group).findByRole("alert");
      await user.click(within(group).getByRole("button", { name: "Retry" }));

      await waitFor(() => expect(endpointRequests).toBe(2));
      expect(await within(group).findByRole("status")).toHaveTextContent("Loading options…");
      expect(group).toHaveAttribute("aria-busy", "true");
      expect(within(group).queryByRole("alert")).not.toBeInTheDocument();
      expect(within(group).queryByRole("button", { name: "Retry" })).not.toBeInTheDocument();

      await act(async () => {
        releaseRetry?.(Response.json(API_RESPONSES[endpoint]));
      });

      await waitFor(() => expect(group).not.toHaveAttribute("aria-busy"));
      expect(within(group).queryByRole("status")).not.toBeInTheDocument();
    },
  );

  it("keeps both groups usable when media fails and retries the shared request once", async () => {
    const user = userEvent.setup();
    const failedEndpoints = new Set(["media_path"]);
    const requestedEndpoints = mockFilterApi(failedEndpoints);

    renderFilters();
    const nation = await screen.findByRole("checkbox", { name: "United States" });
    const vehicleType = await screen.findByRole("checkbox", { name: "Cruiser" });
    const nations = screen.getByRole("group", { name: "Nations" });
    const classes = screen.getByRole("group", { name: "Vehicle type" });

    expect(await within(nations).findByRole("alert")).toBeInTheDocument();
    expect(await within(classes).findByRole("alert")).toBeInTheDocument();
    await user.click(nation);
    await user.click(vehicleType);
    expect(nation).toBeChecked();
    expect(vehicleType).toBeChecked();

    failedEndpoints.delete("media_path");
    await user.click(within(nations).getByRole("button", { name: "Retry" }));

    await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
    expect(nation).toBeChecked();
    expect(vehicleType).toBeChecked();
    expect(requestedEndpoints.filter((endpoint) => endpoint === "media_path")).toHaveLength(2);
    expect(requestedEndpoints.filter((endpoint) => endpoint === "nations")).toHaveLength(1);
    expect(
      requestedEndpoints.filter((endpoint) => endpoint === "vehicle_types_common"),
    ).toHaveLength(1);
  });

  it.each(FILTER_GROUPS)(
    "retains working $name options when an update fails",
    async ({ endpoint, name, option }) => {
      const user = userEvent.setup();
      const failedEndpoints = new Set<string>();

      mockFilterApi(failedEndpoints);
      const store = renderFilters();
      const checkbox = await screen.findByRole("checkbox", { name: option });

      await user.click(checkbox);
      failedEndpoints.add(endpoint);

      await act(async () => {
        if (endpoint === "nations") {
          await store.dispatch(
            nationsApi.endpoints.getNations.initiate(undefined, {
              forceRefetch: true,
              subscribe: false,
            }),
          );
        } else {
          await store.dispatch(
            vehicleTypesApi.endpoints.getVehicleTypes.initiate(undefined, {
              forceRefetch: true,
              subscribe: false,
            }),
          );
        }
      });

      expect(
        await within(screen.getByRole("group", { name })).findByRole("alert"),
      ).toBeInTheDocument();
      expect(screen.getByRole("checkbox", { name: option })).toBe(checkbox);
      expect(checkbox).toBeChecked();
      expect(checkbox).toBeEnabled();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    },
  );

  it("updates API labels and tooltips when the locale changes after mounting", async () => {
    const user = userEvent.setup();
    const requestedEndpoints = mockFilterApi();

    renderFilters();
    const nation = await screen.findByRole("checkbox", { name: "United States" });
    const vehicleType = await screen.findByRole("checkbox", { name: "Cruiser" });

    await user.click(nation);
    await act(async () => {
      await i18nInstance.changeLanguage("ru");
    });

    expect(screen.getByRole("checkbox", { name: "США" })).toBe(nation);
    expect(screen.getByRole("checkbox", { name: "Крейсер" })).toBe(vehicleType);
    expect(nation.closest("label")?.querySelector("[data-tooltip]")).toHaveAttribute(
      "data-tooltip",
      "США",
    );
    expect(vehicleType.closest("label")?.querySelector("[data-tooltip]")).toHaveAttribute(
      "data-tooltip",
      "Крейсер",
    );
    expect(nation).toBeChecked();
    expect(screen.getByRole("searchbox", { name: "Поиск техники" })).toBeInTheDocument();

    await act(async () => {
      await i18nInstance.changeLanguage("de");
    });

    expect(screen.getByRole("checkbox", { name: "United States" })).toBe(nation);
    expect(screen.getByRole("checkbox", { name: "Kreuzer" })).toBe(vehicleType);
    expect(screen.getByRole("group", { name: "Nationen" })).toBeInTheDocument();
    expect(requestedEndpoints).toHaveLength(3);
  });

  it("connects filter controls to Redux and resets selected values", async () => {
    const user = userEvent.setup();

    mockFilterApi();
    const store = renderFilters();
    const nation = await screen.findByRole("checkbox", { name: "United States" });
    const vehicleType = await screen.findByRole("checkbox", { name: "Cruiser" });
    const tier = screen.getByRole("checkbox", { name: "X" });
    const search = screen.getByRole("searchbox", { name: "Search vehicles" });
    const reset = screen.getByRole("button", { name: "Reset" });

    expect(reset).toBeDisabled();
    await user.type(search, "Yamato");
    await user.click(nation);
    await user.click(vehicleType);
    await user.click(tier);

    await waitFor(() => expect(store.getState().filters.searchTerm).toBe("Yamato"));
    expect(store.getState().filters).toMatchObject({
      nations: { usa: true },
      classes: { Cruiser: true },
      tiers: { 10: true },
      searchTerm: "Yamato",
    });
    expect(nation).toBeChecked();
    expect(vehicleType).toBeChecked();
    expect(tier).toBeChecked();

    await user.click(reset);

    expect(store.getState().filters).toMatchObject({
      nations: { usa: false },
      classes: { Cruiser: false },
      tiers: { 10: false },
      searchTerm: "",
    });
    expect(nation).not.toBeChecked();
    expect(vehicleType).not.toBeChecked();
    expect(tier).not.toBeChecked();
    expect(search).toHaveValue("");
    expect(reset).toBeDisabled();
  });
});
