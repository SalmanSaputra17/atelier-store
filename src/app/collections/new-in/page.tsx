import type { Metadata } from "next";
import { ProductListing } from "@/components/product/product-listing";
import { getNewArrivals } from "@/lib/catalog";

// Upper bound for a single page; there is no pagination yet.
const NEW_ARRIVALS_LIMIT = 48;

export const metadata: Metadata = {
  title: "New Arrivals — Aterlier Store",
  description: "The latest ready-to-wear, bags, shoes and jewellery, newest first.",
};

export default async function NewArrivalsPage() {
  const products = await getNewArrivals(NEW_ARRIVALS_LIMIT);

  return (
    <main id="main" className="flex-1">
      <ProductListing
        eyebrow="Just in"
        title="New arrivals"
        intro="The latest pieces from the atelier, newest first."
        products={products}
        emptyMessage="New pieces are on their way. Check back soon."
        emptyAction={{ label: "Return home", href: "/" }}
      />
    </main>
  );
}
