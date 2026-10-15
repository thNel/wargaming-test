import type { NationDto } from "@/services/nations.dto";
import type { VehicleDto } from "@/services/vehicles.dto";
import type { VehicleTypeDto } from "@/services/vehicle-types.dto";

export interface CatalogVehicleSources {
  vehicles: Record<string, VehicleDto>;
  nations: NationDto[];
  vehicleTypes: Record<string, VehicleTypeDto>;
  mediaPath: string;
}
