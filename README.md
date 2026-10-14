# World of Warships Ship Catalog

A React, TypeScript, and Vite starter for the World of Warships home task.

## Application foundations

- i18next initialization is under `src/shared/i18n/`; dictionary placement and locale rules are documented in [the code style guide](docs/code-style.md#localization).
- Redux Toolkit and RTK Query are configured in `src/app/store.ts` and `src/shared/api/vortexApi.ts`.
- RTK Query uses the live Vortex API in normal development and production modes, and local snapshots in mock mode.
- Vite serves files from `public/` in development. The regular production build removes `dist/mocks/` after bundling while keeping the brand logos; the mock build keeps the snapshots.

## Development

```sh
npm install
npm run dev
```

The default `development` and `production` modes use the live Vortex API. To work with the local API snapshots, start the app in `mock` mode:

```sh
npm run dev:mock
```

To build the app with snapshots, run `npm run build:mock`. The regular `npm run build` continues to build against the live API. Vite selects and injects the endpoint configuration in `vite.config.ts`; the snapshots are in `public/mocks/vortex/`.

## Available scripts

- `npm run dev` starts the Vite development server.
- `npm run dev:mock` starts Vite with local mock data.
- `npm run build` type-checks and builds the app for production, then removes `dist/mocks/`.
- `npm run build:mock` type-checks and builds with local mock data.
- `npm test` runs unit and component tests once with Vitest.
- `npm run test:e2e` runs browser end-to-end tests with Playwright against the mock mode.
- `npm run lint` runs ESLint.
- `npm run format` formats supported project files with Prettier.
- `npm run format:check` checks formatting without modifying files.
- `npm run preview` serves the production build locally.

GitHub Actions runs lint, formatting checks, type-checking and production builds, unit/component tests, and Playwright e2e tests for pushes to `main` and pull requests. The pre-commit hook only checks staged files with ESLint and Prettier.

ESLint handles code-quality rules. Prettier handles formatting, with conflicting ESLint formatting rules disabled. The large Vortex snapshots are excluded from formatting.

## Project resources

- [Code style and project conventions](docs/code-style.md)
- [Vortex API response structures](docs/vortex-api.md)
- [Local Vortex API snapshots](docs/vortex-mocks.md)
- The app uses snapshots from `public/mocks/vortex/` only in mock mode. Vite serves the files from `public/` during development, while the regular production build removes `dist/mocks/`.

Install the Playwright Chromium browser once before running e2e tests:

```sh
npx playwright install chromium
```
