import { expect, test } from "@playwright/test";

const screenshotOptions = {
  animations: "disabled",
  caret: "hide",
  maxDiffPixelRatio: 0.01,
};

const scenarios = [
  ["dark", "/index.html"],
  ["light", "/framebase-light-demo.html"],
];

/** Opens a local fixture after removing optional remote scripts from screenshot timing. */
async function openVisualFixture(page, path) {
  // Keeps the optional Highlight.js CDN request outside deterministic visual tests.
  await page.route("https://cdn.jsdelivr.net/**", (route) => route.abort());
  await page.goto(path, { waitUntil: "networkidle" });
  // Waits for any locally available fonts to settle before measuring geometry.
  await page.evaluate(() => document.fonts.ready);
  // Prevents the fixed skip link from leaking into unrelated element screenshots.
  const skipLink = page.locator(".fb-skip-link");
  if (await skipLink.count()) {
    await skipLink.evaluate((link) => {
      link.hidden = true;
    });
  }
}

for (const [theme, path] of scenarios) {
  /** Captures the stable public-site, form, and documentation composition per theme. */
  test(`${theme} theme keeps the primary component layouts stable`, async ({ page }) => {
    await openVisualFixture(page, path);

    await expect.soft(page.locator("#public-site")).toHaveScreenshot(
      `${theme}-public-site.png`,
      screenshotOptions,
    );
    await expect.soft(page.locator("#forms > .fb-container")).toHaveScreenshot(
      `${theme}-form-system.png`,
      screenshotOptions,
    );
    await expect.soft(page.locator("#doc-overview")).toHaveScreenshot(
      `${theme}-documentation-overview.png`,
      screenshotOptions,
    );
  });
}

/** Captures the mobile stacking and navigation behavior of the public hero. */
test("dark theme keeps the mobile hero stable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openVisualFixture(page, "/index.html");

  await expect.soft(page.locator("#public-site")).toHaveScreenshot(
    "dark-public-site-mobile.png",
    screenshotOptions,
  );
});

for (const theme of ["dark", "light"]) {
  /** Renders one component document under both token sets without changing its HTML. */
  test(`component contracts remain stable in ${theme} theme`, async ({ page }) => {
    await openVisualFixture(page, "/docs/components.html");
    // Switches only the documented theme attribute while preserving all HTML.
    await page.locator("html").evaluate((root, selectedTheme) => {
      root.dataset.theme = selectedTheme;
    }, theme);

    await expect.soft(page.locator("#loading")).toHaveScreenshot(
      `components-${theme}-loading.png`, screenshotOptions,
    );
    await expect.soft(page.locator("#notifications")).toHaveScreenshot(
      `components-${theme}-toast.png`, screenshotOptions,
    );
    await expect.soft(page.locator("#menus .fb-menu")).toHaveScreenshot(
      `components-${theme}-menu.png`, screenshotOptions,
    );
    await expect.soft(page.locator("#data-table")).toHaveScreenshot(
      `components-${theme}-table.png`, screenshotOptions,
    );
    await expect.soft(page.locator("#complementary")).toHaveScreenshot(
      `components-${theme}-complementary.png`, screenshotOptions,
    );
  });
}

/** Captures narrow responsive table, navigation, stepper, and calendar behavior. */
test("component contracts remain stable in a narrow mobile layout", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await openVisualFixture(page, "/docs/components.html");

  await expect.soft(page.locator("#responsive-navigation")).toHaveScreenshot(
    "components-mobile-navigation.png", screenshotOptions,
  );
  await expect.soft(page.locator("#data-table")).toHaveScreenshot(
    "components-mobile-table.png", screenshotOptions,
  );
  await expect.soft(page.locator("#calendar")).toHaveScreenshot(
    "components-mobile-calendar.png", screenshotOptions,
  );
});

/** Captures the intermediate tablet layout where multi-column contracts collapse selectively. */
test("component contracts remain stable at the tablet breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 900 });
  await openVisualFixture(page, "/docs/components.html");

  await expect.soft(page.locator("#inputs")).toHaveScreenshot(
    "components-tablet-inputs.png", screenshotOptions,
  );
});

/** Captures native dialog drawer geometry and its modal backdrop. */
test("open drawer remains stable", async ({ page }) => {
  await openVisualFixture(page, "/docs/components.html");
  // Opens the native dialog for its modal visual state.
  await page.locator("#component-drawer").evaluate((dialog) => dialog.showModal());

  await expect.soft(page).toHaveScreenshot("components-open-drawer.png", {
    ...screenshotOptions,
    fullPage: false,
  });
});

/** Captures visible focus, hover, disabled, invalid, popover, and open-details states. */
test("interactive limit states remain visually distinct", async ({ page }) => {
  await openVisualFixture(page, "/index.html#forms");
  await page.locator('#forms input[aria-invalid="true"]').focus();
  await page.locator('#forms .fb-button[type="submit"]').hover();

  await expect.soft(page.locator("#forms > .fb-container")).toHaveScreenshot(
    "states-focus-hover-invalid.png", screenshotOptions,
  );
  // Invokes the native declarative popover trigger without adding demo logic.
  await page.locator('[popovertarget="demo-popover"]').evaluate((button) => button.click());
  await expect.soft(page.locator("#demo-popover")).toHaveScreenshot(
    "states-open-popover.png", screenshotOptions,
  );
  // Closes the native overlay before capturing the unrelated controls section.
  await page.locator("#demo-popover").evaluate((popover) => popover.hidePopover());
  await expect.soft(page.locator("#native-controls")).toHaveScreenshot(
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
  await openVisualFixture(page, "/docs/components.html");

  await expect.soft(page.locator("#loading")).toHaveScreenshot(
    "preferences-reduced-motion-high-contrast.png", screenshotOptions,
  );
});

/** Captures the printable documentation contract with interactive overlays removed. */
test("print layout remains stable", async ({ page }) => {
  await page.emulateMedia({ media: "print", colorScheme: "light" });
  await openVisualFixture(page, "/index.html");

  await expect.soft(page.locator("#public-site")).toHaveScreenshot(
    "print-public-site.png", screenshotOptions,
  );
});

/** Captures logical navigation, form, timeline, stepper, and table geometry in RTL. */
test("right-to-left component geometry remains stable", async ({ page }) => {
  await openVisualFixture(page, "/docs/rtl.html");

  await expect.soft(page.locator("#forms .fb-input-group")).toHaveScreenshot(
    "rtl-input-group.png", screenshotOptions,
  );
  await expect.soft(page.locator("#forms .fb-menu")).toHaveScreenshot(
    "rtl-menu.png", screenshotOptions,
  );
  // Closes the menu before capturing the following section in isolation.
  await page.locator("#forms .fb-dropdown").evaluate((details) => {
    details.open = false;
  });
  await expect.soft(page.locator("#timeline")).toHaveScreenshot(
    "rtl-timeline-and-stepper.png", screenshotOptions,
  );
});

/** Captures the same RTL contracts after their mobile responsive transition. */
test("right-to-left mobile table remains stable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openVisualFixture(page, "/docs/rtl.html");

  await expect.soft(page.locator(".fb-table-wrap")).toHaveScreenshot(
    "rtl-mobile-table.png", screenshotOptions,
  );
});
