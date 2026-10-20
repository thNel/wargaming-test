import { expect, test } from "./fixtures.js";

test("filter checkboxes retain their sizes and support keyboard selection and reset", async ({
  page,
}) => {
  await page.goto("/");

  const nations = page.getByRole("group", { name: "Nations" });
  const classes = page.getByRole("group", { name: "Vehicle type" });
  const nation = nations.getByRole("checkbox").first();
  const vehicleType = classes.getByRole("checkbox").first();
  const tier = page.getByRole("checkbox", { name: "X", exact: true });
  const reset = page.getByRole("button", { name: "Reset", exact: true });

  await expect(nation).toBeVisible();
  await expect(vehicleType).toBeVisible();
  await expect(nation).toHaveCSS("width", "20px");
  await expect(nation).toHaveCSS("height", "20px");
  await expect(vehicleType).toHaveCSS("width", "20px");
  await expect(tier).toHaveCSS("width", "18px");
  await expect(tier).toHaveCSS("height", "18px");
  await expect(reset).toBeDisabled();

  await nation.focus();
  await page.keyboard.press("Space");
  await expect(nation).toBeChecked();
  await expect(nation).toBeFocused();
  await expect(nation).toHaveCSS("outline-style", "solid");
  await tier.check();
  await reset.click();

  await expect(nation).not.toBeChecked();
  await expect(tier).not.toBeChecked();
  await expect(reset).toBeDisabled();
});

test("nation and class selections combine with OR within groups and AND across groups", async ({
  page,
}) => {
  await page.goto("/");

  const list = page.getByRole("list", { name: "Fleet catalog" });
  const nations = page.getByRole("group", { name: "Nations" });
  const classes = page.getByRole("group", { name: "Vehicle type" });

  await nations.getByRole("checkbox", { name: "Japan" }).check();
  await nations.getByRole("checkbox", { name: "U.S.A." }).check();
  await classes.getByRole("checkbox", { name: "Battleship" }).check();
  await classes.getByRole("checkbox", { name: "Cruiser" }).check();
  await page.getByRole("checkbox", { name: "X", exact: true }).check();

  await expect(list.getByRole("listitem")).toHaveCount(2);
  await expect(page.getByRole("button", { name: "Yamato" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Des Moines" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Bismarck" })).toHaveCount(0);

  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.locator('p[aria-live="polite"]')).toHaveText("25 vehicles");
});

test("filter tooltips are anchored to their icons, not their checkboxes", async ({ page }) => {
  await page.goto("/");

  const nations = page.getByRole("group", { name: "Nations" });
  const japan = nations.locator('label[for="filter-nation-japan"]');
  const checkbox = japan.getByRole("checkbox");
  const flag = japan.locator("img");
  const tooltip = page.getByRole("tooltip");

  await checkbox.focus();
  await expect(tooltip).toHaveText("Japan");
  await expect(tooltip).toBeVisible();

  await page.keyboard.press("Tab");
  await page.locator("body").click({ position: { x: 0, y: 0 } });
  await checkbox.hover();
  await expect(tooltip).toBeHidden();

  await flag.hover();
  await expect(tooltip).toHaveText("Japan");
  await expect(tooltip).toBeVisible();

  const cruiser = page.locator('label[for="filter-class-Cruiser"]');
  const cruiserCheckbox = cruiser.getByRole("checkbox");
  const cruiserIcon = cruiser.locator("img");

  await cruiserCheckbox.hover();
  await expect(tooltip).toBeHidden();

  await cruiserIcon.hover();
  await expect(tooltip).toHaveText("Cruiser");
  await expect(tooltip).toBeVisible();
});

test("Escape dismisses a focused tooltip without moving focus", async ({ page }) => {
  await page.goto("/");

  const checkbox = page.getByRole("checkbox", { name: "Japan" });
  const tooltip = page.getByRole("tooltip");

  await checkbox.focus();
  await expect(tooltip).toBeVisible();
  await page.keyboard.press("Escape");

  await expect(tooltip).toBeHidden();
  await expect(checkbox).toBeFocused();
});

test("a failed nation request can be retried without reloading the page", async ({ page }) => {
  let shouldFail = true;

  await page.route("**/api/nations/", async (route) => {
    if (shouldFail) {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ status: "error" }),
      });
      return;
    }

    await route.continue();
  });
  await page.goto("/");

  const nations = page.getByRole("group", { name: "Nations" });

  await expect(nations.getByRole("alert")).toHaveText("Could not load filter options.");
  await expect(
    page.getByRole("group", { name: "Vehicle type" }).getByRole("checkbox").first(),
  ).toBeVisible();
  shouldFail = false;
  await nations.getByRole("button", { name: "Retry" }).click();

  await expect(nations.getByRole("alert")).toHaveCount(0);
  await expect(nations.getByRole("checkbox").first()).toBeVisible();
  await nations.getByRole("checkbox").first().check();
  await expect(nations.getByRole("checkbox").first()).toBeChecked();
});

test("mobile filters keep draft edits private until apply and reset applied filters", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const openFilters = page.getByRole("button", { name: "Filters" });

  await expect(openFilters).toBeVisible();
  await openFilters.click();

  const drawer = page.getByRole("dialog", { name: "Filters" });
  const japan = drawer.getByRole("checkbox", { name: "Japan" });
  const search = drawer.getByRole("searchbox", { name: "Search vehicles" });
  const list = page.getByRole("list", { name: "Fleet catalog" });

  await expect(japan).toBeVisible();
  await japan.check();
  await search.fill("Yamato");
  await drawer.getByRole("button", { name: "Apply" }).click();

  await expect(drawer).not.toBeVisible();
  await expect(list.getByRole("listitem")).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Yamato" })).toBeVisible();

  await openFilters.click();
  const reopenedDrawer = page.getByRole("dialog", { name: "Filters" });
  const reopenedJapan = reopenedDrawer.getByRole("checkbox", { name: "Japan" });

  await expect(reopenedJapan).toBeChecked();
  await reopenedJapan.uncheck();
  await page.keyboard.press("Escape");
  await expect(reopenedDrawer).not.toBeVisible();

  await openFilters.click();
  const canceledDrawer = page.getByRole("dialog", { name: "Filters" });

  await expect(canceledDrawer.getByRole("checkbox", { name: "Japan" })).toBeChecked();
  await expect(canceledDrawer.getByRole("searchbox", { name: "Search vehicles" })).toHaveValue(
    "Yamato",
  );
  await canceledDrawer.getByRole("button", { name: "Reset" }).click();

  await expect(canceledDrawer).not.toBeVisible();
  await expect(page.locator('p[aria-live="polite"]')).toHaveText("25 vehicles");
});
