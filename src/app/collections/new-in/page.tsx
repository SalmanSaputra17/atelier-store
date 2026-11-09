import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { getNewArrivals } from "@/lib/catalog";

// Upper bound for a single page; there is no pagination yet.
const NEW_ARRIVALS_LIMIT = 48;

export const metadata: Metadata = {
  title: "New Arrivals — Aterlier Store",
  description: "The latest ready-to-wear, bags, shoes and jewellery, newest first.",
};

export default async function NewArrivalsPage() {
  const products = await getNewArrivals(NEW_ARRIVALS_LIMIT);
  const count = `${products.length} ${products.length === 1 ? "piece" : "pieces"}`;

  return (
    <main id="main" className="flex-1">
      <nav aria-label="Breadcrumb" className="container-page pt-6 md:pt-8">
        <ol className="flex flex-wrap items-center gap-2 label-caps text-ink-muted">
          <li>
            <Link href="/" className="link-quiet">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            New arrivals
          </li>
        </ol>
      </nav>

      <header className="container-page mt-8 md:mt-12">
        <p className="label-caps text-ink-muted">Just in</p>
        <div className="mt-3 flex items-end justify-between gap-6">
          <h1 className="text-title">New arrivals</h1>
          {products.length > 0 && (
            <p className="shrink-0 text-caption text-ink-muted">{count}</p>
          )}
        </div>
        <p className="mt-5 max-w-md text-body-lg text-ink-muted">
          The latest pieces from the atelier, newest first.
        </p>
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
            <p className="text-body-lg text-ink-muted">
              New pieces are on their way. Check back soon.
            </p>
            <Link href="/" className="btn btn-secondary mt-8">
              Return home
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
