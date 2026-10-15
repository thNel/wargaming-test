export interface VehicleDto {
  level: number;
  name: string;
  icons: Record<string, string>;
  tags: string[];
  localization: {
    mark: Record<string, string>;
    shortmark: Record<string, string>;
    description: Record<string, string>;
  };
  nation: string;
}
