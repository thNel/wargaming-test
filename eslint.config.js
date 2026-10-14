import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import a11yinspect from "@barrierbreak/eslint-plugin-a11yinspect";
import stylistic from "@stylistic/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const sourceRoot = path.join(projectRoot, "src");

const noAliasLocalImportsRule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer relative imports for files in the current or a child directory",
    },
    schema: [],
    messages: {
      useRelative:
        "Use a relative import for a file in the current or a child directory ({{importPath}}).",
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        if (typeof importPath !== "string") {
          return;
        }

        let targetPath;

        if (importPath.startsWith("@/")) {
          targetPath = path.resolve(sourceRoot, importPath.slice(2));
        } else if (importPath.startsWith("src/")) {
          targetPath = path.resolve(sourceRoot, importPath.slice(4));
        } else {
          return;
        }

        const relativePath = path.relative(path.dirname(context.filename), targetPath);
        const pointsToCurrentOrChildDirectory =
          relativePath === "" ||
          (relativePath !== ".." &&
            !relativePath.startsWith(`..${path.sep}`) &&
            !path.isAbsolute(relativePath));

        if (pointsToCurrentOrChildDirectory) {
          context.report({
            node: node.source,
            messageId: "useRelative",
            data: { importPath },
          });
        }
      },
    };
  },
};

const moduleConstantCaseRule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Use UPPER_SNAKE_CASE for module-level constants and frozen objects",
    },
    schema: [],
    messages: {
      useUpperSnakeCase:
        "Use UPPER_SNAKE_CASE for module-level constants and Object.freeze values.",
      reserveUpperSnakeCase:
        "UPPER_SNAKE_CASE is reserved for module-level constants and Object.freeze values.",
    },
  },
  create(context) {
    const isUpperSnakeCase = (name) => /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/.test(name);
    const isFunctionValue = (initializer) =>
      initializer?.type === "ArrowFunctionExpression" || initializer?.type === "FunctionExpression";
    const isFrozenValue = (initializer) =>
      initializer?.type === "CallExpression" &&
      initializer.callee.type === "MemberExpression" &&
      initializer.callee.object.type === "Identifier" &&
      initializer.callee.object.name === "Object" &&
      initializer.callee.property.type === "Identifier" &&
      initializer.callee.property.name === "freeze";
    const isModuleLevelDeclaration = (declaration) => {
      let owner = declaration.parent;

      if (owner.type === "ExportNamedDeclaration") {
        owner = owner.parent;
      }

      return owner.type === "Program";
    };

    return {
      VariableDeclarator(node) {
        if (node.id.type !== "Identifier") {
          return;
        }

        const name = node.id.name;

        // A leading underscore is the explicit marker for intentionally unused values.
        if (name.startsWith("_")) {
          return;
        }

        const declaration = node.parent;
        const isModuleConstant =
          declaration.kind === "const" &&
          isModuleLevelDeclaration(declaration) &&
          !isFunctionValue(node.init);
        const isFrozenObject = isFrozenValue(node.init);
        const isConstantName = isUpperSnakeCase(name);

        if ((isModuleConstant || isFrozenObject) && !isConstantName) {
          context.report({ node: node.id, messageId: "useUpperSnakeCase" });
          return;
        }

        if (isConstantName && !isModuleConstant && !isFrozenObject) {
          context.report({ node: node.id, messageId: "reserveUpperSnakeCase" });
        }
      },
    };
  },
};

const unusedVariableOptions = {
  args: "all",
  argsIgnorePattern: "^_",
  varsIgnorePattern: "^_",
  caughtErrors: "all",
  caughtErrorsIgnorePattern: "^_",
  destructuredArrayIgnorePattern: "^_",
  ignoreRestSiblings: true,
};

export default defineConfig([
  globalIgnores(["dist", "coverage", "node_modules"]),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    plugins: {
      import: importPlugin,
      local: {
        rules: {
          "no-alias-local-imports": noAliasLocalImportsRule,
          "module-constant-case": moduleConstantCaseRule,
        },
      },
    },
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "no-unused-vars": ["error", unusedVariableOptions],
      "no-restricted-syntax": [
        "error",
        {
          selector: "FunctionDeclaration[id.name=/^use[A-Z]/]:not([returnType])",
          message: "Hooks named use* must declare an explicit return type.",
        },
        {
          selector:
            "VariableDeclarator[id.type='Identifier'][id.name=/^use[A-Z]/] > ArrowFunctionExpression:not([returnType])",
          message: "Hooks named use* must declare an explicit return type.",
        },
        {
          selector:
            "VariableDeclarator[id.type='Identifier'][id.name=/^use[A-Z]/] > FunctionExpression:not([returnType])",
          message: "Hooks named use* must declare an explicit return type.",
        },
      ],
      "react-hooks/rules-of-hooks": "error",
      "import/no-duplicates": ["error", { "prefer-inline": true }],
      "no-case-declarations": "error",
      "no-useless-catch": "error",
      "no-unsafe-optional-chaining": "error",
      "no-constant-binary-expression": "error",
      "no-useless-escape": "error",
      "no-prototype-builtins": "error",
      "no-empty": ["error", { allowEmptyCatch: false }],
    },
  },
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^(\\.\\./){3,}",
              message:
                "Use an alias or restructure the import instead of traversing three or more parents.",
            },
          ],
        },
      ],
      "local/no-alias-local-imports": "error",
      "local/module-constant-case": "error",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommended],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", unusedVariableOptions],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          modifiers: ["unused"],
          format: ["camelCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
          trailingUnderscore: "forbid",
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"],
          leadingUnderscore: "forbid",
          trailingUnderscore: "forbid",
        },
        {
          selector: "parameter",
          modifiers: ["unused"],
          format: ["camelCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "forbid",
        },
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "forbid",
          trailingUnderscore: "forbid",
        },
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: {
            regex: "^I[A-Z]",
            match: false,
          },
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "enumMember",
          format: ["PascalCase"],
        },
      ],
    },
  },
  eslintConfigPrettier,
  {
    files: ["src/**/*.{jsx,tsx}"],
    plugins: {
      a11yinspect,
      "@stylistic": stylistic,
    },
    rules: {
      ...a11yinspect.configs.recommended.rules,
      "react/jsx-no-bind": "error",
      "@stylistic/jsx-curly-brace-presence": [
        "error",
        {
          props: "never",
          children: "never",
          propElementValues: "always",
        },
      ],
      // These page-level rules report false positives when the page is assembled from JSX modules.
      "a11yinspect/landmark-element-error": "off",
      "a11yinspect/landmark-element-warning": "off",
      "a11yinspect/title-element-error": "off",
      "a11yinspect/skip-link-warning": "off",
    },
  },
]);
