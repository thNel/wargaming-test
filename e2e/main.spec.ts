import { expect, test } from "./fixtures.js";

test("main page opens in mock mode", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Fleet catalog" })).toBeVisible();
});
