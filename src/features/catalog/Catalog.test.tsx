import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { describe, expect, it } from "vitest";

import { i18nInstance } from "@/shared/i18n";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/shared/i18n/supportedLocales";
import type { CatalogVehicle } from "@/store/catalog/catalog.types";

import { VehicleCard } from "./components/VehicleCard";

const nameByLocale = Object.fromEntries(
  SUPPORTED_LOCALES.map((locale) => [locale, locale === "ru" ? "Кага" : "PJSA518_Kaga"]),
) as Record<SupportedLocale, string>;

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
    icons: { small: "/small-flag.png", large: "/flag.png" },
  },
  class: {
    key: "AirCarrier",
    sort_order: 5,
    locales: { name: { en: "Aircraft Carrier", ru: "Авианосец" }, shortName: {} },
    icons: { default: "/aircraft-carrier.png" },
  },
  icons: { medium: "/kaga-medium.png", large: "/kaga.png" },
  card: {
    nameByLocale,
    tierLabel: "VIII",
    artwork: {
      src: "/kaga-medium.png",
      srcSet: "/kaga-medium.png 435w, /kaga.png 870w",
      sizes: "auto, (max-width: 700px) 50vw, 25vw",
    },
    nationBackdrop: {
      src: "/flag.png",
      srcSet: "/small-flag.png 117w, /flag.png 694w",
      sizes: "auto, (max-width: 700px) 50vw, 25vw",
    },
    classIconUrl: "/aircraft-carrier.png",
    classTitleByLocale: Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [
        locale,
        locale === "ru" ? "Авианосец" : "Aircraft Carrier",
      ]),
    ) as Record<SupportedLocale, string>,
    classTooltipKey: "vehicleClass",
    hasPremiumAppearance: false,
  },
};

describe("VehicleCard", () => {
  it("shows the localized name, tier, nation backdrop, and class icon", () => {
    const { container } = render(
      <I18nextProvider i18n={i18nInstance}>
        <ul aria-label="Test catalog">
          <VehicleCard locale="ru" vehicle={vehicle} />
        </ul>
      </I18nextProvider>,
    );

    expect(screen.getByRole("heading", { name: "Кага" })).toBeInTheDocument();
    expect(screen.getByText("VIII")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Кага" })).toBeInTheDocument();
    expect(container.querySelector('img[src="/flag.png"]')).toBeInTheDocument();
    expect(container.querySelector('img[src="/aircraft-carrier.png"]')).toBeInTheDocument();
    expect(container.querySelector('img[alt="Кага"]')).toHaveAttribute(
      "srcset",
      "/kaga-medium.png 435w, /kaga.png 870w",
    );
    expect(container.querySelector('img[alt="Кага"]')).toHaveAttribute(
      "sizes",
      "auto, (max-width: 700px) 50vw, 25vw",
    );
    expect(screen.getByRole("img", { name: "Авианосец" })).toBeInTheDocument();
  });

  it("falls back to the raw source name when the active locale is unavailable", () => {
    render(
      <I18nextProvider i18n={i18nInstance}>
        <ul aria-label="Test catalog">
          <VehicleCard locale="de" vehicle={vehicle} />
        </ul>
      </I18nextProvider>,
    );

    expect(screen.getByRole("heading", { name: "PJSA518_Kaga" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "PJSA518_Kaga" })).toBeInTheDocument();
  });
});
