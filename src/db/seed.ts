// Seeds the catalogue tables with development data: `npm run db:seed`.
// Idempotent: rows are upserted by slug, so re-running updates them in place.
// Note: re-seeding resets stock quantities to the values in seed-data.ts.
import { config } from "dotenv";
import { and, eq, inArray, notInArray, sql, type AnyColumn } from "drizzle-orm";
import { seedCategories, seedProducts } from "./seed-data";

config({ path: [".env.local", ".env"], quiet: true });

// `excluded.<column>` refers to the row that failed to insert in ON CONFLICT DO UPDATE.
const excluded = (column: AnyColumn) => sql.raw(`excluded.${column.name}`);

async function main() {
  // Imported after dotenv so DATABASE_URL is set when the client is created.
  const { db } = await import("./index");
  const { categories, productImages, products, productStock } = await import("./schema");

  const categoryRows = await db
    .insert(categories)
    .values(seedCategories.map((category, index) => ({ ...category, sortOrder: index })))
    .onConflictDoUpdate({
      target: categories.slug,
      set: {
        name: excluded(categories.name),
        imageUrl: excluded(categories.imageUrl),
        imageAlt: excluded(categories.imageAlt),
        sortOrder: excluded(categories.sortOrder),
        updatedAt: sql`now()`,
      },
    })
    .returning({ id: categories.id, slug: categories.slug });

  const categoryId = new Map(categoryRows.map((row) => [row.slug, row.id]));

  // Products are listed newest first; stagger created_at so "new arrivals" keeps that order.
  const now = Date.now();
  const productRows = await db
    .insert(products)
    .values(
      seedProducts.map((product, index) => {
        const id = categoryId.get(product.categorySlug);
        if (!id) throw new Error(`Unknown category "${product.categorySlug}" for ${product.slug}`);
        return {
          slug: product.slug,
          name: product.name,
          categoryId: id,
          priceCents: product.priceCents,
          description: product.description,
          details: product.details,
          color: product.color,
          badge: product.badge ?? null,
          createdAt: new Date(now - index * 60_000),
        };
      }),
    )
    .onConflictDoUpdate({
      target: products.slug,
      set: {
        name: excluded(products.name),
        categoryId: excluded(products.categoryId),
        priceCents: excluded(products.priceCents),
        description: excluded(products.description),
        details: excluded(products.details),
        color: excluded(products.color),
        badge: excluded(products.badge),
        isActive: excluded(products.isActive),
        createdAt: excluded(products.createdAt),
        updatedAt: sql`now()`,
      },
    })
    .returning({ id: products.id, slug: products.slug });

  const productId = new Map(productRows.map((row) => [row.slug, row.id]));

  await db
    .insert(productStock)
    .values(
      seedProducts.map((product) => ({
        productId: productId.get(product.slug)!,
        quantity: product.stock,
      })),
    )
    .onConflictDoUpdate({
      target: productStock.productId,
      set: { quantity: excluded(productStock.quantity), updatedAt: sql`now()` },
    });

  // Images have no natural key, so replace each seeded product's set. The neon-http
  // batch runs as a single transaction: a failure leaves the previous images intact.
  const seededIds = [...productId.values()];
  const imageRows = seedProducts.flatMap((product) =>
    product.images.map((image, position) => ({
      productId: productId.get(product.slug)!,
      url: image.url,
      alt: image.alt,
      position,
    })),
  );
  await db.batch([
    db.delete(productImages).where(inArray(productImages.productId, seededIds)),
    db.insert(productImages).values(imageRows),
  ]);

  // The seed owns the dev catalogue: hide products that are no longer in seed-data.ts
  // (e.g. after a slug change) rather than deleting them.
  const retired = await db
    .update(products)
    .set({ isActive: false })
    .where(and(notInArray(products.id, seededIds), eq(products.isActive, true)))
    .returning({ slug: products.slug });

  console.log(
    `Seeded ${categoryRows.length} categories, ${productRows.length} products, ` +
      `${imageRows.length} images and stock.` +
      (retired.length ? ` Deactivated: ${retired.map((r) => r.slug).join(", ")}.` : ""),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
