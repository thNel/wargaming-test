import { expect, test } from "@playwright/test";

test("catalog renders localized vehicle cards and filters them from Redux state", async ({
  page,
}) => {
  await page.goto("/");

  const catalog = page.getByRole("list", { name: "Fleet catalog" });
  const kaga = page.getByRole("article", { name: "Kaga" });

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

    try {
      await page.goto(new URL("/", baseURL).toString());

      const artwork = page.getByRole("img", { name: "Kaga" });

      await expect
        .poll(async () => artwork.evaluate((image) => String(Reflect.get(image, "currentSrc"))))
        .toContain(expectedVariant);
    } finally {
      await page.close();
    }
  }
});
