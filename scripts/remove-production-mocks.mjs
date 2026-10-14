import { rm } from "node:fs/promises";
import { fileURLToPath, URL } from "node:url";

const PRODUCTION_MOCKS_DIRECTORY = fileURLToPath(new URL("../dist/mocks", import.meta.url));

await rm(PRODUCTION_MOCKS_DIRECTORY, { recursive: true, force: true });
