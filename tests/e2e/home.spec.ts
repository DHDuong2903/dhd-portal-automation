import { expect, test } from "@playwright/test";

// Smoke E2E: the app boots and serves the home page. Replaced by the
// import-wizard flow once E2/E3/E6 land.
test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
});
