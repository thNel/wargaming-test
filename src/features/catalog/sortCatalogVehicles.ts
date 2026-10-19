import { getLanguageTag } from "@/shared/i18n/locale.utils";
import type { SupportedLocale } from "@/shared/i18n/supportedLocales";
import type { CatalogVehicle, CatalogVehicleCollection } from "@/store/catalog/catalog.types";
import { getCatalogVehicleName } from "@/store/catalog/getCatalogVehicleName";

import type { CatalogSortDirection, CatalogSortMode } from "./catalog.types";

export function sortCatalogVehicles(
  vehicles: CatalogVehicleCollection,
  mode: CatalogSortMode,
  direction: CatalogSortDirection,
  locale: SupportedLocale,
): CatalogVehicle[] {
  if (mode === "default") {
    return [...vehicles];
  }

  const multiplier = direction === "descending" ? -1 : 1;
  const nameCollator =
    mode === "name"
      ? new Intl.Collator(getLanguageTag(locale), { sensitivity: "base" })
      : undefined;

  return [...vehicles].sort((first, second) => {
    let comparison = first.level - second.level;

    if (mode === "name") {
      comparison =
        nameCollator?.compare(
          getCatalogVehicleName(first, locale),
          getCatalogVehicleName(second, locale),
        ) ?? 0;
    }

    return comparison * multiplier || first.id.localeCompare(second.id);
  });
}
