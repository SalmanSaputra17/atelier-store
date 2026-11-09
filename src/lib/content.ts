// Static marketing content for the storefront. Catalogue data (products, categories,
// stock) lives in Postgres — see src/lib/catalog.ts.
import { unsplash } from "./unsplash";

export type ImageAsset = {
  src: string;
  alt: string;
};

export type Collection = {
  slug: string;
  eyebrow: string;
  title: string;
  image: ImageAsset;
};

export const navigation = [
  { label: "New In", href: "/collections/new-in" },
  { label: "Women", href: "/collections/women" },
  { label: "Men", href: "/collections/men" },
  { label: "Bags", href: "/collections/bags" },
  { label: "Shoes", href: "/collections/shoes" },
  { label: "Jewellery", href: "/collections/jewellery" },
  { label: "Gifts", href: "/collections/gifts" },
];

export type HeroSlide = {
  eyebrow: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
  image: ImageAsset & { position?: string }; // CSS object-position for the wide crop
};

// Homepage carousel, in display order. Slides 2–3 reuse catalogue shots that
// crop well to a wide frame (see the photo rules in CLAUDE.md).
export const heroSlides: HeroSlide[] = [
  {
    eyebrow: "Autumn–Winter 2026",
    title: "The Quiet Season",
    body: "Deep reds, soft tailoring and leather made to be lived in.",
    cta: { label: "Discover the collection", href: "/collections/new-in" },
    image: {
      src: unsplash("1483985988355-763728e1935b"),
      alt: "Woman in a burgundy coat and sunglasses carrying shopping bags",
    },
  },
  {
    eyebrow: "The leather edit",
    title: "Made to be worn in",
    body: "Our biker jacket, re-cut in supple Italian lambskin with a softer shoulder.",
    cta: { label: "Shop the biker jacket", href: "/products/leather-biker-jacket" },
    image: {
      src: unsplash("1727518154538-59e7dc479f8f"),
      alt: "Close-up of a black lambskin biker jacket's studded lapel and asymmetric zip",
      position: "50% 40%",
    },
  },
  {
    eyebrow: "Jewellery",
    title: "Gold, quietly",
    body: "Sculpted teardrops in 18k gold vermeil, textured by hand to catch the light.",
    cta: { label: "Shop jewellery", href: "/collections/jewellery" },
    image: {
      src: unsplash("1705326454933-9685fc6888e1"),
      alt: "Gold teardrop earring hanging from a white display stand",
      position: "50% 45%",
    },
  },
];

export const collections: Collection[] = [
  {
    slug: "women",
    eyebrow: "Women",
    title: "Layered for the city",
    image: {
      src: unsplash("1539109136881-3be0616acf4b"),
      alt: "Woman in a long pale blue coat standing in a cathedral square",
    },
  },
  {
    slug: "men",
    eyebrow: "Men",
    title: "Leather, re-cut",
    image: {
      src: unsplash("1520975954732-35dd22299614"),
      alt: "Man in a black leather jacket crouching on a rooftop ledge",
    },
  },
];

export const editorial = {
  eyebrow: "The edit",
  title: "A wardrobe in neutral",
  body: "Oatmeal knits, washed cotton and undyed linen — pieces chosen to sit together, season after season. Our edit of the quiet essentials, cut generously and finished by hand.",
  image: {
    src: unsplash("1558769132-cb1aea458c5e"),
    alt: "Rail of beige and brown knitwear beside dried pampas grass",
  },
};

export const appointment = {
  eyebrow: "Services",
  title: "Book a private appointment",
  body: "Shop with a client advisor in store or by video call.",
  image: {
    src: unsplash("1445205170230-053b83016050"),
    alt: "Boutique clothing rails lit warmly at night",
  },
};

export type Service = {
  icon: "delivery" | "gift" | "conversation" | "scissors";
  title: string;
  body: string;
  link: { label: string; href: string };
};

export const services: Service[] = [
  {
    icon: "delivery",
    title: "Complimentary shipping",
    body: "Free express delivery and returns on every order, in 2–4 business days.",
    link: { label: "Delivery & returns", href: "/client-services/shipping" },
  },
  {
    icon: "gift",
    title: "Gift wrapping",
    body: "Each order arrives in our signature box with a handwritten note.",
    link: { label: "How we wrap", href: "/client-services" },
  },
  {
    icon: "conversation",
    title: "Client advisors",
    body: "Personal styling advice by phone, chat or private appointment.",
    link: { label: "Book an advisor", href: "/appointments" },
  },
  {
    icon: "scissors",
    title: "Repairs & care",
    body: "Lifetime care for leather goods, from our own workshop.",
    link: { label: "Our workshop", href: "/craftsmanship" },
  },
];
