import { expect as baseExpect, test as baseTest, type Page } from "@playwright/test";

export function collectBrowserErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().startsWith("Failed to load resource:")) {
      errors.push(`console.error: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    errors.push(`uncaught page error: ${error.message}`);
  });

  return errors;
}

export const test = baseTest.extend({
  page: async ({ page }, providePage, testInfo) => {
    const browserErrors = collectBrowserErrors(page);

    await providePage(page);

    if (browserErrors.length > 0) {
      await testInfo.attach("browser-errors", {
        body: browserErrors.join("\n"),
        contentType: "text/plain",
      });
    }

    baseExpect(browserErrors, "Unexpected browser console or uncaught JavaScript errors").toEqual(
      [],
    );
  },
});

export { expect } from "@playwright/test";
