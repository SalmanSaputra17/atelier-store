# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Next.js 16 is newer than most training data: check `node_modules/next/dist/docs/` before using Next APIs (e.g. `middleware` is now `proxy`, `cacheComponents` changes how request data is read).

## Commands

```bash
npm run dev            # dev server (Turbopack)
npm run build          # production build
npm run lint           # ESLint (flat config, eslint-config-next)
npm run typecheck      # tsc --noEmit
npm run db:generate    # drizzle-kit: create SQL migration from src/db/schema.ts → ./drizzle
npm run db:migrate     # apply migrations
npm run db:push        # push schema directly (prototyping)
npm run db:studio      # Drizzle Studio
npm run db:seed        # upsert dev catalogue from src/db/seed-data.ts (resets stock, replaces images, deactivates products not in the seed)
npm run auth:generate  # Better Auth CLI → src/db/auth-schema.ts
```

No test runner is configured yet.

Env vars live in `.env.local` (see `.env.example`): `DATABASE_URL` (Neon pooled URL), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`. `src/db/index.ts` throws at import if `DATABASE_URL` is unset, so `next build` needs it set too.

## Architecture

- **Stack:** Next.js 16 App Router (`src/app`), React 19, TypeScript, Tailwind CSS v4, Better Auth, Drizzle ORM, Neon Postgres. Import alias `@/*` → `src/*`.
- **Tailwind v4** is wired through the `@tailwindcss/turbopack` loader in `next.config.ts` (there is no PostCSS config or `tailwind.config`); theme tokens are in `src/app/globals.css` via `@theme`.
- **Design system** lives entirely in `src/app/globals.css`: `@theme` tokens (semantic colors `canvas`/`surface`/`ink`/`line`, text sizes `label`→`display`, `gutter`/`section` spacing, `page`/`content`/`prose` containers, `product` aspect) plus `@utility` primitives (`container-*`, `section`, `full-bleed`, `grid-products`, `media-frame`, `label-caps`, `hairline`, `link`, `link-quiet`, `btn` + `btn-primary|secondary|inverse|sm|block`). Use these tokens instead of raw Tailwind palette colors; corners stay square and borders default to the `line` color. Light theme only.
- **Storefront UI:** the root layout renders `components/layout/site-header.tsx` (with the client `mobile-nav.tsx`, a native `<dialog>`) and `site-footer.tsx` around every page. Static marketing copy (nav, hero, collections, editorial, services) lives in `src/lib/content.ts`. Remote images are allowed only from `images.unsplash.com` (`next.config.ts`). Wrap text over imagery or dark surfaces in `tone-inverse` so focus rings stay visible.
- **Catalogue data** (Postgres): tables `categories`, `products`, `product_stock`, `product_images` in `src/db/catalog-schema.ts` (explicit snake_case column names; migrations in `./drizzle` — review generated SQL, and hand-add data copies before any `DROP COLUMN`, as in `0001_product_images.sql`). Product images are ordered by `position` (unique per product; 0 = primary, used by cards and social previews); list queries load only the primary image, `getProductBySlug` loads the full gallery. A product may have zero images (UI shows an empty frame). Prices are integer `price_cents` (USD, formatted by `src/lib/format.ts`). Stock is a 1:1 `product_stock.quantity`; in/low/sold-out is derived by `getStockState()` and never stored. All storefront reads go through `src/lib/catalog.ts` (server-only), which maps rows to the UI `Product`/`Category` types. Its functions use `'use cache'` + `cacheLife` + tags (`products`, `product:<slug>`, `categories`) — invalidate those with `updateTag`/`revalidateTag` after writes — except `getStockQuantity()`, which is uncached (`connection()`) and must render inside `<Suspense>`. `next build` queries the database, so `DATABASE_URL` must be reachable at build time.
- **Product pages** (`src/app/products/[slug]/page.tsx`): `generateStaticParams` prerenders every active product from the DB; stock/add-to-bag stream in per request via `ProductAvailability`, but `partialPrefetching` still requires `params` to be awaited inside `<Suspense>` (the page passes the promise to `ProductDetail`, with `ProductSkeleton` as fallback); awaiting at the top level triggers instant-navigation validation errors. `dynamicParams` is unavailable under Cache Components, so unknown slugs call `notFound()` (streamed, so HTTP 200 + `noindex`). Stock state comes from `getStockState()` in `src/lib/stock.ts`. Add-to-bag and newsletter are UI-only; there is no cart yet.
- **Sample photos** (`src/db/seed-data.ts`, `src/lib/content.ts`) must not show third-party brand marks (labels, logos, insoles, clasps) and must not be Unsplash+ (licensed) images. Every image in a product's gallery must show the same item, ideally other shots from the same shoot (same photographer, adjacent `photo-<timestamp>` ids); if none exist, seed a single image rather than a different item.
- **`cacheComponents: true`** is on in `next.config.ts`. Anything that reads the session (`headers()`/`cookies()`) is request-time and must sit behind `<Suspense>`; see the "Authentication with Cache Components" guide in the bundled Next docs.
- **Database:** `src/db/index.ts` exports `db`, a Drizzle client over the Neon serverless HTTP driver (`drizzle-orm/neon-http`; no interactive transactions). `src/db/schema.ts` is the single schema entry point used by both the client and `drizzle.config.ts`; new table files must be re-exported from it.
- **Auth:** `src/lib/auth.ts` is the Better Auth server instance using the Drizzle adapter (`provider: "pg"`) and the shared schema. `nextCookies()` must stay the last plugin. Sign-in methods are not configured yet. The handler is mounted at `src/app/api/auth/[...all]/route.ts`; the client is `src/lib/auth-client.ts` (`better-auth/react`). Server-side session reads use `auth.api.getSession({ headers: await headers() })`.
- **Auth tables** don't exist until `npm run auth:generate` is run and `export * from "./auth-schema";` is added to `src/db/schema.ts`, followed by a migration. Re-run `auth:generate` after adding Better Auth plugins that need tables. The CLI package is `auth` (`@better-auth/cli` is deprecated).
