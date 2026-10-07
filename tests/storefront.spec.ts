import { expect, test } from "@playwright/test";

const productRoute = "/#/product/no-spells-given-hoodie-black";
const viewports = [
  [1440, 900],
  [1280, 800],
  [1024, 768],
  [834, 1194],
  [768, 1024],
  [430, 932],
  [390, 844],
  [360, 800],
];

for (const [width, height] of viewports) {
  test(`all routes fit ${width}x${height} with loaded images and no browser errors`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    for (const route of [
      "/#/",
      "/#/shop",
      productRoute,
      "/#/lookbook",
      "/#/about",
      "/#/checkout",
    ]) {
      await page.goto(route);
      await expect(page.locator("main h1")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBeTruthy();
      await page.locator("footer").scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          page.evaluate(
            () =>
              [...document.images].filter(
                (image) => image.complete && image.naturalWidth === 0,
              ).length,
          ),
        )
        .toBe(0);
      if (width <= 700 && route === productRoute)
        await expect(page.locator(".mobile-add")).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}

test("size validation, gallery, color switching, quantity, persistence, removal, and focus trap", async ({
  page,
}) => {
  await page.goto(productRoute);
  await page.locator(".product-info .add-to-bag").click();
  await expect(page.getByRole("alert")).toHaveText(
    "Select a size to add this piece.",
  );
  await page.getByRole("button", { name: "Show back image" }).click();
  await expect(page.locator(".gallery-main img")).toHaveAttribute(
    "src",
    /black-back\.webp$/,
  );
  await page.getByRole("link", { name: "Choose Bone / Black" }).click();
  await expect(page).toHaveURL(/hoodie-bone/);
  await page.getByRole("radio", { name: "M", exact: true }).check();
  await page.locator(".product-info .add-to-bag").click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => !!document.activeElement?.closest("dialog")),
    ).toBeTruthy();
  }
  await page.getByRole("button", { name: /Increase No Spells/ }).click();
  await expect(dialog.getByText("$148.00").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.locator(".product-info .add-to-bag")).toBeFocused();
  await page.reload();
  await page.getByRole("button", { name: "Open bag, 2 items" }).click();
  await expect(page.getByRole("dialog")).toContainText("YOUR BAG (2)");
  await page.getByRole("button", { name: /Decrease No Spells/ }).click();
  await expect(page.getByRole("dialog")).toContainText("YOUR BAG (1)");
  await page.getByRole("button", { name: /Remove No Spells/ }).click();
  await expect(page.getByRole("dialog")).toContainText("Your bag is empty.");
});

test("checkout validates fields, generates a demo receipt, clears bag, and never sends or stores personal/payment data", async ({
  page,
}) => {
  const external: string[] = [];
  const submissions: string[] = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:4173/"))
      external.push(request.url());
    if (request.method() !== "GET") submissions.push(request.url());
  });
  await page.goto(productRoute);
  await page.getByRole("radio", { name: "L", exact: true }).check();
  await page.locator(".product-info .add-to-bag").click();
  await page.getByRole("link", { name: "CHECKOUT", exact: true }).click();
  await expect(
    page.getByText("DEMO CHECKOUT — NO PAYMENT WILL BE PROCESSED"),
  ).toBeVisible();
  await page.getByRole("button", { name: /PLACE DEMO ORDER/ }).click();
  await expect(page.locator(".demo-success")).toHaveCount(0);
  for (const [label, value] of [
    ["Email address", "fictional@example.com"],
    ["First name", "Fictional"],
    ["Last name", "Person"],
    ["Address", "123 Imaginary Lane"],
    ["City", "Demo City"],
    ["Postal code", "00000"],
    ["State / province / region", "Demo State"],
  ])
    await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByRole("radio", { name: /Express demo delivery/ }).check();
  await expect(page.locator(".place-order")).toContainText("$86.00");
  await page.getByRole("button", { name: /PLACE DEMO ORDER/ }).click();
  await expect(page.locator(".receipt>strong")).toHaveText(
    /^NOVA-[1-9][0-9]{5}$/,
  );
  await expect(page.locator(".demo-success")).toContainText(
    "No payment was processed.",
  );
  const stored = await page.evaluate(() => ({
    ...localStorage,
    ...sessionStorage,
  }));
  expect(JSON.stringify(stored)).not.toMatch(
    /fictional@example|Imaginary|4242|000|Demo City/,
  );
  expect(
    await page.evaluate(() => localStorage.getItem("nova-demo-bag-v1")),
  ).toBe("[]");
  expect(external).toEqual([]);
  expect(submissions).toEqual([]);
});

test("filters, search, quick view, and separate set sizes work", async ({
  page,
}) => {
  await page.goto("/#/shop");
  await page.getByRole("button", { name: "SWEATPANTS", exact: true }).click();
  await expect(page.locator(".shop-grid .product-card")).toHaveCount(4);
  await page.getByRole("button", { name: "ESSENTIALS", exact: true }).click();
  await expect(page.locator(".shop-grid .product-card")).toHaveCount(1);
  await page.getByRole("button", { name: "SEARCH", exact: true }).click();
  await page.getByRole("searchbox").fill("crystal");
  await expect(page.locator(".search-results .product-card")).toHaveCount(1);
  await page.getByRole("button", { name: /Quick view NOVA Crystal/ }).click();
  await expect(page.getByRole("dialog")).toContainText("NOVA Crystal Hoodie");
  await page.getByRole("radio", { name: "XS", exact: true }).check();
  await page.getByRole("button", { name: "ADD TO BAG", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("YOUR BAG (1)");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "SETS", exact: true }).click();
  await page
    .getByRole("button", { name: "Build your set: NOVA Drop 001 Set, White", exact: true })
    .click();
  await page.getByRole("radio", { name: "M", exact: true }).nth(0).check();
  await page.getByRole("radio", { name: "L", exact: true }).nth(1).check();
  await page
    .getByRole("button", { name: "ADD SET TO BAG", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("YOUR BAG (3)");
  await expect(page.getByRole("dialog")).toContainText("White / Black / M");
  await expect(page.getByRole("dialog")).toContainText("White / L");
});

test("mobile menu, search navigation, filter sheet, hash refresh, and newsletter demo", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const submissions: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") submissions.push(request.url());
  });
  await page.goto("/#/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "SEARCH THE COLLECTION" }).click();
  await page.getByRole("searchbox").fill("essential");
  await page.locator(".search-results .product-image-link").click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).toHaveURL(/nova-essential-hoodie/);
  await page.reload();
  await expect(page.locator("main h1")).toHaveText("NOVA Essential Hoodie");
  await page.goto("/#/shop");
  await page
    .getByRole("button", { name: "FILTER / SORT", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("combobox", { name: "COLOR", exact: true })
    .selectOption("bone");
  await page.getByRole("button", { name: "SHOW RESULTS", exact: true }).click();
  await expect(page.locator(".shop-grid .product-card")).toHaveCount(2);
  await page.goto("/#/");
  await page
    .getByLabel("EMAIL ADDRESS", { exact: true })
    .fill("never-save@example.com");
  await page.getByRole("button", { name: "JOIN", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "Your email wasn’t saved or sent.",
  );
  expect(submissions).toEqual([]);
  expect(
    await page.evaluate(() =>
      JSON.stringify({ ...localStorage, ...sessionStorage }),
    ),
  ).not.toContain("never-save");
});

test("reduced motion removes animation and invalid routes have recovery links", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/");
  expect(
    await page
      .locator(".hero-image")
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
  await page.goto("/#/product/not-a-piece");
  await expect(page.locator("main h1")).toHaveText("Piece not found.");
  await page.goto("/#/unknown");
  await expect(page.getByRole("link", { name: "BACK TO NOVA" })).toBeVisible();
});

test("outlined headings and keyboard focus remain visible on light and dark surfaces", async ({
  page,
}) => {
  for (const [route, stroke] of [
    ["/#/shop", "rgb(23, 23, 21)"],
    ["/#/about", "rgb(23, 23, 21)"],
    ["/#/lookbook", "rgb(244, 243, 238)"],
  ]) {
    await page.goto(route);
    expect(
      await page
        .locator(".outline-type")
        .evaluate((element) =>
          getComputedStyle(element).getPropertyValue(
            "-webkit-text-stroke-color",
          ),
        ),
    ).toBe(stroke);
  }
  await page.goto(productRoute);
  const size = page.getByRole("radio", { name: "M", exact: true });
  await size.check();
  await size.press("Space");
  expect(
    await page
      .locator(".sizes label.selected span")
      .evaluate((element) => getComputedStyle(element).outlineColor),
  ).toBe("rgb(23, 23, 21)");
  await page.keyboard.press("Tab");
  await expect(page.locator(".product-info .add-to-bag")).toBeFocused();
  expect(
    await page
      .locator(".product-info .add-to-bag")
      .evaluate((element) => getComputedStyle(element).outlineColor),
  ).toBe("rgb(23, 23, 21)");
});
