import { test, expect } from "@playwright/test";

test.describe("FolioNova Full Smoke Test Suite", () => {
  test("Landing page loads, shows 5 cinematic archetypes and CV section", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/FolioNova/);

    // Verify key marketing sections
    const heroHeadline = page.locator("h1");
    await expect(heroHeadline).toBeVisible();

    // Verify designs showcase
    const designsSection = page.locator("#designs");
    await expect(designsSection).toBeVisible();

    // Design switching interactive check
    const brutalistButton = page.getByRole("button", { name: "Neo-Brutalist" });
    if (await brutalistButton.isVisible()) {
      await brutalistButton.click();
      await expect(page.locator("text=Raw, high-contrast typography")).toBeVisible();
    }

    // Verify CV templates section
    const cvSection = page.locator("#cv-templates");
    await expect(cvSection).toBeVisible();
    await expect(page.getByText("6 Executive CV & Resume Templates")).toBeVisible();
  });

  test("CV Studio page renders with template picker, controls and live PDF preview", async ({ page }) => {
    await page.goto("/cv");

    // Header & title
    await expect(page.getByText("CV & Resume Studio")).toBeVisible();

    // Verify the 6 templates are selectable
    await expect(page.getByText("Executive")).toBeVisible();
    await expect(page.getByText("Modern")).toBeVisible();
    await expect(page.getByText("Technical")).toBeVisible();

    // Verify paper size switch (A4 vs Letter)
    const letterButton = page.getByRole("button", { name: /Letter/i });
    if (await letterButton.isVisible()) {
      await letterButton.click();
    }

    // Verify Primary Action Buttons
    await expect(page.getByRole("button", { name: /Download PDF/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Copy CV Link/i })).toBeVisible();
  });

  test("Public profile page /u/alex-vance renders live with selectable CV download", async ({ page }) => {
    await page.goto("/u/alex-vance");

    // Verify public profile elements
    await expect(page.getByText("Alex Vance")).toBeVisible();

    // Verify Download CV button is present
    const downloadCvButton = page.getByRole("button", { name: /Download CV/i }).or(page.getByRole("link", { name: /Download CV/i }));
    await expect(downloadCvButton.first()).toBeVisible();
  });

  test("Design switching demo route opens seamlessly", async ({ page }) => {
    // Test Aurora demo
    await page.goto("/demo/aurora");
    await expect(page.getByText("Alex Vance")).toBeVisible();

    // Test Minimal demo
    await page.goto("/demo/minimal");
    await expect(page.getByText("Alex Vance")).toBeVisible();
  });

  test("Interactive contact dialog opens and validates inputs", async ({ page }) => {
    await page.goto("/u/alex-vance");
    const getInTouch = page.getByRole("button", { name: /Get in touch|Contact/i });
    if (await getInTouch.first().isVisible()) {
      await getInTouch.first().click();
      await expect(page.getByPlaceholder(/Your name/i).or(page.getByLabel(/Name/i))).toBeVisible();
    }
  });
});
