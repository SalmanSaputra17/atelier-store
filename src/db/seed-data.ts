// Development seed data for the catalogue tables. Order matters:
// categories are listed in display order, products newest first.
// Photos are from Unsplash and must not show third-party brand marks.
import { unsplash } from "../lib/unsplash";

export type SeedCategory = {
  slug: string;
  name: string;
  imageUrl: string;
  imageAlt: string;
};

export type SeedProduct = {
  slug: string;
  name: string;
  categorySlug: string;
  priceCents: number;
  // Ordered gallery; the first image is the primary (cards, social previews).
  // Extra images must show the same item (e.g. other shots from the same shoot).
  images: { url: string; alt: string }[];
  color: string;
  stock: number;
  description: string;
  details: string[];
  badge?: string;
};

export const seedCategories: SeedCategory[] = [
  {
    slug: "ready-to-wear",
    name: "Ready-to-wear",
    imageUrl: unsplash("1490481651871-ab68de25d43d"),
    imageAlt: "Rail of neutral-toned shirts and knitwear",
  },
  {
    slug: "bags",
    name: "Bags",
    imageUrl: unsplash("1566150905458-1bf1fc113f0d"),
    imageAlt: "Pale pink shoulder bag with a chevron stripe and chain strap",
  },
  {
    slug: "shoes",
    name: "Shoes",
    imageUrl: unsplash("1560343090-f0409e92791a"),
    imageAlt: "Green suede brogue balanced on a peach",
  },
  {
    slug: "jewellery",
    name: "Jewellery",
    imageUrl: unsplash("1599643478518-a784e5dc4c8f"),
    imageAlt: "Gold pendant necklaces with a blue crystal",
  },
];

export const seedProducts: SeedProduct[] = [
  {
    slug: "croc-embossed-shoulder-bag",
    name: "Croc-embossed shoulder bag",
    categorySlug: "bags",
    priceCents: 248000,
    badge: "New",
    images: [{ url: unsplash("1575032617751-6ddec2089882"), alt: "Burgundy croc-embossed leather shoulder bag held by its strap" }],
    color: "Burgundy",
    stock: 12,
    description:
      "A compact shoulder bag in glossy croc-embossed calf leather, closed with a sculpted gold-tone turn-lock. The slim strap sits neatly under the arm.",
    details: [
      "Croc-embossed calf leather",
      "Gold-tone turn-lock closure",
      "Fixed shoulder strap, 24 cm drop",
      "Suede lining with one flat pocket",
      "W 19 × H 22 × D 7 cm",
      "Made in Italy",
    ],
  },
  {
    slug: "leather-biker-jacket",
    name: "Leather biker jacket",
    categorySlug: "ready-to-wear",
    priceCents: 395000,
    badge: "New",
    images: [
      {
        url: unsplash("1727516299214-c4d54704b045"),
        alt: "Black leather biker jacket on a hanger, laid on black satin",
      },
      {
        url: unsplash("1727515192207-3dc860bfd773"),
        alt: "Black leather biker jacket laid flat, showing the asymmetric zip and snap-tab hem",
      },
      {
        url: unsplash("1727518154538-59e7dc479f8f"),
        alt: "Close-up of the biker jacket's lapel stud and asymmetric zip",
      },
    ],
    color: "Black",
    stock: 2,
    description:
      "Our biker jacket, re-cut in supple lambskin with a softer shoulder and a slightly cropped length. An asymmetric zip, studded lapels and snap-tab cuffs and hem keep the classic lines.",
    details: [
      "100% lambskin leather",
      "Cupro lining",
      "Asymmetric front zip closure",
      "Three zipped pockets",
      "Regular fit; true to size",
      "Made in Italy",
    ],
  },
  {
    slug: "suede-pump",
    name: "Suede pump with wooden heel",
    categorySlug: "shoes",
    priceCents: 89000,
    images: [{ url: unsplash("1515347619252-60a4bf4fff4f"), alt: "Pair of navy suede pumps with wooden heels held by the heel counters" }],
    color: "Navy",
    stock: 0,
    description:
      "A rounded pump in brushed navy suede, set on a slim 90 mm heel wrapped in natural wood. Leather-lined, with a cushioned footbed for all-day wear.",
    details: [
      "Suede upper",
      "Leather lining and sole",
      "90 mm wood-wrapped heel",
      "Rounded toe",
      "Made in Italy",
    ],
  },
  {
    slug: "gold-teardrop-earrings",
    name: "Gold teardrop earrings",
    categorySlug: "jewellery",
    priceCents: 64000,
    images: [
      {
        url: unsplash("1705326453273-1c35d7dad309"),
        alt: "Pair of gold teardrop earrings with a textured inset, hanging from a white display stand",
      },
      {
        url: unsplash("1705326454933-9685fc6888e1"),
        alt: "Close-up of a gold teardrop earring and its hinged hoop fastening",
      },
    ],
    color: "Gold",
    stock: 5,
    description:
      "Sculpted teardrops in polished gold vermeil, each set with a hand-textured inset that catches the light. Hung from a hinged hoop that closes neatly against the ear.",
    details: [
      "18k gold vermeil on sterling silver",
      "Hand-textured inset",
      "Hinged hoop fastening",
      "Length 4 cm",
      "Presented in a signature pouch",
    ],
  },
  {
    slug: "leather-top-handle-satchel",
    name: "Leather top-handle satchel",
    categorySlug: "bags",
    priceCents: 186000,
    images: [{ url: unsplash("1594223274512-ad4803739b7c"), alt: "Teal pebbled-leather top-handle satchel resting on a notebook" }],
    color: "Teal",
    stock: 1,
    description:
      "A neat satchel in pebbled calf leather with a rolled top handle and a push-lock flap. Sized for the essentials, with a detachable strap for hands-free days.",
    details: [
      "Pebbled calf leather",
      "Gold-tone push-lock closure",
      "Rolled top handle; detachable strap",
      "Leather lining with slip pocket",
      "W 25 × H 18 × D 10 cm",
      "Made in Italy",
    ],
  },
  {
    slug: "suede-bomber-jacket",
    name: "Suede bomber jacket",
    categorySlug: "ready-to-wear",
    priceCents: 289000,
    badge: "New",
    images: [{ url: unsplash("1591047139829-d91aecb6caea"), alt: "Rust suede bomber jacket on a hanger" }],
    color: "Rust",
    stock: 9,
    description:
      "A bomber in brushed goat suede, washed for a lived-in softness. Rib-knit trims and a two-way zip keep the shape relaxed.",
    details: [
      "100% goat suede",
      "Rib-knit collar, cuffs and hem",
      "Two-way front zip",
      "Utility sleeve pocket",
      "Relaxed fit",
      "Made in Portugal",
    ],
  },
  {
    slug: "floral-wrap-dress",
    name: "Floral silk wrap maxi dress",
    categorySlug: "ready-to-wear",
    priceCents: 215000,
    images: [
      {
        url: unsplash("1624631620545-2f2172803d67"),
        alt: "Woman walking down garden steps in a pale floral wrap maxi dress with a high slit",
      },
      {
        url: unsplash("1624631598136-1afa57b7c80f"),
        alt: "Woman in a pale floral wrap maxi dress with bell sleeves, mid-step on garden stairs",
      },
    ],
    color: "Mint floral",
    stock: 7,
    description:
      "A fluid wrap dress in printed silk crêpe de chine, with a plunging neckline, bell sleeves and a self-tie waist. Falls to the ankle, with a high front slit for ease of movement.",
    details: [
      "100% silk crêpe de chine",
      "Wrap front with self-tie waist",
      "Bell sleeves",
      "Maxi length with front slit",
      "Dry clean only",
      "Made in Italy",
    ],
  },
  {
    slug: "open-knit-poncho",
    name: "Open-knit cotton poncho",
    categorySlug: "ready-to-wear",
    priceCents: 98000,
    images: [{ url: unsplash("1434389677669-e08b4cac3105"), alt: "Cream open-knit poncho with fringe on a wooden hanger" }],
    color: "Ivory",
    stock: 14,
    description:
      "A loose, open-knit poncho in organic cotton, finished with a hand-knotted fringe. Easy to layer over swimwear or a fine knit.",
    details: [
      "100% organic cotton",
      "Hand-knotted fringe",
      "V-neck",
      "One size",
      "Hand wash cold",
      "Made in Portugal",
    ],
  },
];
