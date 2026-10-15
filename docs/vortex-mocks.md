# Local Vortex API snapshots

These files are local fixtures based on the four Vortex Encyclopedia API responses supplied with the World of Warships home task. The source responses were retrieved on **2026-10-14**. The vehicle fixture contains a curated sample of 25 ships spanning all five classes; every selected ship retains its full API record and the original `{ status, data }` response shape. The nations, vehicle types, and media path fixtures retain their observed responses.

| Local file                                                                      | Source endpoint                                                                                        | `data` records |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------: |
| [`vehicles.json`](../public/mocks/vortex/vehicles.json)                         | [`vehicles/`](https://vortex.worldofwarships.eu/api/encyclopedia/en/vehicles/)                         |             25 |
| [`nations.json`](../public/mocks/vortex/nations.json)                           | [`nations/`](https://vortex.worldofwarships.eu/api/encyclopedia/en/nations/)                           |              6 |
| [`vehicle_types_common.json`](../public/mocks/vortex/vehicle_types_common.json) | [`vehicle_types_common/`](https://vortex.worldofwarships.eu/api/encyclopedia/en/vehicle_types_common/) |              5 |
| [`media_path.json`](../public/mocks/vortex/media_path.json)                     | [`media_path/`](https://vortex.worldofwarships.eu/api/encyclopedia/en/media_path/)                     |   Scalar value |

The files and downloaded web icons are under Vite's `public` directory, so they can be loaded locally without importing fixture data into the JavaScript bundle. The nations fixture contains only the six nations represented by the selected ships. The mock `media_path.json` points to `/mocks/vortex/images/`, where the downloaded image files preserve the relative paths from the API. Run `npm run mocks:images` after cloning to download the ignored image files.

The current fixtures contain 209 CDN-backed images, downloaded under `images/`. The API also returns 139 unique `gui/...` paths for `local_*` icons. These are game-client resources, not files hosted by the encyclopedia icon CDN, so the download script skips them. Use the standard `small`, `medium`, `large`, and contour icon paths in the web app.

Once the Vite app is present, the corresponding data paths are:

```text
/mocks/vortex/vehicles.json
/mocks/vortex/nations.json
/mocks/vortex/vehicle_types_common.json
/mocks/vortex/media_path.json
```

## Runtime mode

The default Vite `development` and `production` modes request data from the live Vortex API. Use Vite's `mock` mode to serve the local snapshots instead:

| Command              | Data source     |
| -------------------- | --------------- |
| `npm run dev`        | Live Vortex API |
| `npm run build`      | Live Vortex API |
| `npm run dev:mock`   | Local snapshots |
| `npm run build:mock` | Local snapshots |

Every API service requests the same-origin `/api/...` path. In live development mode, Vite proxies that path to the Vortex API. In `mock` development mode, Vite rewrites it to the matching file under `public/mocks/vortex/`. This routing applies to the Vite development server; build and deployment routing are configured separately.

Example:

```ts
const response = await fetch(`${import.meta.env.BASE_URL}mocks/vortex/vehicles.json`);
if (!response.ok) {
  throw new Error(`Failed to load local vehicle snapshot: ${response.status}`);
}

const payload = await response.json();
if (payload.status !== "ok") {
  throw new Error("The local vehicle snapshot has an unexpected API status");
}
```

These files are a point-in-time snapshot, not a live API mirror. Refresh them from the source endpoints when current game data is needed. The API can add, remove, or change records and fields; application code should not hard-code the observed record counts.

See [Vortex API response structures](vortex-api.md) for field definitions, relationships, image paths, and catalog-specific notes.
