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

export const hero = {
  eyebrow: "Autumn–Winter 2026",
  title: "The Quiet Season",
  body: "Deep reds, soft tailoring and leather made to be lived in.",
  image: {
    src: unsplash("1483985988355-763728e1935b"),
    alt: "Woman in a burgundy coat and sunglasses carrying shopping bags",
  },
};

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

export const services = [
  {
    title: "Complimentary shipping",
    body: "Free express delivery and returns on every order.",
  },
  {
    title: "Gift wrapping",
    body: "Each order arrives in our signature box with a handwritten note.",
  },
  {
    title: "Client advisors",
    body: "Personal styling advice by phone, chat or appointment.",
  },
  {
    title: "Repairs & care",
    body: "Lifetime care for leather goods, from our own workshop.",
  },
];
