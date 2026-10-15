export interface VehicleTypeDto {
  icons: Record<string, string>;
  localization: {
    mark: Record<string, string>;
    shortmark: Record<string, string>;
  };
  sort_order: number;
}
