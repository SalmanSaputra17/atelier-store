# Aterlier Store

Next.js (App Router) + TypeScript + Tailwind CSS v4, with Better Auth, Drizzle ORM and Neon Postgres.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL (use a Neon dev branch) and BETTER_AUTH_SECRET
npm run db:migrate           # create the catalogue tables (migrations in ./drizzle)
npm run db:seed              # load the sample categories, products and stock
npm run dev
```

The database must be reachable for `npm run build`: product pages and the homepage are prerendered from it.

Auth tables are not created yet. When needed: `npm run auth:generate`, add `export * from "./auth-schema";` to `src/db/schema.ts`, then `npm run db:generate && npm run db:migrate`.

## Layout

| Path | Purpose |
| --- | --- |
| `src/db/index.ts` | Drizzle client over the Neon serverless HTTP driver |
| `src/db/schema.ts` | Drizzle schema entry point (used by `drizzle.config.ts`) |
| `src/db/catalog-schema.ts` | `categories`, `products`, `product_stock` tables and relations |
| `src/db/seed.ts`, `seed-data.ts` | Idempotent development seed |
| `src/lib/catalog.ts` | Server-only, cached catalogue queries used by the storefront |
| `src/lib/content.ts` | Static marketing content (navigation, hero, editorial) |
| `src/lib/auth.ts` | Better Auth server instance (Drizzle adapter, `nextCookies` plugin) |
| `src/lib/auth-client.ts` | Better Auth React client |
| `src/app/api/auth/[...all]/route.ts` | Better Auth route handler |
| `drizzle.config.ts` | drizzle-kit config; migrations go to `./drizzle` |

## Scripts

`dev`, `build`, `start`, `lint`, `typecheck`, `db:generate`, `db:migrate`, `db:push`, `db:studio`, `db:seed`, `auth:generate`.
