import Link from "next/link";
import { BagIcon, SearchIcon, UserIcon } from "@/components/icons";
import { MobileNav } from "@/components/layout/mobile-nav";
import { navigation } from "@/lib/content";

export function SiteHeader() {
  return (
    <>
      <a
        href="#main"
        className="sr-only label-caps focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:text-canvas"
      >
        Skip to content
      </a>

      <div className="tone-inverse bg-ink py-2.5 text-center label-caps">
        Complimentary express shipping and returns
      </div>

      <header className="glass sticky top-0 z-40 border-b">
        <div className="container-page grid h-header grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex items-center gap-1">
            <MobileNav items={navigation} />
            <Link
              href="/search"
              aria-label="Search"
              className="inline-flex size-10 items-center justify-center lg:-ml-2"
            >
              <SearchIcon />
            </Link>
          </div>

          <Link
            href="/"
            // Negative margin cancels the trailing letter-spacing so the wordmark centres optically.
            className="-mr-[0.28em] font-display text-[1.375rem] leading-none font-medium tracking-[0.28em] uppercase md:text-[1.625rem]"
          >
            Aterlier
          </Link>

          <div className="flex items-center justify-end gap-1">
            <Link
              href="/account"
              aria-label="Account"
              className="hidden size-10 items-center justify-center sm:inline-flex"
            >
              <UserIcon />
            </Link>
            <Link
              href="/cart"
              aria-label="Shopping bag, 0 items"
              className="-mr-2 inline-flex size-10 items-center justify-center"
            >
              <BagIcon />
            </Link>
          </div>
        </div>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="container-page flex justify-center gap-10 pb-4">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-quiet label-caps">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
