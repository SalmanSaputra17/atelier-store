import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/section-heading";
import { getCategories, getNewArrivals } from "@/lib/catalog";
import { appointment, collections, editorial, hero, services } from "@/lib/content";

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <Hero />
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

function Hero() {
  return (
    <section className="relative h-[85svh] min-h-[34rem] max-h-[60rem] overflow-hidden bg-surface">
      <Image
        src={hero.image.src}
        alt={hero.image.alt}
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/10 to-transparent" />
      <div className="tone-inverse absolute inset-x-0 bottom-0 container-page pb-12 md:pb-20">
        <p className="label-caps">{hero.eyebrow}</p>
        <h1 className="mt-4 text-display">{hero.title}</h1>
        <p className="mt-5 max-w-md text-body-lg text-canvas/85">{hero.body}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
          <Link href="/collections/new-in" className="btn btn-inverse">
            Discover the collection
          </Link>
          <Link href="/collections/women" className="link label-caps">
            Shop women
          </Link>
        </div>
      </div>
    </section>
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
          <div className="absolute inset-0 bg-linear-to-t from-ink/60 via-transparent to-transparent" />
          <div className="tone-inverse absolute inset-x-0 bottom-0 flex flex-col items-center px-gutter pb-10 text-center md:pb-14">
            <p className="label-caps">{collection.eyebrow}</p>
            <h2 className="mt-3 text-title">{collection.title}</h2>
            <span className="mt-6 label-caps underline decoration-1 underline-offset-[0.25em]">
              Shop now
            </span>
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
              </div>
              <p className="mt-4 label-caps">{category.name}</p>
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
    <section className="relative flex h-[70svh] min-h-[28rem] max-h-[48rem] items-center justify-center overflow-hidden bg-ink">
      <Image
        src={appointment.image.src}
        alt={appointment.image.alt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-ink/50" />
      <div className="tone-inverse relative container-prose text-center">
        <p className="label-caps">{appointment.eyebrow}</p>
        <h2 className="mt-4 text-title">{appointment.title}</h2>
        <p className="mt-5 text-body-lg text-canvas/85">{appointment.body}</p>
        <Link href="/appointments" className="btn btn-inverse mt-8">
          Book now
        </Link>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section aria-labelledby="services-heading" className="container-page section">
      <h2 id="services-heading" className="sr-only">
        Our services
      </h2>
      <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <li key={service.title} className="border-t border-ink pt-6">
            <h3 className="label-caps">{service.title}</h3>
            <p className="mt-3 text-body text-ink-muted">{service.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="section bg-surface">
      <div className="container-prose text-center">
        <p className="label-caps text-ink-muted">Newsletter</p>
        <h2 className="mt-3 text-title">First to know</h2>
        <p className="mt-5 text-body-lg text-ink-muted">
          New collections, private sales and stories from the atelier, sent once a month.
        </p>
        <NewsletterForm />
      </div>
    </section>
  );
}
