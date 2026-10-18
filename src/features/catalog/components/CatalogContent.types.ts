import type { SupportedLocale } from "@/shared/i18n/supportedLocales";
import type { CatalogStatus, CatalogVehicleCollection } from "@/store/catalog/catalog.types";

export interface CatalogContentProps {
  locale: SupportedLocale;
  onRetry: () => void;
  status: CatalogStatus;
  vehicles: CatalogVehicleCollection;
}
