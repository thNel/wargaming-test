export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "docs", "test", "chore", "build", "ci", "perf", "revert"],
    ],
    "type-case": [2, "always", "lower-case"],
    "subject-case": [0],
    "subject-full-stop": [0],
    "header-max-length": [0],
  },
};
