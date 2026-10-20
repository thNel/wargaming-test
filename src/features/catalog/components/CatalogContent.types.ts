import type { SupportedLocale } from "@/shared/i18n/supportedLocales";
import type {
  CatalogStatus,
  CatalogVehicle,
  CatalogVehicleCollection,
} from "@/store/catalog/catalog.types";

export interface CatalogContentProps {
  locale: SupportedLocale;
  onRetry: () => void;
  onVehicleSelect: (vehicle: CatalogVehicle) => void;
  status: CatalogStatus;
  vehicles: CatalogVehicleCollection;
}
