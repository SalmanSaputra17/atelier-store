import Link from "next/link";

const columns = [
  {
    title: "Client services",
    links: [
      { label: "Contact us", href: "/client-services" },
      { label: "Shipping", href: "/client-services/shipping" },
      { label: "Returns", href: "/client-services/returns" },
      { label: "Book an appointment", href: "/appointments" },
    ],
  },
  {
    title: "The house",
    links: [
      { label: "About Aterlier", href: "/about" },
      { label: "Craftsmanship", href: "/craftsmanship" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/legal/privacy" },
      { label: "Terms of sale", href: "/legal/terms" },
      { label: "Cookie settings", href: "/legal/cookies" },
      { label: "Accessibility", href: "/legal/accessibility" },
    ],
  },
  {
    title: "Follow",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Pinterest", href: "https://pinterest.com" },
      { label: "Journal", href: "/journal" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="tone-inverse bg-ink">
      <div className="container-page pt-16 pb-10 md:pt-24">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="label-caps">{column.title}</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="link-quiet text-body text-canvas/70 transition-colors hover:text-canvas"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col gap-8 border-t border-canvas/15 pt-8 md:flex-row md:items-end md:justify-between">
          <p className="text-title tracking-[0.32em] uppercase">Aterlier</p>
          <div className="flex flex-col gap-2 text-caption text-canvas/60 md:items-end">
            <span>United States (USD)</span>
            <span>© 2026 Aterlier. Sample storefront.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
