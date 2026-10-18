import { expect, test } from "@playwright/test";

test("language drawer switches the page locale and closes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Language" }).click();

  const drawer = page.getByRole("dialog", { name: "Language" });

  await expect(drawer).toBeVisible();
  await drawer.getByRole("button", { name: "Русский" }).click();

  await expect(page.getByRole("heading", { name: "Каталог флота" })).toBeVisible();
  await expect(drawer).not.toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page.locator('input[name="nation"][value="usa"]')).toHaveAccessibleName("США");
  await expect(page.locator('input[name="class"][value="Cruiser"]')).toHaveAccessibleName(
    "Крейсер",
  );
});

test("regional language selection survives a page reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Language", exact: true }).click();
  await page.getByRole("button", { name: "Español (México)", exact: true }).click();

  const languageButton = page.locator('button[aria-controls="language-drawer"]');

  await expect(languageButton).toHaveText("ES-MX");
  await expect(page.locator("html")).toHaveAttribute("lang", "es-MX");
  expect(await page.evaluate(() => localStorage.getItem("wows-language"))).toBe("es_mx");

  await page.reload();

  await expect(languageButton).toHaveText("ES-MX");
  await expect(page.locator("html")).toHaveAttribute("lang", "es-MX");
  await languageButton.click();
  await expect(page.getByRole("button", { name: "Español (México)", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test.describe("browser language detection", () => {
  test.use({ locale: "es-MX" });

  test("uses and persists the supported regional browser language", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('button[aria-controls="language-drawer"]')).toHaveText("ES-MX");
    await expect(page.locator("html")).toHaveAttribute("lang", "es-MX");
    expect(await page.evaluate(() => localStorage.getItem("wows-language"))).toBe("es_mx");
  });
});
