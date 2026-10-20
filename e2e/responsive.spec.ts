import { expect, test } from "./fixtures.js";

test("catalog column breakpoints include the exact boundary widths", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  const catalog = page.getByRole("list", { name: "Fleet catalog" });

  await expect(catalog).toBeVisible();

  for (const { width, columns } of [
    { width: 320, columns: 1 },
    { width: 420, columns: 1 },
    { width: 421, columns: 2 },
    { width: 700, columns: 2 },
    { width: 701, columns: 2 },
    { width: 1024, columns: 2 },
    { width: 1025, columns: 3 },
    { width: 1440, columns: 3 },
  ]) {
    await page.setViewportSize({ width, height: 800 });

    await expect
      .poll(() =>
        catalog.evaluate(
          (element) => getComputedStyle(element).gridTemplateColumns.split(" ").length,
        ),
      )
      .toBe(columns);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true);
  }
});

test("mobile filter control switches exactly at the 700px page breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 701, height: 800 });
  await page.goto("/");

  const mobileFilters = page.getByRole("button", { name: "Filters" });
  const desktopFilters = page.getByRole("complementary", { name: "Filters" });

  await expect(desktopFilters).toBeVisible();
  await expect(mobileFilters).not.toBeVisible();

  await page.setViewportSize({ width: 700, height: 800 });
  await expect(desktopFilters).not.toBeVisible();
  await expect(mobileFilters).toBeVisible();
});
