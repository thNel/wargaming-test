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
  await expect(page.getByRole("listitem")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Yamato" })).toBeVisible();

  await page.getByRole("searchbox", { name: "Search vehicles" }).fill("no-such-vehicle");
  await expect(page.getByRole("listitem")).toHaveCount(0);
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
  await page.getByRole("button", { name: "By name, Ascending" }).click();
  await expect.poll(firstVehicleName).toBe("Yamato");

  await page.locator("summary").click();
  await page.getByRole("button", { name: "Default order", exact: true }).click();
  await expect.poll(firstVehicleName).toBe("Kaga");
});
