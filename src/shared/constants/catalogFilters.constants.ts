import { defineConstants } from "./defineConstants";

export const NATION_KEYS = defineConstants([
  "ussr",
  "japan",
  "usa",
  "uk",
  "germany",
  "france",
  "italy",
  "europe",
  "pan_asia",
  "commonwealth",
  "pan_america",
  "netherlands",
  "spain",
]);

export type NationKey = (typeof NATION_KEYS)[number];

export const VEHICLE_TYPE_KEYS = defineConstants([
  "Cruiser",
  "AirCarrier",
  "Battleship",
  "Destroyer",
  "Submarine",
]);

export type VehicleTypeKey = (typeof VEHICLE_TYPE_KEYS)[number];
