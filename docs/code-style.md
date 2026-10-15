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
- Primitive constants and frozen values use UPPER_SNAKE_CASE. Mutable objects and instances use camelCase. Constants should be declared outside component bodies, before the component, or moved into shared constants when reused.
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
- Keep a large component's local child components beside it in a `components/` subdirectory. One local child-component level is allowed; do not create a chain such as `A/components/B/components/C`.
- Place a hook beside the component it serves when it is local to that component. Place feature-level hooks in the feature's `hooks/` folder and cross-feature hooks in `src/shared/hooks/`.
- Separate component presentation from feature logic by moving state, effects, data access, and handlers into hooks when that improves clarity.
- Do not pass inline functions or `.bind()` expressions to JSX props. Define a named handler and pass it to the component.
- Prefer semantic HTML elements and ensure interactive controls work with keyboard and assistive technology.
- Keep components and functions focused on their product or domain responsibility. Avoid mixing them with development/runtime infrastructure such as API contracts, service setup, store wiring, or configuration; move that infrastructure into dedicated modules and keep component and function bodies free of unrelated setup details.

## Localization

- Use one shared i18next instance for the application.
- Keep each feature's translation files in a `locales/` directory beside that feature's root, for example `src/features/catalog/locales/`.
- Give each large feature or page its own namespace and provide a dictionary for every supported locale in that feature's `locales/` directory.
- Supported locales follow the Vortex API codes: `cs`, `de`, `en`, `es`, `es_mx`, `fr`, `it`, `ja`, `ko`, `nl`, `pl`, `pt_br`, `ru`, `th`, `tr`, `uk`, `zh_cn`, `zh_sg`, and `zh_tw`.
- Register feature dictionaries in the shared i18next resource store, keyed by locale and namespace. The central registry imports feature-owned dictionaries; it does not contain their translation text. Keep namespaces unique so registering one feature does not replace another feature's resources.
- Set a feature's namespace as the default namespace for its React subtree using the shared i18next instance. Descendant components inherit that namespace unless they explicitly request another one.
- Shared components should receive user-facing text through props when practical. If a shared component owns fixed labels, keep its dictionaries beside that component under its own `locales/` directory and use its namespace explicitly.
- On startup, prefer a supported locale saved in `localStorage`. If none is available, map the browser's preferred locale to a supported Vortex locale and fall back to English when there is no match. Save the resolved locale, including an automatically detected locale, and persist later manual language changes to `localStorage`.
- Use the active locale for both UI translations and localized Vortex fields. Normalize browser locale formats such as `pt-BR` to Vortex codes such as `pt_br`.
- These are architecture and completeness conventions; ESLint and Prettier do not currently validate dictionary placement, namespace ownership, or translation coverage.

## API types and data transformation

- DTOs are TypeScript interfaces describing API request and response contracts.
- Keep API request and response DTOs in a sibling `*.dto.ts` file rather than declaring them in the service module (for example, `shipsApi.ts` and `ships.dto.ts`). Use `*.types.ts` for other module-specific types that are not API DTOs.
- If data transformation is needed, use a clearly named mapper, adapter, or parser. Do not call transformation code a DTO.
- Preserve API field names in API contract types. Convert to local naming only when creating a separate application model.

## Commit messages

- Use the format `type(scope): description`; the scope is optional.
- The type is required and must be one of `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `build`, `ci`, `perf`, or `revert`.
- Write the description in English and in the passive voice.
- Commitlint enforces the type and message structure. English wording and passive voice are reviewed as team conventions because they cannot be reliably validated by the configured commit-message linter.
- Do not add task-reference footers or breaking-change markers for this project.

## Checks

- The pre-commit hook runs `lint-staged`: ESLint with automatic fixes and Prettier on staged code files; Prettier formats staged CSS, HTML, JSON, and Markdown files. Tests and type checking are not run during commit.
- `npm test` runs Vitest unit and component tests once. Tests use React Testing Library, `user-event`, and `jest-dom`; keep assertions focused on observable behavior and use local fixture data.
- `npm run test:e2e` runs Playwright against a dedicated Vite `mock` mode server. Install its Chromium browser once with `npx playwright install chromium`.
- The test scripts can also be run directly with `npm test` and `npm run test:e2e`. There is no watch-mode script and no MSW dependency; tests do not call the live Vortex API.
- `npm run build` runs TypeScript project builds (`tsc -b`) and Vite bundling; it checks types and production compilation but does not replace behavioral tests.
- GitHub Actions runs lint, formatting checks, regular and mock production builds (including TypeScript checking), unit/component tests, and Playwright e2e tests on pushes to `main` and pull requests.
- The commit-message hook runs Commitlint. It validates the configured Conventional Commit type and subject structure; it does not run type checking, builds, or tests.
