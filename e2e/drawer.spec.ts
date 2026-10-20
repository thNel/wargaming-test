import { expect, test } from "./fixtures.js";

test("drawer padding keeps it open while backdrop closes it and restores focus", async ({
  page,
}) => {
  await page.goto("/");

  const languageButton = page.getByRole("button", { name: "Language", exact: true });

  await languageButton.click();

  const drawer = page.getByRole("dialog", { name: "Language" });

  await expect(drawer).toBeVisible();
  await drawer.click({ position: { x: 8, y: 8 } });
  await expect(drawer).toBeVisible();
  await page.mouse.click(8, 100);
  await expect(drawer).not.toBeVisible();
  await expect(languageButton).toBeFocused();
});

test("drawer closes with Escape and its close button and restores focus", async ({ page }) => {
  await page.goto("/");

  const languageButton = page.getByRole("button", { name: "Language", exact: true });
  const drawer = page.getByRole("dialog", { name: "Language" });

  await languageButton.click();
  await expect(drawer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(languageButton).toBeFocused();

  await languageButton.click();
  await drawer.getByRole("button", { name: "Close", exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await expect(languageButton).toBeFocused();
});

test("drawer locks page scrolling and restores the previous overflow style", async ({ page }) => {
  await page.goto("/");
  await page.locator("html").evaluate((element) => {
    element.style.overflow = "clip";
  });

  const languageButton = page.getByRole("button", { name: "Language", exact: true });
  const drawer = page.getByRole("dialog", { name: "Language" });

  await languageButton.click();
  await expect(drawer).toBeVisible();
  await expect
    .poll(() => page.locator("html").evaluate((element) => element.style.overflow))
    .toBe("hidden");
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect
    .poll(() => page.locator("html").evaluate((element) => element.style.overflow))
    .toBe("clip");
});
