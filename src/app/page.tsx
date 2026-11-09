import Image from "next/image";
import Link from "next/link";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { NewsletterForm } from "@/components/home/newsletter-form";
import {
  ArrowUpRightIcon,
  ConversationIcon,
  DeliveryIcon,
  GiftIcon,
  ScissorsIcon,
} from "@/components/icons";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/section-heading";
import { getCategories, getNewArrivals } from "@/lib/catalog";
import { appointment, collections, editorial, heroSlides, services, type Service } from "@/lib/content";

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <HeroCarousel slides={heroSlides} />
      <NewArrivals />
      <Collections />
      <Categories />
      <Editorial />
      <Appointment />
      <Services />
      <Newsletter />
    </main>
  );
}

async function NewArrivals() {
  const newArrivals = await getNewArrivals();

  return (
    <section className="container-page section">
      <SectionHeading
        eyebrow="New arrivals"
        title="Just in"
        action={{ label: "View all", href: "/collections/new-in" }}
      />
      <div className="grid-products">
        {newArrivals.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}

function Collections() {
  return (
    <section aria-label="Featured collections" className="grid gap-1 md:grid-cols-2">
      {collections.map((collection) => (
        <Link
          key={collection.slug}
          href={`/collections/${collection.slug}`}
          className="group relative block aspect-editorial overflow-hidden bg-surface"
        >
          <Image
            src={collection.image.src}
            alt={collection.image.alt}
            fill
            sizes="(min-width: 48rem) 50vw, 100vw"
            className="object-cover transition-transform duration-1000 ease-luxe group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 p-gutter">
            <div className="tone-inverse glass-inverse flex items-end justify-between gap-6 border border-canvas/20 p-5 md:p-7">
              <div>
                <p className="label-caps">{collection.eyebrow}</p>
                <h2 className="mt-2 text-heading">{collection.title}</h2>
              </div>
              <span className="shrink-0 label-caps underline decoration-1 underline-offset-[0.25em]">
                Shop now
              </span>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}

async function Categories() {
  const categories = await getCategories();

  return (
    <section className="container-page section">
      <SectionHeading eyebrow="Explore" title="Shop by category" />
      <ul className="-mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-2 overflow-x-auto px-gutter scrollbar-none lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
        {categories.map((category) => (
          <li key={category.slug} className="w-[72%] shrink-0 snap-start sm:w-[40%] lg:w-auto">
            <Link href={`/collections/${category.slug}`} className="group block">
              <div className="media-frame">
                <Image
                  src={category.image.src}
                  alt={category.image.alt}
                  fill
                  sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 40vw, 72vw"
                  className="transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
                />
                <span className="glass absolute inset-x-3 bottom-3 flex items-center justify-between border border-canvas/60 px-4 py-3 label-caps">
                  {category.name}
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Editorial() {
  return (
    <section className="container-page section pt-0">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-editorial overflow-hidden bg-surface">
          <Image
            src={editorial.image.src}
            alt={editorial.image.alt}
            fill
            sizes="(min-width: 64rem) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-md">
          <p className="label-caps text-ink-muted">{editorial.eyebrow}</p>
          <h2 className="mt-3 text-title">{editorial.title}</h2>
          <p className="mt-6 text-body-lg text-ink-muted">{editorial.body}</p>
          <Link href="/journal/neutral-wardrobe" className="btn btn-secondary mt-10">
            Read the edit
          </Link>
        </div>
      </div>
    </section>
  );
}

function Appointment() {
  return (
    <section className="relative flex h-[70svh] min-h-[30rem] max-h-[48rem] items-center overflow-hidden bg-ink">
      <Image
        src={appointment.image.src}
        alt={appointment.image.alt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-ink/15" />
      <div className="relative container-page flex md:justify-end">
        <div className="tone-inverse glass-inverse w-full max-w-md border border-canvas/20 p-8 md:p-12">
          <p className="label-caps">{appointment.eyebrow}</p>
          <h2 className="mt-4 text-title">{appointment.title}</h2>
          <p className="mt-5 text-body-lg text-canvas/85">{appointment.body}</p>
          <Link href="/appointments" className="btn btn-inverse mt-8">
            Book now
          </Link>
        </div>
      </div>
    </section>
  );
}

const serviceIcons: Record<Service["icon"], typeof DeliveryIcon> = {
  delivery: DeliveryIcon,
  gift: GiftIcon,
  conversation: ConversationIcon,
  scissors: ScissorsIcon,
};

function Services() {
  return (
    <section className="container-page section">
      <SectionHeading eyebrow="Client care" title="At your service" />
      {/* Swipeable rail on small screens (as in Shop by category), a 4-up grid on large. */}
      <ul className="-mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-2 overflow-x-auto px-gutter scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {services.map((service, i) => {
          const Icon = serviceIcons[service.icon];
          return (
            <li key={service.title} className="w-[78%] shrink-0 snap-start sm:w-auto">
              <Link
                href={service.link.href}
                className="group relative flex h-full min-h-72 flex-col overflow-hidden border bg-surface p-6 transition-colors duration-500 ease-luxe hover:border-ink hover:bg-canvas md:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="glass inline-flex size-12 items-center justify-center border border-line">
                    <Icon width={22} height={22} />
                  </span>
                  <span className="label-caps tabular-nums text-ink-subtle" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-auto pt-10 text-heading">{service.title}</h3>
                <p className="mt-3 text-body text-ink-muted">{service.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 label-caps">
                  <span className="link-quiet group-hover:decoration-current">{service.link.label}</span>
                  <ArrowUpRightIcon
                    width={14}
                    height={14}
                    className="transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="section bg-surface">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-end lg:gap-20">
        <div className="max-w-md">
          <p className="label-caps text-ink-muted">Newsletter</p>
          <h2 className="mt-3 text-title">First to know</h2>
          <p className="mt-5 text-body-lg text-ink-muted">
            New collections, private sales and stories from the atelier, sent once a month.
          </p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}
