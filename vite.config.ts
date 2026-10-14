import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const LIVE_VORTEX_API_CONFIG = {
  baseUrl: "https://vortex.worldofwarships.eu/api/encyclopedia/en/",
  endpoints: {
    vehicles: "vehicles/",
    nations: "nations/",
    vehicleTypes: "vehicle_types_common/",
    mediaPath: "media_path/",
  },
};

const MOCK_VORTEX_API_CONFIG = {
  baseUrl: "/mocks/vortex/",
  endpoints: {
    vehicles: "vehicles.json",
    nations: "nations.json",
    vehicleTypes: "vehicle-types-common.json",
    mediaPath: "media-path.json",
  },
};

export default defineConfig(({ mode }) => {
  const isMockMode = mode === "mock";

  return {
    publicDir: "public",
    define: {
      VORTEX_API_CONFIG: JSON.stringify(
        isMockMode ? MOCK_VORTEX_API_CONFIG : LIVE_VORTEX_API_CONFIG,
      ),
    },
    plugins: [react()],
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.test.{ts,tsx}"],
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
