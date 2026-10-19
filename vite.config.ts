import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  const isMockMode = mode === "mock";

  return {
    publicDir: "public",
    plugins: [react()],
    server: {
      port: isMockMode ? 4173 : undefined,
      strictPort: isMockMode,
      proxy: {
        "/api": isMockMode
          ? {
              target: "http://127.0.0.1:4173/mocks",
              rewrite: (path) => path.replace(/^\/api/, "/vortex").replace(/\/$/, ".json"),
            }
          : {
              target: "https://vortex.worldofwarships.eu",
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, "/api/encyclopedia/en"),
            },
      },
    },
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
