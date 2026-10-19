import type { SupportedLocale } from "@/shared/i18n/supportedLocales";

export type LocaleMap = Readonly<Record<string, string | undefined>>;

export type CatalogStatus = "idle" | "loading" | "succeeded" | "failed";

export interface CatalogLoadState {
  status: CatalogStatus;
}

export interface CatalogVehicleLocales {
  readonly name: LocaleMap;
  readonly shortName: LocaleMap;
  readonly description: LocaleMap;
}

export interface CatalogNation {
  readonly name: string;
  readonly id: number;
  readonly color: number;
  readonly tags: readonly string[];
  readonly locales: LocaleMap;
  readonly icons: Readonly<Record<string, string>>;
}

export interface CatalogVehicleType {
  readonly key: string;
  readonly sort_order: number;
  readonly locales: Readonly<{ name: LocaleMap; shortName: LocaleMap }>;
  readonly icons: Readonly<Record<string, string>>;
}

export type CatalogVehicleClassTooltipKey =
  "vehicleClass" | "premiumVehicleClass" | "specialVehicleClass" | "specialSubmarineClass";

export interface CatalogVehicleCardImage {
  readonly src: string | undefined;
  readonly srcSet: string | undefined;
  readonly sizes: string | undefined;
}

export interface CatalogVehicleCard {
  readonly nameByLocale: Readonly<Record<SupportedLocale, string>>;
  readonly tierLabel: string | number;
  readonly artwork: CatalogVehicleCardImage;
  readonly nationBackdrop: CatalogVehicleCardImage | undefined;
  readonly classIconUrl: string | undefined;
  readonly classTitleByLocale: Readonly<Record<SupportedLocale, string>> | undefined;
  readonly classTooltipKey: CatalogVehicleClassTooltipKey | undefined;
  readonly hasPremiumAppearance: boolean;
}

export interface CatalogVehicle {
  readonly id: string;
  readonly level: number;
  readonly name: string;
  readonly tags: readonly string[];
  readonly locales: CatalogVehicleLocales;
  readonly nation: CatalogNation | null;
  readonly class: CatalogVehicleType | null;
  readonly icons: Readonly<Record<string, string>>;
  readonly card: CatalogVehicleCard;
}

export type CatalogVehicleCollection = readonly CatalogVehicle[];
