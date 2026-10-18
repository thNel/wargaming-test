import type { SupportedLocale } from "@/shared/i18n/supportedLocales";
import type { CatalogVehicle } from "@/store/catalog/catalog.types";

export interface VehicleCardProps {
  locale: SupportedLocale;
  vehicle: CatalogVehicle;
}
