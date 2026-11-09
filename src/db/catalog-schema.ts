import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  imageAlt: text("image_alt").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const products = pgTable(
  "products",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    // Minor units (cents), single currency (USD) — see src/lib/format.ts.
    priceCents: integer("price_cents").notNull(),
    description: text("description").notNull(),
    details: text("details")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    color: text("color").notNull(),
    badge: text("badge"),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (table) => [
    index("products_category_id_idx").on(table.categoryId),
    index("products_created_at_idx").on(table.createdAt),
    check("products_price_cents_non_negative", sql`${table.priceCents} >= 0`),
  ],
);

// 1:1 with products. Kept separate so stock can be read fresh while product data is cached.
// In/low/sold-out state is derived in app code (src/lib/stock.ts), never stored.
export const productStock = pgTable(
  "product_stock",
  {
    productId: integer("product_id")
      .primaryKey()
      .references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(0),
    updatedAt: timestamps.updatedAt,
  },
  (table) => [check("product_stock_quantity_non_negative", sql`${table.quantity} >= 0`)],
);

// Ordered gallery images; position 0 is the primary image (cards, social previews).
export const productImages = pgTable(
  "product_images",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt").notNull(),
    position: integer("position").notNull().default(0),
    createdAt: timestamps.createdAt,
  },
  (table) => [
    unique("product_images_product_id_position_unique").on(table.productId, table.position),
    check("product_images_position_non_negative", sql`${table.position} >= 0`),
  ],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  stock: one(productStock),
  images: many(productImages),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productStockRelations = relations(productStock, ({ one }) => ({
  product: one(products, {
    fields: [productStock.productId],
    references: [products.id],
  }),
}));
