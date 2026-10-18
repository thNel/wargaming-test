import { describe, expect, it } from "vitest";

import { findSupportedLocale, getLanguageTag, normalizeLocale } from "./locale.utils";

describe("locale resolution", () => {
  it.each([
    ["es-MX", "es_mx"],
    ["es_mx", "es_mx"],
    ["es-MX-u-nu-latn", "es_mx"],
    ["es-ES", "es"],
    ["en-US", "en"],
    ["pt-BR", "pt_br"],
    ["zh-CN", "zh_cn"],
    ["zh-TW", "zh_tw"],
    ["RU-ru", "ru"],
  ])("resolves %s to %s", (input, expected) => {
    expect(findSupportedLocale(input)).toBe(expected);
  });

  it("leaves unsupported and empty locales unresolved", () => {
    expect(findSupportedLocale("fi-FI")).toBeUndefined();
    expect(findSupportedLocale("")).toBeUndefined();
  });

  it("formats Vortex locale codes and document language tags", () => {
    expect(normalizeLocale("ES-MX")).toBe("es_mx");
    expect(getLanguageTag("es_mx")).toBe("es-MX");
    expect(getLanguageTag("zh_tw")).toBe("zh-TW");
    expect(getLanguageTag("en")).toBe("en");
  });
});
