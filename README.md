# NOVA // Drop 001

A static, synthetic fashion storefront built with React, TypeScript, Vite, React Router (HashRouter), and modern CSS. No backend, accounts, payment integrations, or real orders.

## Run locally

Requires Node 24 and npm. From this folder:

```sh
npm install
npm run dev
```

## Verify

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
npm run test:e2e
git diff --check
git status --short
```

End-to-end tests exercise the production build. They use installed Microsoft Edge by default. For another platform, install Playwright Chromium with `npx playwright install chromium` and set `PLAYWRIGHT_CHANNEL=chromium`. Screenshots and traces on failure are ignored by Git. No browser is downloaded during npm installation.

## Demo boundaries

- Six routes: `#/`, `#/shop`, `#/product/:slug`, `#/lookbook`, `#/about`, `#/checkout`.
- Six individual products; coordinated sets add two existing products with independent sizes.
- The bag persists only `{ slug, size, quantity }` in `nova-demo-bag-v1` localStorage. Unknown/tampered items are discarded. If browser storage is disabled, the bag works in memory for the page session.
- Contact, shipping, and fake payment inputs are held only in the form. They are never serialized, logged, transmitted, or stored. The final action produces an in-memory fake receipt and clears the bag/form. Refreshing the receipt returns to an empty checkout.
- Fictional payment number: `4242 4242 4242 4242`; security code: `000`. The form rejects other card numbers. No real payment information should be entered.
- Newsletter submission validates an email locally, clears the input, and shows a demo success state. It saves and sends nothing.
- No external fonts, analytics, inventory service, or commerce SDK. No fetch/XHR calls are made by the application.
- Product/material/fit specifications and delivery choices are fictional. Nothing is sold or shipped.

## Photography

The storefront uses AI-generated product and campaign imagery based on user-supplied NOVA garment and logo references. All images are local WebP assets; the embroidered logo keeps transparency. Product back views and detail images are wired into galleries and hover previews. See [ASSETS.md](ASSETS.md) for provenance and remaining production-photography requirements, [IMAGE-ASSETS.json](IMAGE-ASSETS.json) for dimensions and sizes, and [IMAGE-PROMPTS.json](IMAGE-PROMPTS.json) for the full built-in image-generation prompt set.

## GitHub Pages

`.github/workflows/deploy-pages.yml` checks out the repository, sets up Node 24, configures Pages, runs `npm ci`, lint, typecheck and unit tests, builds, uploads only `dist`, and deploys it. The official actions are pinned to the SHAs in Vite's deployment documentation.

In GitHub repository Settings → Pages, set **Source → GitHub Actions**. Publishing requires an approved commit/push or manual workflow dispatch after the files exist on GitHub. No deployment has been performed during this task.

Vite uses `configure-pages`' `base_path` when provided, supports a root custom domain, and derives the repository name from `GITHUB_REPOSITORY` as a fallback. Local builds use `./` for portability. Image and favicon URLs respect Vite's base. HashRouter keeps product and other sub-pages client-side, so refreshes work on static Pages hosting.

```sh
# Example project-subdirectory validation
PAGES_BASE_PATH=/NOVA/ npm run build
```

Documentation references: [Vite static deployment](https://vite.dev/guide/static-deploy.html), [React Router HashRouter](https://reactrouter.com/api/declarative-routers/HashRouter).

## Accessibility and responsive behavior

Native dialog elements provide focus trapping, background inertness, Escape dismissal, and focus restoration. Controls have accessible names, keyboard radio selection, visible focus, and at least 44px targets for primary mobile actions. Image slots have explicit alt text. Product accordions use native disclosure controls. Route changes focus the page heading; a skip link focuses main content.

Desktop uses editorial layouts, gallery/sticky product information, a three-column catalog, and a right-side bag drawer. Tablet reduces type/layout density. Phones use a full-screen navigation menu, full-width bag/search, a bottom filter sheet, two-column catalog, stacked editorial content, and sticky product Add to Bag. Reduced motion disables animations and transitions. Automated viewport checks cover 1440×900, 1280×800, 1024×768, 834×1194, 768×1024, 430×932, 390×844, and 360×800.

No commits or pushes are authorized until the user explicitly approves.
