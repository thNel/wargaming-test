import { act, render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { i18nInstance } from "@/shared/i18n";
import { createAppStore } from "@/store";

import { Main } from "./Main";

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
      {
        name: "japan",
        icons: { tiny: "japan.png" },
        color: 0,
        tags: [],
        localization: { mark: { en: "Japan", ru: "Япония" } },
        id: 2,
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
  vehicles: {
    status: "ok",
    data: {
      "3751786192": {
        level: 8,
        name: "PJSA518_Kaga",
        icons: { large: "vehicle/large/kaga.png" },
        tags: ["Cruiser", "special"],
        localization: {
          mark: { en: "Kaga", ru: "Кага" },
          shortmark: { en: "Kaga", ru: "Кага" },
          description: {},
        },
        nation: "japan",
      },
    },
  },
});

function mockApiFetch() {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const requestUrl = input instanceof Request ? input.url : String(input);
    const endpoint = new URL(requestUrl, window.location.origin).pathname
      .split("/")
      .filter(Boolean)
      .at(-1);

    return new Response(JSON.stringify(API_RESPONSES[endpoint ?? ""]), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  });

  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
}

function renderMainPage() {
  const store = createAppStore();

  render(
    <Provider store={store}>
      <I18nextProvider i18n={i18nInstance}>
        <Main />
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

describe("main page", () => {
  it("renders the page heading, filters, and catalog cards", async () => {
    mockApiFetch();
    renderMainPage();

    expect(await screen.findByRole("heading", { name: "Fleet catalog" })).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Filters" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Kaga" })).toBeInTheDocument();
  });

  it("uses the active locale for visible and accessible filter labels", async () => {
    await i18nInstance.changeLanguage("ru");
    mockApiFetch();
    renderMainPage();

    expect(await screen.findByRole("heading", { name: "Каталог флота" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Кага" })).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Фильтры" })).toBeInTheDocument();
    expect(
      await screen.findByRole("checkbox", { name: "Показывать скрытые корабли" }),
    ).toBeInTheDocument();
    expect(await screen.findByRole("checkbox", { name: "США" })).toBeInTheDocument();
  });

  it("updates visible and accessible names after switching language on the mounted page", async () => {
    mockApiFetch();
    renderMainPage();

    expect(await screen.findByRole("checkbox", { name: "United States" })).toBeInTheDocument();
    expect(await screen.findByRole("checkbox", { name: "Cruiser" })).toBeInTheDocument();

    await act(async () => {
      await i18nInstance.changeLanguage("ru");
    });

    expect(screen.getByRole("heading", { name: "Каталог флота" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Каталог флота" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "США" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Крейсер" })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("ru");
  });
});
