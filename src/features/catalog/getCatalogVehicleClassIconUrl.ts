import type { CatalogVehicle } from "@/store/catalog/catalog.types";

export function getCatalogVehicleClassIconUrl(vehicle: CatalogVehicle): string | undefined {
  if (!vehicle.class) {
    return undefined;
  }

  const iconVariant = vehicle.tags.includes("uiPremium")
    ? "premium"
    : vehicle.tags.includes("uiSpecial")
      ? "special"
      : "normal";

  return (
    vehicle.class.icons[iconVariant] ?? vehicle.class.icons.normal ?? vehicle.class.icons.default
  );
}
