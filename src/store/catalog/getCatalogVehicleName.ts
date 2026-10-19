import type { SupportedLocale } from "@/shared/i18n/supportedLocales";

import type { CatalogVehicle } from "./catalog.types";

export function getCatalogVehicleName(vehicle: CatalogVehicle, locale: SupportedLocale): string {
  return vehicle.card.nameByLocale[locale];
}
