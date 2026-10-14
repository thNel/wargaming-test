import { expect, test } from "@playwright/test";

test("catalog page opens in mock mode", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "World of Warships ship catalog" })).toBeVisible();
});
