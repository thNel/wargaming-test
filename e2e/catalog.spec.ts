import { collectBrowserErrors, expect, test } from "./fixtures.js";

test("catalog renders localized vehicle cards and filters them from Redux state", async ({
  page,
}) => {
  await page.goto("/");

  const catalog = page.getByRole("list", { name: "Fleet catalog" });
  const kaga = page.getByRole("button", { name: "Kaga" });

  await expect(catalog).toBeVisible();
  await expect(kaga).toBeVisible();
  await expect(kaga.getByText("VIII", { exact: true })).toBeVisible();
  const classIcon = kaga.getByRole("img", { name: "Premium Aircraft Carrier" });
  await expect(classIcon).toBeVisible();
  await classIcon.hover();
  await expect(page.getByRole("tooltip")).toHaveText("Premium Aircraft Carrier");

  await page.getByRole("searchbox", { name: "Search vehicles" }).fill("Yamato");
  await expect(catalog.getByRole("listitem")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Yamato" })).toBeVisible();

  await page.getByRole("searchbox", { name: "Search vehicles" }).fill("no-such-vehicle");
  await expect(catalog.getByRole("listitem")).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText("No vehicles match the selected filters.");
});

test("catalog sorting reverses on repeat selection and can return to source order", async ({
  page,
}) => {
  await page.goto("/");

  const list = page.getByRole("list", { name: "Fleet catalog" });
  const firstVehicleName = () =>
    list.getByRole("listitem").first().locator('article img:not([alt=""])').getAttribute("alt");

  await expect(list).toBeVisible();
  await expect.poll(firstVehicleName).toBe("Kaga");

  await page.locator("summary").click();
  await page.getByRole("button", { name: "By name", exact: true }).click();
  await expect.poll(firstVehicleName).toBe("Ark Royal");

  await page.locator("summary").click();
  await page.getByRole("button", { name: "By name", exact: true }).click();
  await expect.poll(firstVehicleName).toBe("Yamato");

  await page.locator("summary").click();
  await page.getByRole("button", { name: "Default order", exact: true }).click();
  await expect.poll(firstVehicleName).toBe("Kaga");
});

test("catalog artwork picks an image source for the device pixel ratio", async ({
  browser,
}, testInfo) => {
  const baseURL = testInfo.project.use.baseURL;

  if (typeof baseURL !== "string") {
    throw new Error("The Playwright project must configure baseURL for this test.");
  }

  for (const { deviceScaleFactor, expectedVariant } of [
    { deviceScaleFactor: 1, expectedVariant: "/vehicle/medium/" },
    { deviceScaleFactor: 2, expectedVariant: "/vehicle/large/" },
  ]) {
    const page = await browser.newPage({
      deviceScaleFactor,
      viewport: { width: 1280, height: 720 },
    });
    const browserErrors = collectBrowserErrors(page);

    try {
      await page.goto(new URL("/", baseURL).toString());

      const artwork = page.getByRole("img", { name: "Kaga" });

      await expect
        .poll(async () => artwork.evaluate((image) => String(Reflect.get(image, "currentSrc"))))
        .toContain(expectedVariant);
      expect(browserErrors, "Unexpected browser console or uncaught JavaScript errors").toEqual([]);
    } finally {
      await page.close();
    }
  }
});

test("vehicle details show localized data and close without leaving scroll locked", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Kaga" }).click();

  const details = page.getByRole("dialog", { name: "Kaga" });

  await expect(details).toBeVisible();
  await expect(details.getByText("Japan", { exact: true })).toBeVisible();
  await expect(details.getByText("Aircraft Carrier", { exact: true })).toBeVisible();
  await expect(details.getByText("VIII", { exact: true })).toBeVisible();
  await expect(details.getByText("Premium", { exact: true })).toBeVisible();
  await expect(details.getByRole("heading", { name: "About this ship" })).toBeVisible();
  await expect(details.getByText(/Great Kanto Earthquake/)).toBeVisible();

  await details.getByRole("button", { name: "Close ship details" }).click();

  await expect(details).not.toBeVisible();
  await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
});

test("catalog reports a vehicle service failure and retries successfully", async ({ page }) => {
  let shouldFail = true;

  await page.route("**/api/vehicles/", async (route) => {
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

  await expect(page.getByRole("alert")).toContainText("Could not load the vehicle catalog.");
  shouldFail = false;
  await page.getByRole("button", { name: "Retry" }).click();

  await expect(page.getByRole("list", { name: "Fleet catalog" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Kaga" })).toBeVisible();
});

test("catalog keeps its loading skeleton until the vehicle response arrives", async ({ page }) => {
  let continueVehicleRequest: (() => void) | undefined;
  let notifyVehicleRequestStarted: (() => void) | undefined;
  const vehicleRequestStarted = new Promise<void>((resolve) => {
    notifyVehicleRequestStarted = resolve;
  });

  await page.route("**/api/vehicles/", async (route) => {
    notifyVehicleRequestStarted?.();
    await new Promise<void>((resolve) => {
      continueVehicleRequest = resolve;
    });
    await route.continue();
  });
  await page.goto("/");
  await vehicleRequestStarted;

  await expect(page.getByRole("button", { name: "Kaga" })).toHaveCount(0);
  expect(await page.locator('main div[aria-hidden="true"]').count()).toBeGreaterThan(0);

  continueVehicleRequest?.();
  await expect(page.getByRole("button", { name: "Kaga" })).toBeVisible();
});

test("tier sorting applies both directions and restores source order", async ({ page }) => {
  await page.goto("/");

  const list = page.getByRole("list", { name: "Fleet catalog" });
  const firstVehicleName = () =>
    list.getByRole("listitem").first().locator('article img:not([alt=""])').getAttribute("alt");

  await page.locator("summary").click();
  await page.getByRole("button", { name: "By tier", exact: true }).click();
  await expect.poll(firstVehicleName).toBe("United States");

  await page.locator("summary").click();
  await page.getByRole("button", { name: "By tier", exact: true }).click();
  await expect.poll(firstVehicleName).toBe("Chikuma");

  await page.locator("summary").click();
  await page.getByRole("button", { name: "Default order", exact: true }).click();
  await expect.poll(firstVehicleName).toBe("Kaga");
});

test("virtualized catalog mounts nearby rows and renders the final row when scrolled", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 360 });
  await page.goto("/");

  const list = page.getByRole("list", { name: "Fleet catalog" });

  await list.scrollIntoViewIfNeeded();
  await expect(page.locator('p[aria-live="polite"]')).toHaveText("25 vehicles");
  expect(await list.getByRole("listitem").count()).toBeLessThan(25);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));

  await expect(page.getByRole("button", { name: "Umikaze" })).toBeVisible();
  expect(await list.getByRole("listitem").count()).toBeLessThan(25);
});
