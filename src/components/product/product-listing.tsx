import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/catalog";

// Shared layout for collection pages (New Arrivals, categories):
// breadcrumb, title block with piece count, then the product grid.
export function ProductListing({
  eyebrow,
  title,
  intro,
  products,
  emptyMessage,
  emptyAction,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  products: Product[];
  emptyMessage: string;
  emptyAction: { label: string; href: string };
}) {
  const count = `${products.length} ${products.length === 1 ? "piece" : "pieces"}`;

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page pt-6 md:pt-8">
        <ol className="flex flex-wrap items-center gap-2 label-caps text-ink-muted">
          <li>
            <Link href="/" className="link-quiet">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            {title}
          </li>
        </ol>
      </nav>

      <header className="container-page mt-8 md:mt-12">
        <p className="label-caps text-ink-muted">{eyebrow}</p>
        <div className="mt-3 flex items-end justify-between gap-6">
          <h1 className="text-title">{title}</h1>
          {products.length > 0 && (
            <p className="shrink-0 text-caption text-ink-muted">{count}</p>
          )}
        </div>
        {intro && <p className="mt-5 max-w-md text-body-lg text-ink-muted">{intro}</p>}
      </header>

      <section aria-labelledby="products-heading" className="container-page section pt-10 md:pt-14">
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>
        {products.length > 0 ? (
          <div className="grid-products border-t pt-8 md:pt-10">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="border-t pt-16 text-center">
            <p className="text-body-lg text-ink-muted">{emptyMessage}</p>
            <Link href={emptyAction.href} className="btn btn-secondary mt-8">
              {emptyAction.label}
            </Link>
          </div>
        )}
      </section>
    </>
  );
}

export function ProductListingSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading products">
      <div className="container-page pt-6 md:pt-8">
        <div className="h-4 w-40 bg-surface" />
      </div>
      <div className="container-page mt-8 md:mt-12">
        <div className="h-3 w-20 bg-surface" />
        <div className="mt-3 h-10 w-64 max-w-full bg-surface" />
      </div>
      <div className="container-page section pt-10 md:pt-14">
        <div className="grid-products border-t pt-8 md:pt-10">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index}>
              <div className="media-frame" />
              <div className="mt-3 h-4 w-3/4 bg-surface" />
              <div className="mt-2 h-3 w-1/3 bg-surface" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
