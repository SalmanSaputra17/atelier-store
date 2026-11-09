import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Suspense } from "react";
import { SearchIcon } from "@/components/icons";
import { ProductCard } from "@/components/product/product-card";
import { getCategories, normalizeSearchQuery, searchProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Search — Aterlier Store",
  description: "Search ready-to-wear, bags, shoes and jewellery.",
  robots: { index: false },
};

// searchParams are request data under Cache Components, so they're read inside
// <Suspense>; the fallback is a working empty form so the page is usable at once.
export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <main id="main" className="flex-1">
      <div className="container-page pt-10 md:pt-16">
        <h1 className="label-caps text-ink-muted">Search</h1>
      </div>
      <Suspense fallback={<SearchForm />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

function SearchForm({ query = "" }: { query?: string }) {
  return (
    <div className="container-page mt-4">
      <Form action="/search" role="search" // Focus shows as a thicker underline (the input's own outline is suppressed).
        className="flex items-center gap-3 border-b border-ink focus-within:shadow-[0_1px_0_var(--color-ink)]"
      >
        <SearchIcon className="shrink-0" />
        <label htmlFor="search-query" className="sr-only">
          Search products
        </label>
        <input
          // Remount when the query changes so the field reflects the URL after navigation.
          key={query}
          id="search-query"
          type="search"
          name="q"
          defaultValue={query}
          autoFocus={!query}
          autoComplete="off"
          enterKeyHint="search"
          maxLength={100}
          placeholder="What are you looking for?"
          className="h-14 min-w-0 flex-1 bg-transparent text-heading placeholder:text-ink-subtle focus:outline-none md:h-16"
        />
        <button type="submit" className="btn btn-primary btn-sm shrink-0">
          Search
        </button>
      </Form>
    </div>
  );
}

async function SearchResults({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const query = normalizeSearchQuery((await searchParams).q);

  if (!query) {
    return (
      <>
        <SearchForm />
        <BrowseCategories title="Browse by category" />
      </>
    );
  }

  const results = await searchProducts(query);
  const count = `${results.length} ${results.length === 1 ? "result" : "results"}`;

  return (
    <>
      <SearchForm query={query} />
      <section
        aria-labelledby="results-heading"
        // With no results, the category links follow directly, so drop the bottom padding.
        className={`container-page section pt-8 md:pt-10 ${results.length === 0 ? "pb-0" : ""}`}
      >
        <h2 id="results-heading" className="mb-8 text-body text-ink-muted md:mb-10">
          {results.length > 0 ? (
            <>
              {count} for <span className="text-ink">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            <>
              No results for <span className="text-ink">&ldquo;{query}&rdquo;</span>. Check the
              spelling or try a broader term.
            </>
          )}
        </h2>
        {results.length > 0 && (
          <div className="grid-products">
            {results.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>
      {results.length === 0 && <BrowseCategories title="Or browse by category" />}
    </>
  );
}

async function BrowseCategories({ title }: { title: string }) {
  const categories = await getCategories();

  return (
    <nav aria-labelledby="browse-heading" className="container-page section pt-8 md:pt-10">
      <h2 id="browse-heading" className="label-caps text-ink-muted">
        {title}
      </h2>
      <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
        <li>
          <Link href="/collections/new-in" className="link-quiet text-body-lg">
            New arrivals
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link href={`/collections/${category.slug}`} className="link-quiet text-body-lg">
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
