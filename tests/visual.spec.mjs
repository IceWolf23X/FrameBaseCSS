import { expect, test } from "@playwright/test";

const screenshotOptions = {
  animations: "disabled",
  maxDiffPixelRatio: 0.04,
};

const scenarios = [
  ["dark", "/index.html"],
  ["light", "/framebase-light-demo.html"],
];

for (const [theme, path] of scenarios) {
  /** Captures the stable public-site, form, and documentation composition per theme. */
  test(`${theme} theme keeps the primary component layouts stable`, async ({ page }) => {
    await page.goto(path);

    await expect(page.locator("#public-site")).toHaveScreenshot(
      `${theme}-public-site.png`,
      screenshotOptions,
    );
    await expect(page.locator("#forms > .fb-container")).toHaveScreenshot(
      `${theme}-form-system.png`,
      screenshotOptions,
    );
    await expect(page.locator("#doc-overview")).toHaveScreenshot(
      `${theme}-documentation-overview.png`,
      screenshotOptions,
    );
  });
}

/** Captures the mobile stacking and navigation behavior of the public hero. */
test("dark theme keeps the mobile hero stable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/index.html");

  await expect(page.locator("#public-site")).toHaveScreenshot(
    "dark-public-site-mobile.png",
    screenshotOptions,
  );
});

for (const theme of ["dark", "light"]) {
  /** Renders one component document under both token sets without changing its HTML. */
  test(`component contracts remain stable in ${theme} theme`, async ({ page }) => {
    await page.goto("/docs/components.html");
    // Switches only the documented theme attribute while preserving all HTML.
    await page.locator("html").evaluate((root, selectedTheme) => {
      root.dataset.theme = selectedTheme;
    }, theme);

    await expect(page.locator("#loading")).toHaveScreenshot(
      `components-${theme}-loading.png`, screenshotOptions,
    );
    await expect(page.locator("#notifications")).toHaveScreenshot(
      `components-${theme}-toast.png`, screenshotOptions,
    );
    await expect(page.locator("#menus .fb-menu")).toHaveScreenshot(
      `components-${theme}-menu.png`, screenshotOptions,
    );
    await expect(page.locator("#data-table")).toHaveScreenshot(
      `components-${theme}-table.png`, screenshotOptions,
    );
    await expect(page.locator("#complementary")).toHaveScreenshot(
      `components-${theme}-complementary.png`, screenshotOptions,
    );
  });
}

/** Captures narrow responsive table, navigation, stepper, and calendar behavior. */
test("component contracts remain stable in a narrow mobile layout", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/docs/components.html");

  await expect(page.locator("#responsive-navigation")).toHaveScreenshot(
    "components-mobile-navigation.png", screenshotOptions,
  );
  await expect(page.locator("#data-table")).toHaveScreenshot(
    "components-mobile-table.png", screenshotOptions,
  );
  await expect(page.locator("#calendar")).toHaveScreenshot(
    "components-mobile-calendar.png", screenshotOptions,
  );
});

/** Captures the intermediate tablet layout where multi-column contracts collapse selectively. */
test("component contracts remain stable at the tablet breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 900 });
  await page.goto("/docs/components.html");

  await expect(page.locator("#inputs")).toHaveScreenshot(
    "components-tablet-inputs.png", screenshotOptions,
  );
});

/** Captures native dialog drawer geometry and its modal backdrop. */
test("open drawer remains stable", async ({ page }) => {
  await page.goto("/docs/components.html");
  // Opens the native dialog for its modal visual state.
  await page.locator("#component-drawer").evaluate((dialog) => dialog.showModal());

  await expect(page).toHaveScreenshot("components-open-drawer.png", {
    ...screenshotOptions,
    fullPage: false,
  });
});

/** Captures visible focus, hover, disabled, invalid, popover, and open-details states. */
test("interactive limit states remain visually distinct", async ({ page }) => {
  await page.goto("/index.html#forms");
  // Removes a fixed-element screenshot artifact outside the form under test.
  await page.locator(".fb-skip-link").evaluate((link) => {
    link.hidden = true;
  });
  await page.locator('#forms input[aria-invalid="true"]').focus();
  await page.locator('#forms .fb-button[type="submit"]').hover();

  await expect(page.locator("#forms > .fb-container")).toHaveScreenshot(
    "states-focus-hover-invalid.png", screenshotOptions,
  );
  // Invokes the native declarative popover trigger without adding demo logic.
  await page.locator('[popovertarget="demo-popover"]').evaluate((button) => button.click());
  await expect(page.locator("#demo-popover")).toHaveScreenshot(
    "states-open-popover.png", screenshotOptions,
  );
  await expect(page.locator("#native-controls")).toHaveScreenshot(
    "states-native-controls.png", screenshotOptions,
  );
});

/** Captures reduced-motion and increased-contrast token behavior through browser media emulation. */
test("user preference media queries remain stable", async ({ page }) => {
  const client = await page.context().newCDPSession(page);
  await client.send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [
      { name: "prefers-reduced-motion", value: "reduce" },
      { name: "prefers-contrast", value: "more" },
      { name: "prefers-color-scheme", value: "dark" },
    ],
  });
  await page.goto("/docs/components.html");

  await expect(page.locator("#loading")).toHaveScreenshot(
    "preferences-reduced-motion-high-contrast.png", screenshotOptions,
  );
});

/** Captures the printable documentation contract with interactive overlays removed. */
test("print layout remains stable", async ({ page }) => {
  await page.emulateMedia({ media: "print", colorScheme: "light" });
  await page.goto("/index.html");

  await expect(page.locator("#public-site")).toHaveScreenshot(
    "print-public-site.png", screenshotOptions,
  );
});

/** Captures logical navigation, form, timeline, stepper, and table geometry in RTL. */
test("right-to-left component geometry remains stable", async ({ page }) => {
  await page.goto("/docs/rtl.html");

  await expect(page.locator("#forms .fb-input-group")).toHaveScreenshot(
    "rtl-input-group.png", screenshotOptions,
  );
  await expect(page.locator("#forms .fb-menu")).toHaveScreenshot(
    "rtl-menu.png", screenshotOptions,
  );
  // Closes the menu before capturing the following section in isolation.
  await page.locator("#forms .fb-dropdown").evaluate((details) => {
    details.open = false;
  });
  await expect(page.locator("#timeline")).toHaveScreenshot(
    "rtl-timeline-and-stepper.png", screenshotOptions,
  );
});

/** Captures the same RTL contracts after their mobile responsive transition. */
test("right-to-left mobile table remains stable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/rtl.html");

  await expect(page.locator(".fb-table-wrap")).toHaveScreenshot(
    "rtl-mobile-table.png", screenshotOptions,
  );
});
