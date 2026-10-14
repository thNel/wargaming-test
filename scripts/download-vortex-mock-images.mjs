import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MOCK_ROOT = resolve(PROJECT_ROOT, "public/mocks/vortex");
const IMAGE_ROOT = resolve(MOCK_ROOT, "images");
const MEDIA_BASE_URL = "https://wows-gloss-icons.wgcdn.co/icons/";
const CONCURRENCY = 8;

async function readMock(fileName) {
  const content = await readFile(resolve(MOCK_ROOT, fileName), "utf8");
  return JSON.parse(content);
}

function collectIconPaths(...records) {
  const paths = new Set();

  for (const record of records) {
    for (const item of record) {
      for (const iconPath of Object.values(item.icons ?? {})) {
        if (typeof iconPath === "string" && iconPath.length > 0) {
          paths.add(iconPath);
        }
      }
    }
  }

  return paths;
}

async function downloadImage(iconPath) {
  if (!/^(vehicle|nation_flags)\/[\w/-]+\.png$/.test(iconPath)) {
    throw new Error(`Unexpected image path: ${iconPath}`);
  }

  const targetPath = resolve(IMAGE_ROOT, ...iconPath.split("/"));
  const relativeTargetPath = targetPath.slice(IMAGE_ROOT.length);

  if (!relativeTargetPath.startsWith(sep)) {
    throw new Error(`Image path escapes mock directory: ${iconPath}`);
  }

  try {
    if ((await stat(targetPath)).size > 0) {
      return "skipped";
    }
  } catch {
    // The asset has not been downloaded yet.
  }

  const response = await fetch(new URL(iconPath, MEDIA_BASE_URL), {
    headers: {
      Referer: "https://armory.worldofwarships.eu/",
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${iconPath}`);
  }

  if (!response.headers.get("content-type")?.startsWith("image/")) {
    throw new Error(`Unexpected content type for ${iconPath}`);
  }

  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, Buffer.from(await response.arrayBuffer()));
  return "downloaded";
}

const [vehicles, nations, vehicleTypes] = await Promise.all([
  readMock("vehicles.json"),
  readMock("nations.json"),
  readMock("vehicle-types-common.json"),
]);

const allPaths = collectIconPaths(
  Object.values(vehicles.data),
  nations.data,
  Object.values(vehicleTypes.data),
);
const clientOnlyPaths = [...allPaths].filter((iconPath) => iconPath.startsWith("gui/"));
const downloadablePaths = [...allPaths].filter((iconPath) => !iconPath.startsWith("gui/"));
const failures = [];
let downloaded = 0;
let skipped = 0;
let nextIndex = 0;

await mkdir(IMAGE_ROOT, { recursive: true });

async function runWorker() {
  while (nextIndex < downloadablePaths.length) {
    const iconPath = downloadablePaths[nextIndex];
    nextIndex += 1;

    try {
      if ((await downloadImage(iconPath)) === "downloaded") {
        downloaded += 1;
      } else {
        skipped += 1;
      }
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, () => runWorker()));

console.log(`Downloaded: ${downloaded}; already present: ${skipped}`);
console.log(`Skipped game-client GUI paths: ${clientOnlyPaths.length}`);

if (failures.length > 0) {
  console.error(`Failed to download ${failures.length} image(s):`);
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
