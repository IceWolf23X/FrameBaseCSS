import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  ["dark", "/index.html"],
  ["light", "/framebase-light-demo.html"],
  ["components", "/docs/components.html"],
  ["themes", "/docs/themes.html"],
  ["accessibility", "/docs/accessibility.html"],
  ["browser support", "/docs/browser-support.html"],
  ["RTL", "/docs/rtl.html"],
];

for (const [theme, path] of pages) {
  /** Scans each public documentation page against axe's complete default ruleset. */
  test(`${theme} documentation has no detectable accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });

  if (["dark", "light", "components", "RTL"].includes(theme)) {
    /** Guards the layout contracts most likely to create page-level mobile overflow. */
    test(`${theme} documentation does not overflow the mobile viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);

    // Reads the root viewport dimensions inside the rendered document.
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

      expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
    });
  }
}

/** Verifies the semantic state attributes exposed by interactive component examples. */
test("component states expose their required accessibility contracts", async ({ page }) => {
  await page.goto("/docs/components.html");

  await expect(page.locator('[aria-busy="true"]')).toHaveCount(2);
  await expect(page.locator('[aria-live="polite"]')).toHaveCount(1);
  await expect(page.getByRole("status")).toHaveCount(2);
  await expect(page.getByRole("alert")).toHaveCount(1);
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page.getByRole("menuitem")).toHaveCount(3);
  await expect(page.getByRole("menuitemradio")).toHaveCount(1);
  await expect(page.locator('[aria-current="step"]')).toHaveCount(1);
  await expect(page.locator('[aria-checked="true"]')).toHaveCount(1);
  await expect(page.locator('[aria-selected="true"]')).toHaveCount(1);
  await expect(page.locator('[aria-expanded="true"]')).toHaveCount(1);

  await page.goto("/index.html");
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(1);
});

/** Verifies that the auto entry point follows both system color-scheme values. */
test("automatic theme follows the emulated system preference", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/docs/components.html");
  await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
  await expect(page.locator("html")).toHaveCSS("background-color", "rgb(244, 246, 248)");

  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
  await expect(page.locator("html")).toHaveCSS("background-color", "rgb(47, 50, 53)");
});

/** Verifies that ordinary motion remains enabled with the default browser preference. */
test("normal motion keeps component animation enabled", async ({ page }) => {
  await page.goto("/docs/components.html");

  await expect(page.locator(".fb-spinner--md")).not.toHaveCSS("animation-duration", "0.00001s");
  await expect(page.locator(".fb-spinner--md")).toHaveCSS("animation-iteration-count", "infinite");
});

/** Verifies reduced motion in an explicit context without changing global defaults. */
test("reduced motion limits component animation", async ({ browser }) => {
  const context = await browser.newContext({
    colorScheme: "dark",
    locale: "en-US",
    reducedMotion: "reduce",
    timezoneId: "UTC",
  });
  const page = await context.newPage();

  try {
    await page.goto("http://127.0.0.1:4173/docs/components.html");
    const prefersReducedMotion = await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    );

    expect(prefersReducedMotion).toBe(true);
    // Read the normalized computed value so equivalent browser serializations compare numerically.
    const animationDurationSeconds = await page.locator(".fb-spinner--md").evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).animationDuration),
    );
    expect(animationDurationSeconds).toBeCloseTo(0.00001, 8);
    await expect(page.locator(".fb-spinner--md")).toHaveCSS("animation-iteration-count", "1");
  } finally {
    await context.close();
  }
});

/** Exercises native keyboard disclosure, skip-link focus, popover, and modal dialog behavior. */
test("native interactive contracts remain keyboard and focus operable", async ({
  browserName,
  page,
}) => {
  await page.goto("/index.html");
  if (browserName === "webkit") {
    // WebKit automation does not enable Safari's optional full-keyboard link navigation.
    await page.locator(".fb-skip-link").focus();
  } else {
    await page.keyboard.press("Tab");
  }
  await expect(page.locator(".fb-skip-link")).toBeFocused();

  const disclosure = page.locator("#native-controls details").filter({
    hasText: "How do I customize the theme?",
  });
  await disclosure.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(disclosure).toHaveAttribute("open", "");

  // Detects native popover support so older engines exercise the documented fallback contract.
  const supportsPopover = await page.evaluate(
    () => typeof HTMLElement.prototype.showPopover === "function",
  );
  if (supportsPopover) {
    await page.locator('[popovertarget="demo-popover"]').click();
    await expect(page.locator("#demo-popover")).toBeVisible();
  } else {
    await expect(page.locator('[popovertarget="demo-popover"]')).toBeVisible();
    await expect(page.locator("#demo-popover")).toHaveAttribute("popover", "");
  }

  await page.goto("/docs/components.html#drawer");
  // Opens the native modal through the same browser API a consumer would call.
  await page.locator("#component-drawer").evaluate((dialog) => dialog.showModal());
  await expect(page.locator("#component-drawer")).toBeVisible();
  await expect(page.locator("#component-drawer")).toHaveAttribute("open", "");
});

/** Confirms that 200 percent text sizing preserves a usable page-level viewport. */
test("component documentation remains bounded at 200 percent text size", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/docs/components.html");
  // Emulates browser text-only zoom without altering component markup.
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });

  // Reads the post-zoom root dimensions to detect page-level clipping.
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
});
