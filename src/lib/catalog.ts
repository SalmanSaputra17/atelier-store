import "server-only";

import { and, asc, desc, eq, ne, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { db } from "@/db";
import { categories, productImages, products, productStock } from "@/db/schema";

// Catalogue reads for the storefront. Product and category data is cached
// ('use cache'); stock on the product page is read fresh per request via
// getStockQuantity(). After writes, invalidate with updateTag/revalidateTag
// using the tags below.

export type Category = {
  id: number;
  slug: string;
  name: string;
  image: { src: string; alt: string };
};

export type ProductImage = { src: string; alt: string };

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: { id: number; slug: string; name: string };
  price: number; // minor units (cents)
  // Ordered gallery; list queries load only the primary image.
  images: ProductImage[];
  image?: ProductImage; // = images[0]
  color: string;
  description: string;
  details: string[];
  badge?: string;
  stock: number; // units available; 0 = sold out
};

const productWith = {
  category: { columns: { id: true, slug: true, name: true } },
  stock: { columns: { quantity: true } },
} as const;

const imageColumns = { url: true, alt: true } as const;
// A callback (not an array literal) so the `as const` queries below stay assignable.
const byPosition = () => [asc(productImages.position)];

// Cards only need the primary image; the product page loads the full gallery.
const listQuery = {
  with: {
    ...productWith,
    images: { columns: imageColumns, orderBy: byPosition, limit: 1 },
  },
} as const;

const detailQuery = {
  with: {
    ...productWith,
    images: { columns: imageColumns, orderBy: byPosition },
  },
} as const;

type ProductRow = typeof products.$inferSelect & {
  category: Product["category"];
  stock: { quantity: number } | null;
  images: { url: string; alt: string }[];
};

function toProduct(row: ProductRow): Product {
  const images = row.images.map((image) => ({ src: image.url, alt: image.alt }));
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.priceCents,
    images,
    image: images[0],
    color: row.color,
    description: row.description,
    details: row.details,
    badge: row.badge ?? undefined,
    // A product without a stock row is treated as sold out.
    stock: row.stock?.quantity ?? 0,
  };
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  const rows = await db.query.categories.findMany({
    orderBy: [asc(categories.sortOrder), asc(categories.name)],
  });
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    image: { src: row.imageUrl, alt: row.imageAlt },
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return (await getCategories()).find((category) => category.slug === slug);
}

// Newest first, like the New Arrivals page.
export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  const rows = await db.query.products.findMany({
    ...listQuery,
    where: and(eq(products.isActive, true), eq(products.categoryId, categoryId)),
    orderBy: [desc(products.createdAt)],
  });
  return rows.map(toProduct);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  const rows = await db.query.products.findMany({
    ...listQuery,
    where: eq(products.isActive, true),
    orderBy: [desc(products.createdAt)],
    limit,
  });
  return rows.map(toProduct);
}

export async function getProductSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.isActive, true));
  return rows.map((row) => row.slug);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product:${slug}`);

  const row = await db.query.products.findFirst({
    ...detailQuery,
    where: and(eq(products.slug, slug), eq(products.isActive, true)),
  });
  return row ? toProduct(row) : undefined;
}

// Same category first, then newest.
export async function getRelatedProducts(
  productId: number,
  categoryId: number,
  limit = 4,
): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db.query.products.findMany({
    ...listQuery,
    where: and(eq(products.isActive, true), ne(products.id, productId)),
    orderBy: [desc(sql`${products.categoryId} = ${categoryId}`), desc(products.createdAt)],
    limit,
  });
  return rows.map(toProduct);
}

// Uncached: render inside <Suspense> so availability is fresh on every request.
export async function getStockQuantity(productId: number): Promise<number> {
  await connection();

  const [row] = await db
    .select({ quantity: productStock.quantity })
    .from(productStock)
    .where(eq(productStock.productId, productId));
  return row?.quantity ?? 0;
}
