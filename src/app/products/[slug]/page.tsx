import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToBag } from "@/components/product/add-to-bag";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { StockStatus } from "@/components/product/stock-status";
import { SectionHeading } from "@/components/section-heading";
import {
  getProductBySlug,
  getProductSlugs,
  getRelatedProducts,
  getStockQuantity,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { getStockState } from "@/lib/stock";

export async function generateStaticParams() {
  return (await getProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};

  return {
    title: `${product.name} — Aterlier Store`,
    description: product.description,
    openGraph: { images: product.images.map((image) => ({ url: image.src, alt: image.alt })) },
  };
}

// Params are request data under Cache Components; resolving them inside <Suspense>
// lets client navigations show the skeleton instantly instead of blocking.
export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <main id="main" className="flex-1">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetail params={params} />
      </Suspense>
    </main>
  );
}

async function ProductDetail({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.category.id);
  const categoryHref = `/collections/${product.category.slug}`;

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
          <li>
            <Link href={categoryHref} className="link-quiet">
              {product.category.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="container-page mt-6 grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16 xl:gap-24">
        <ProductGallery product={product} />

        <div>
          <div className="lg:sticky lg:top-36">
            <p className="label-caps text-ink-muted">{product.category.name}</p>
            <h1 className="mt-3 text-heading">{product.name}</h1>
            <p className="mt-2 text-body-lg">{formatPrice(product.price)}</p>

            <dl className="mt-8 border-t pt-6">
              <div className="flex gap-2 text-body">
                <dt className="text-ink-muted">Colour</dt>
                <dd>{product.color}</dd>
              </div>
            </dl>

            <Suspense fallback={<AvailabilitySkeleton />}>
              <ProductAvailability productId={product.id} />
            </Suspense>

            <ul className="mt-6 flex flex-col gap-1 text-caption text-ink-muted">
              <li>Complimentary express shipping and returns</li>
              <li>Signature gift wrapping on every order</li>
            </ul>

            <p className="mt-10 text-body text-ink-muted">{product.description}</p>

            <div className="mt-8 border-b">
              <details className="disclosure" open>
                <summary>Details</summary>
                <ul className="flex list-disc flex-col gap-1.5 pb-6 pl-4 text-body text-ink-muted">
                  {product.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </details>
              <details className="disclosure">
                <summary>Shipping &amp; returns</summary>
                <p className="pb-6 text-body text-ink-muted">
                  Complimentary express delivery in 2–4 business days. Returns are free within
                  30 days of delivery, in original condition with tags attached.
                </p>
              </details>
              <details className="disclosure">
                <summary>Care</summary>
                <p className="pb-6 text-body text-ink-muted">
                  Store in the dust bag provided, away from direct sunlight. Our workshop offers
                  complimentary care and repairs for the life of the piece.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>

      <section className="container-page section">
        <SectionHeading
          eyebrow="Discover"
          title="You may also like"
          action={{ label: "View all", href: categoryHref }}
        />
        <div className="grid-products">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>
    </>
  );
}

// Stock is read per request (uncached) so the page never shows a stale "In stock".
async function ProductAvailability({ productId }: { productId: number }) {
  const stock = await getStockQuantity(productId);
  const soldOut = getStockState(stock) === "sold_out";

  return (
    <>
      <div className="mt-3">
        <StockStatus stock={stock} />
      </div>
      <div className="mt-8 flex flex-col gap-3">
        <AddToBag soldOut={soldOut} />
        <Link href="/appointments" className="btn btn-secondary btn-block">
          {soldOut ? "Ask a client advisor" : "Book an appointment"}
        </Link>
      </div>
    </>
  );
}

function AvailabilitySkeleton() {
  return (
    <div aria-busy="true" aria-label="Checking availability">
      <div className="mt-3 h-5 w-24 bg-surface" />
      <div className="mt-8 flex flex-col gap-3">
        <div className="h-12 bg-surface" />
        <div className="h-[1lh] text-caption" />
        <div className="h-12 bg-surface" />
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading product">
      <div className="container-page pt-6 md:pt-8">
        <div className="h-4 w-48 bg-surface" />
      </div>
      <div className="container-page mt-6 grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16 xl:gap-24">
        <div className="-mx-gutter lg:mx-0">
          <div className="w-[88%] sm:w-[60%] lg:w-auto">
            <div className="media-frame" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-3 w-24 bg-surface" />
          <div className="h-7 w-3/4 bg-surface" />
          <div className="h-5 w-20 bg-surface" />
          <div className="mt-8 h-12 w-full bg-surface" />
          <div className="h-12 w-full bg-surface" />
        </div>
      </div>
    </div>
  );
}
