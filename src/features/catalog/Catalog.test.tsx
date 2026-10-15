import { render, screen, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it, vi } from "vitest";

import { i18nInstance } from "@/shared/i18n";
import { createAppStore } from "@/store";
import { Catalog } from "./Catalog";

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockCatalogFetch() {
  const responses: Record<string, unknown> = {
    vehicles: { status: "ok", data: {} },
    nations: { status: "ok", data: [] },
    vehicle_types_common: { status: "ok", data: {} },
    media_path: { status: "ok", data: "/icons/" },
  };
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const requestUrl = input instanceof Request ? input.url : String(input);
    const endpoint = new URL(requestUrl).pathname.split("/").filter(Boolean).at(-1) ?? "";

    return new Response(JSON.stringify(responses[endpoint]), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  });

  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
}

describe("Catalog", () => {
  it("renders the catalog content in the active locale", async () => {
    const store = createAppStore();
    mockCatalogFetch();

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18nInstance}>
          <Catalog />
        </I18nextProvider>
      </Provider>,
    );

    expect(
      await screen.findByRole("heading", { name: "World of Warships ship catalog" }),
    ).toBeInTheDocument();
    expect(screen.getByText("The ship catalog is being prepared.")).toBeInTheDocument();
    await waitFor(() => expect(store.getState().catalog.status).toBe("succeeded"));
  });

  it("loads catalog data once when mounted, including under StrictMode", async () => {
    const store = createAppStore();
    const fetchMock = mockCatalogFetch();

    render(
      <StrictMode>
        <Provider store={store}>
          <I18nextProvider i18n={i18nInstance}>
            <Catalog />
          </I18nextProvider>
        </Provider>
      </StrictMode>,
    );

    await waitFor(() => expect(store.getState().catalog.status).toBe("succeeded"));
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });
});
