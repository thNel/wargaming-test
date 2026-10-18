import { afterEach, describe, expect, it, vi } from "vitest";

import { i18nInstance } from "./index";

afterEach(async () => {
  vi.restoreAllMocks();
  await i18nInstance.changeLanguage("en");
  localStorage.clear();
});

describe("language synchronization", () => {
  it("keeps the selected region in storage and sets the HTML language tag", async () => {
    await i18nInstance.changeLanguage("es_mx");

    expect(localStorage.getItem("wows-language")).toBe("es_mx");
    expect(document.documentElement.lang).toBe("es-MX");
  });

  it("updates the document when browser storage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage unavailable");
    });

    await i18nInstance.changeLanguage("ru");

    expect(i18nInstance.resolvedLanguage).toBe("ru");
    expect(document.documentElement.lang).toBe("ru");
  });
});
