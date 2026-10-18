import { expect, test } from "@playwright/test";

test("filter checkboxes retain their sizes and support keyboard selection and reset", async ({
  page,
}) => {
  await page.goto("/");

  const nations = page.getByRole("group", { name: "Nations" });
  const classes = page.getByRole("group", { name: "Ship type" });
  const nation = nations.getByRole("checkbox").first();
  const vehicleType = classes.getByRole("checkbox").first();
  const tier = page.getByRole("checkbox", { name: "X", exact: true });
  const showMissing = page.getByRole("checkbox", { name: "Show missing ships" });
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
  await showMissing.uncheck();
  await reset.click();

  await expect(nation).not.toBeChecked();
  await expect(tier).not.toBeChecked();
  await expect(showMissing).toBeChecked();
  await expect(reset).toBeDisabled();
});

test("filter tooltips are anchored to their icons, not their checkboxes", async ({ page }) => {
  await page.goto("/");

  const nations = page.getByRole("group", { name: "Nations" });
  const japan = nations.locator('label[for="filter-nation-japan"]');
  const checkbox = japan.getByRole("checkbox");
  const flag = japan.locator("img");
  const tooltipAnchor = japan.locator("[data-tooltip]");

  await checkbox.focus();
  await expect
    .poll(() =>
      tooltipAnchor.evaluate(
        (element) =>
          element.ownerDocument.defaultView?.getComputedStyle(element, "::after").visibility,
      ),
    )
    .toBe("visible");

  await page.keyboard.press("Tab");
  await checkbox.hover();
  await expect
    .poll(() =>
      tooltipAnchor.evaluate(
        (element) =>
          element.ownerDocument.defaultView?.getComputedStyle(element, "::after").visibility,
      ),
    )
    .toBe("hidden");

  await flag.hover();
  await expect
    .poll(() =>
      tooltipAnchor.evaluate(
        (element) =>
          element.ownerDocument.defaultView?.getComputedStyle(element, "::after").visibility,
      ),
    )
    .toBe("visible");

  const cruiser = page.locator('label[for="filter-class-Cruiser"]');
  const cruiserCheckbox = cruiser.getByRole("checkbox");
  const cruiserIcon = cruiser.locator("img");
  const cruiserTooltip = cruiser.locator("[data-tooltip]");

  await cruiserCheckbox.hover();
  await expect
    .poll(() =>
      cruiserTooltip.evaluate(
        (element) =>
          element.ownerDocument.defaultView?.getComputedStyle(element, "::after").visibility,
      ),
    )
    .toBe("hidden");

  await cruiserIcon.hover();
  await expect
    .poll(() =>
      cruiserTooltip.evaluate(
        (element) =>
          element.ownerDocument.defaultView?.getComputedStyle(element, "::after").visibility,
      ),
    )
    .toBe("visible");
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
    page.getByRole("group", { name: "Ship type" }).getByRole("checkbox").first(),
  ).toBeVisible();
  shouldFail = false;
  await nations.getByRole("button", { name: "Retry" }).click();

  await expect(nations.getByRole("alert")).toHaveCount(0);
  await expect(nations.getByRole("checkbox").first()).toBeVisible();
  await nations.getByRole("checkbox").first().check();
  await expect(nations.getByRole("checkbox").first()).toBeChecked();
});
