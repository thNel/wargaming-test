import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { describe, expect, it } from "vitest";

import { i18nInstance } from "@/shared/i18n";
import type { CatalogVehicle } from "@/store/catalog/catalog.types";

import { VehicleCard } from "./components/VehicleCard";

const vehicle: CatalogVehicle = {
  id: "test-kaga",
  level: 8,
  name: "PJSA518_Kaga",
  tags: ["special"],
  locales: {
    name: { en: "Kaga", ru: "Кага" },
    shortName: { en: "Kaga" },
    description: {},
  },
  nation: {
    id: 1,
    name: "japan",
    color: 0,
    tags: [],
    locales: { en: "Japan", ru: "Япония" },
    icons: { tiny: "/tiny-flag.png", small: "/flag.png" },
  },
  class: {
    key: "AirCarrier",
    sort_order: 5,
    locales: { name: { en: "Aircraft Carrier", ru: "Авианосец" }, shortName: {} },
    icons: { default: "/aircraft-carrier.png" },
  },
  icons: { large: "/kaga.png" },
};

describe("VehicleCard", () => {
  it("shows the localized name, tier, nation backdrop, and class icon", () => {
    const { container } = render(
      <I18nextProvider i18n={i18nInstance}>
        <ul>
          <VehicleCard locale="ru" vehicle={vehicle} />
        </ul>
      </I18nextProvider>,
    );

    expect(screen.getByRole("heading", { name: "Кага" })).toBeInTheDocument();
    expect(screen.getByText("VIII")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Кага" })).toBeInTheDocument();
    expect(container.querySelector('img[src="/flag.png"]')).toBeInTheDocument();
    expect(container.querySelector('img[src="/aircraft-carrier.png"]')).toBeInTheDocument();
  });

  it("falls back to the raw source name when the active locale is unavailable", () => {
    render(
      <I18nextProvider i18n={i18nInstance}>
        <ul>
          <VehicleCard locale="de" vehicle={vehicle} />
        </ul>
      </I18nextProvider>,
    );

    expect(screen.getByRole("heading", { name: "PJSA518_Kaga" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "PJSA518_Kaga" })).toBeInTheDocument();
  });
});
