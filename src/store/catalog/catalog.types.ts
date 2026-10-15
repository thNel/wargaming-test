export type LocaleMap = Readonly<Record<string, string>>;

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

export interface CatalogVehicle {
  readonly id: string;
  readonly level: number;
  readonly name: string;
  readonly tags: readonly string[];
  readonly locales: CatalogVehicleLocales;
  readonly nation: CatalogNation | null;
  readonly class: CatalogVehicleType | null;
  readonly icons: Readonly<Record<string, string>>;
}

export type CatalogVehicleCollection = readonly CatalogVehicle[];
