# Code Style and Project Conventions

This document describes conventions that are useful for review but are not fully enforced by ESLint or Prettier. Automated checks are configured separately in `eslint.config.js`, `.prettierrc.json`, and the Git hooks.

## Formatting

- Use double quotes and semicolons.
- Keep formatted lines within 100 characters where practical; Prettier wraps longer expressions.
- Use two spaces for indentation.
- In JSX, write string props and text children without unnecessary curly braces: `<Button variant="outline">Save</Button>`.
- Keep JSX element values in props inside curly braces: `<Panel content={<Content />} />`.

## Naming

- Interfaces and type aliases use PascalCase. Do not prefix interface names with `I`.
- Enum members use PascalCase.
- Variables and functions use camelCase. Do not use PascalCase for variables.
- Primitive constants and frozen values use UPPER_SNAKE_CASE. Mutable objects and instances use camelCase. Keep static component constants in a separate `*.constants.ts` module, including constants used by only one component. Use the shared `defineConstants` factory for static lists and maps. Values derived from props, state, or hooks belong in the component or its hook.
- A leading underscore is reserved for values that are intentionally unused for now. Other leading and trailing underscores are not allowed.
- Hooks begin with `use` and use camelCase after that prefix. Every hook must declare its return type.
- Component files and component names use PascalCase.

## Imports

- Use relative imports for files in the current directory or a child directory.
- Do not traverse three or more parent directories with `../`; use a configured alias or revisit the file structure.
- Avoid duplicate imports from the same module. Keep type imports inline with value imports where appropriate.
- Import sorting groups have not been standardized yet; Prettier import sorting is not configured.

## React components and hooks

- Prefer named exports for components, hooks, utilities, and Redux slices. Default exports may be used when they make a specific module clearer; they are not required by convention.
- Keep reusable components and hooks under `src/shared/` when they are used by multiple features.
- Keep feature-specific components, hooks, and constants within that feature.
- Keep component props and other module-specific types in sibling `*.types.ts` files.
- Keep a large component's local child components beside it in a `components/` subdirectory. One local child-component level is allowed; do not create a chain such as `A/components/B/components/C`.
- Place a hook beside the component it serves when it is local to that component. Place feature-level hooks in the feature's `hooks/` folder and cross-feature hooks in `src/shared/hooks/`.
- Separate component presentation from feature logic by moving state, effects, data access, and handlers into hooks when that improves clarity.
- Do not pass inline functions or `.bind()` expressions to JSX props. Define a named handler and pass it to the component.
- Prefer semantic HTML elements and ensure interactive controls work with keyboard and assistive technology.
- Keep components and functions focused on their product or domain responsibility. Avoid mixing them with development/runtime infrastructure such as API contracts, service setup, store wiring, or configuration; move that infrastructure into dedicated modules and keep component and function bodies free of unrelated setup details.
- Pages compose ready feature components. Keep temporary feature placeholders inside their owning features. The main page owns its header and language drawer under `src/pages/main/components/`.
- Each filter group owns its options, handlers, and store subscriptions. Do not pass options or handlers through a parent that only composes those groups.
- The filters feature may share a `FilterGroup` shell for its common `fieldset` and `legend`; each concrete group owns its content and internal layout.
- The header owns the language drawer's local open state; `LanguageDrawer` owns language selection; the shared `Drawer` owns presentation and receives state, callbacks, and labels through props.
- The current filter groups render once per page. Use stable explicit IDs for their labels; do not add `useId` solely to support unneeded duplicate instances.

## Styles and shared UI

- Use CSS Modules (`*.module.css`) for component styles. Each component owns its markup and internal styling. A parent may pass an explicit `className` to a child for a targeted root override; it must not reach into the child's internal elements with descendant selectors.
- Keep application theme variables, base text color, background, and viewport height in `src/index.css`. Use the document's global scrollbar for the page and catalog. The global `user-select: none` is intentional.
- Use `classnames` to compose classes.
- Keep SVG resources in `public/` instead of creating inline SVG component helpers.
- Render every application `<img>` through the shared `Image` for its skeleton and error fallback. The consumer owns the loading strategy through the `loading` prop; use `loading="lazy"` for catalog images. A deployment must proxy image sources in its hosting configuration; the route and implementation are deployment-specific. Local development may use Vite's proxy.
- `Skeleton` has its own explicit props rather than inheriting all span attributes. Its dimension props are named `w` and `h`; inline styles are allowed for those dimensions. Do not explicitly pass the default `w="100%"`. The component owns its radius and appearance; do not pass field borders or radius overrides from parents.
- Keep shared checkbox appearance in `Checkbox.module.css`; filter groups own the surrounding labels and layout.
- Tooltips open on pointer hover and keyboard focus. Do not add touch long-press behavior; touch users can use the filter icons visually.

## Localization

- Use one shared i18next instance for the application.
- Keep translation files beside the feature or page that owns the text, for example `src/features/catalog/locales/` or `src/pages/main/locales/`. Page headings and shell copy belong to the page namespace, not to a feature merely displayed on that page.
- Give each large feature or page its own namespace and provide a dictionary for every supported locale in that feature's `locales/` directory.
- Supported locales follow the Vortex API codes: `cs`, `de`, `en`, `es`, `es_mx`, `fr`, `it`, `ja`, `ko`, `nl`, `pl`, `pt_br`, `ru`, `th`, `tr`, `uk`, `zh_cn`, `zh_sg`, and `zh_tw`.
- Register page and feature dictionaries in the shared i18next resource store, keyed by locale and namespace. The central registry imports dictionaries from their owning page or feature; it does not contain their translation text. Keep namespaces unique so registering one owner does not replace another owner's resources.
- Request the owning page or feature namespace explicitly with `useTranslation(namespace)` when a component needs translated values. A subtree provider may set that namespace as the default; descendants inherit it only when configured.
- A React component that must rerender when the language changes should subscribe with `useTranslation(namespace)` and render translated values with `t(...)`. Do not depend on unrelated state updates to refresh translated text.
- Shared components should receive user-facing text through props when practical. If a shared component owns fixed labels, keep its dictionaries beside that component under its own `locales/` directory and use its namespace explicitly.
- On startup, prefer a supported locale saved in `localStorage`. If none is available, map the browser's preferred locale to a supported Vortex locale and fall back to English when there is no match. Save the resolved locale, including an automatically detected locale, and persist later manual language changes to `localStorage`.
- Use the active locale for both UI translations and localized Vortex fields. Normalize browser locale formats such as `pt-BR` to Vortex codes such as `pt_br`.
- Preserve edited translation text and removed keys. Keep all supported dictionaries aligned with the owning namespace's structure; do not restore earlier copy while making unrelated changes.
- Accessible names should use the visible localized label or translated text where a separate name is needed. Do not hide real labels and duplicate them in English to satisfy a linter. Do not reintroduce accessibility ESLint plugins or suppression comments as a workaround for dynamic translations.
- These are architecture and completeness conventions; ESLint and Prettier do not currently validate dictionary placement, namespace ownership, or translation coverage.

## API types and data transformation

- DTOs are TypeScript interfaces describing API request and response contracts.
- Keep API request and response DTOs in a sibling `*.dto.ts` file rather than declaring them in the service module (for example, `vehiclesApi.ts` and `vehicles.dto.ts`). Use `*.types.ts` for other module-specific types that are not API DTOs.
- If data transformation is needed, use a clearly named mapper, adapter, or parser. Do not call transformation code a DTO.
- Preserve API field names in API contract types. Convert to local naming only when creating a separate application model.

## Store and catalog data

- Keep shared application data and its processing in `src/store/`; UI features consume that state. Use the chosen `Vehicle` terminology consistently in the application model.
- Keep the four Vortex services as independent RTK Query API slices so they can have different cache and invalidation policies. Share common transport and response validation through the API factory.
- Keep orchestration of the four catalog sources and error processing in a dedicated loader. Collect settled requests with `Promise.allSettled` and process rejected results in one pass. Avoid result wrappers, repetitive per-source error branches, and casts that only compensate for an unnecessarily complicated abstraction.
- Redux owns the complete normalized catalog, loading status, and errors. Do not introduce a second catalog cache inside a singleton or class. Choose ordinary functions when an object has no meaningful state or lifecycle.
- Publish a complete catalog only after all required sources succeed and normalization finishes. Preserve the last successful catalog when a later load fails.
- Derive active-filter state by comparing it with the initial filter state. Prepare filter criteria in selectors and keep the catalog filtering algorithm independent from the UI's boolean maps.
- Search and sort by the active locale's full vehicle name, falling back directly to the original `vehicle.name` when that translation is missing. Do not insert English translation or short-name fallbacks into filtering or sorting. Debounce only search text (750 ms); apply discrete filter changes immediately. Normalize the search term at the filtering boundary. Do not search internal IDs or descriptions instead of the text shown to the user.
- Use RTK/Immer's existing immutability guarantees; do not add recursive freezing machinery without a concrete need.

## Commit messages

- Use the format `type(scope): description`; the scope is optional.
- The type is required and must be one of `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `build`, `ci`, `perf`, or `revert`.
- Write the description in English and in the passive voice.
- Commitlint enforces the type and message structure. English wording and passive voice are reviewed as team conventions because they cannot be reliably validated by the configured commit-message linter.
- Do not add task-reference footers or breaking-change markers for this project.

## Checks

- The pre-commit hook runs `lint-staged`: ESLint with automatic fixes and Prettier on staged code files; Prettier formats staged CSS, HTML, JSON, and Markdown files. Tests and type checking are not run during commit.
- `npm test` runs Vitest unit and component tests once. Tests use React Testing Library, `user-event`, and `jest-dom`; keep assertions focused on observable behavior and use local fixture data.
- Organize tests by the page, feature, or shared component whose behavior they verify. Main-page headings belong in main-page tests; header language switching belongs in language-drawer tests. Catalog tests should not own unrelated page-shell behavior. Cover the filter UI together with its Redux slice.
- `npm run test:e2e` runs Playwright against a dedicated Vite `mock` mode server. Install its Chromium browser once with `npx playwright install chromium`.
- Playwright runs two workers by default to keep the browser suite stable on local machines and CI. Override the worker count explicitly when profiling a different environment.
- The test scripts can also be run directly with `npm test` and `npm run test:e2e`. There is no watch-mode script and no MSW dependency; tests do not call the live Vortex API.
- `npm run build` runs TypeScript project builds (`tsc -b`) and Vite bundling; it checks types and production compilation but does not replace behavioral tests.
- GitHub Actions runs lint, formatting checks, regular and mock production builds (including TypeScript checking), unit/component tests, and Playwright e2e tests on pushes to `main` and pull requests.
- The commit-message hook runs Commitlint. It validates the configured Conventional Commit type and subject structure; it does not run type checking, builds, or tests.
