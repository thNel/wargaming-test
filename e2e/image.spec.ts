import { expect, test } from "@playwright/test";

test("failed filter images keep the requested icon dimensions", async ({ page }) => {
  await page.route("**/mocks/vortex/images/**", (route) => route.abort());
  await page.goto("/");

  const nationFlag = page.locator(
    'label[for="filter-nation-japan"] > span[data-tooltip] > div[aria-hidden="true"]',
  );
  const vehicleIcon = page.locator(
    'label[for="filter-class-Cruiser"] > span[data-tooltip] > div[aria-hidden="true"]',
  );

  await expect(nationFlag).toHaveCSS("height", "18px");
  await expect(nationFlag).toHaveCSS("width", "26px");
  await expect(vehicleIcon).toHaveCSS("height", "28px");
  await expect(vehicleIcon).toHaveCSS("width", "28px");
});

test("failed logo keeps its desktop and mobile dimensions", async ({ page }) => {
  await page.route("**/images/logo-wows-long-raster.webp", (route) => route.abort());
  await page.goto("/");

  const logo = page.getByRole("img", { name: "World of Warships" });

  await expect(logo).toHaveJSProperty("tagName", "DIV");
  await expect(logo).toHaveCSS("height", "32px");
  await expect(logo).toHaveCSS("width", "274px");

  await page.setViewportSize({ width: 390, height: 844 });

  await expect(logo).toHaveCSS("height", "32px");
  await expect(logo).toHaveCSS("width", "100px");
});

test("loaded logo keeps its desktop and mobile dimensions", async ({ page }) => {
  await page.goto("/");

  const logo = page.getByRole("img", { name: "World of Warships" });

  await expect(logo).toHaveJSProperty("tagName", "IMG");
  await expect
    .poll(() => logo.evaluate((image) => (image as { naturalWidth: number }).naturalWidth))
    .toBeGreaterThan(0);
  await expect(logo).toHaveCSS("height", "32px");
  await expect(logo).toHaveCSS("width", "274px");

  await page.setViewportSize({ width: 390, height: 844 });

  await expect(logo).toHaveCSS("height", "32px");
  await expect(logo).toHaveCSS("width", "100px");
});
