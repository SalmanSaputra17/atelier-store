import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductListing, ProductListingSkeleton } from "@/components/product/product-listing";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/catalog";

export async function generateStaticParams() {
  return (await getCategories()).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const category = await getCategoryBySlug((await params).slug);
  if (!category) return {};

  return {
    title: `${category.name} — Aterlier Store`,
    description: `Shop ${category.name.toLowerCase()} at Aterlier, newest pieces first.`,
    openGraph: { images: [{ url: category.image.src, alt: category.image.alt }] },
  };
}

// Same pattern as the product page: params are resolved inside <Suspense> so
// client navigations show the skeleton instantly instead of blocking.
export default function CategoryPage({ params }: PageProps<"/collections/[slug]">) {
  return (
    <main id="main" className="flex-1">
      <Suspense fallback={<ProductListingSkeleton />}>
        <CategoryListing params={params} />
      </Suspense>
    </main>
  );
}

async function CategoryListing({ params }: Pick<PageProps<"/collections/[slug]">, "params">) {
  const category = await getCategoryBySlug((await params).slug);
  if (!category) notFound();

  const products = await getProductsByCategory(category.id);

  return (
    <ProductListing
      eyebrow="Collection"
      title={category.name}
      products={products}
      emptyMessage={`New ${category.name.toLowerCase()} pieces are on their way. Check back soon.`}
      emptyAction={{ label: "Shop new arrivals", href: "/collections/new-in" }}
    />
  );
}
