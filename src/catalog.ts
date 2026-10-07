export const sizes = ["XS", "S", "M", "L", "XL", "2XL"] as const;
export type Size = (typeof sizes)[number];
export type Category = "ALL" | "HOODIES" | "SWEATPANTS" | "SETS" | "ESSENTIALS";
export const categories: Category[] = [
  "ALL",
  "HOODIES",
  "SWEATPANTS",
  "SETS",
  "ESSENTIALS",
];

export interface Product {
  slug: string;
  name: string;
  type: "Hoodie" | "Sweatpants";
  color: string;
  tone: "black" | "bone" | "gray";
  price: number;
  family: string;
  essential?: boolean;
  description: string;
  images: string[];
}

const image = (slug: string, view: string) =>
  `images/products/${slug}-${view}.webp`;
const hoodieDescription =
  "Heavyweight oversized NOVA hoodie featuring a minimal NOVA chest mark and oversized gothic statement graphic.";
const pantsDescription =
  "Relaxed heavyweight sweatpants featuring a minimal NOVA lightning emblem.";

export const products: Product[] = [
  {
    slug: "no-spells-given-hoodie-black",
    name: "No Spells Given Hoodie",
    type: "Hoodie",
    color: "Black / White",
    tone: "black",
    price: 74,
    family: "no-spells",
    description: hoodieDescription,
    images: ["front", "back", "detail"].map((view) =>
      image("no-spells-given-hoodie-black", view),
    ),
  },
  {
    slug: "no-spells-given-hoodie-bone",
    name: "No Spells Given Hoodie",
    type: "Hoodie",
    color: "Bone / Black",
    tone: "bone",
    price: 74,
    family: "no-spells",
    description: hoodieDescription,
    images: ["front", "back", "detail"].map((view) =>
      image("no-spells-given-hoodie-bone", view),
    ),
  },
  {
    slug: "nova-drop-001-sweatpants-black",
    name: "NOVA Drop 001 Sweatpants",
    type: "Sweatpants",
    color: "Black",
    tone: "black",
    price: 64,
    family: "sweatpants",
    description: pantsDescription,
    images: ["front", "back"].map((view) =>
      image("nova-drop-001-sweatpants-black", view),
    ),
  },
  {
    slug: "nova-drop-001-sweatpants-bone",
    name: "NOVA Drop 001 Sweatpants",
    type: "Sweatpants",
    color: "Bone",
    tone: "bone",
    price: 64,
    family: "sweatpants",
    description: pantsDescription,
    images: ["front", "back"].map((view) =>
      image("nova-drop-001-sweatpants-bone", view),
    ),
  },
  {
    slug: "nova-crystal-hoodie",
    name: "NOVA Crystal Hoodie",
    type: "Hoodie",
    color: "Black / Silver",
    tone: "black",
    price: 89,
    family: "crystal",
    description:
      "A heavyweight oversized silhouette with a silver crystal-inspired NOVA statement. Quiet form. Electric detail.",
    images: ["front", "detail"].map((view) =>
      image("nova-crystal-hoodie", view),
    ),
  },
  {
    slug: "nova-essential-hoodie",
    name: "NOVA Essential Hoodie",
    type: "Hoodie",
    color: "Washed Black",
    tone: "black",
    price: 69,
    family: "essential",
    essential: true,
    description:
      "The everyday NOVA silhouette. Clean chest branding, a structured hood, and an easy oversized fit.",
    images: ["front", "back"].map((view) =>
      image("nova-essential-hoodie", view),
    ),
  },
  {
    slug: "nova-monogram-zip-hoodie-gray",
    name: "NOVA Monogram Zip Hoodie",
    type: "Hoodie",
    color: "Heather Gray",
    tone: "gray",
    price: 74,
    family: "monogram-zip-hoodie",
    description:
      "An oversized heather gray zip-up with a boxy silhouette, curved panel seams, split kangaroo pockets and the black NOVA monogram. Pair it with the matching Monogram Sweatpants.",
    images: [
      image("nova-monogram-zip-hoodie-gray", "front"),
      "images/lookbook/nova-monogram-set-gray-lifestyle.webp",
    ],
  },
  {
    slug: "nova-monogram-sweatpants-gray",
    name: "NOVA Monogram Sweatpants",
    type: "Sweatpants",
    color: "Heather Gray",
    tone: "gray",
    price: 64,
    family: "monogram-sweatpants",
    description:
      "Relaxed heather gray sweatpants with wide legs, open hems, curved pale panel seams and the black NOVA monogram. Made to match the Monogram Zip Hoodie.",
    images: [
      image("nova-monogram-sweatpants-gray", "front"),
      "images/lookbook/nova-monogram-set-gray-lifestyle.webp",
    ],
  },
];

export const outfits = [
  {
    tone: "black",
    name: "NOVA Drop 001 Set",
    color: "Black",
    image: "images/lookbook/drop-001-set-black.webp",
    alt: "Coordinated black NOVA lightning hoodie and sweatpants set",
    hoodieSlug: "no-spells-given-hoodie-black",
    pantsSlug: "nova-drop-001-sweatpants-black",
  },
  {
    tone: "bone",
    name: "NOVA Drop 001 Set",
    color: "Bone",
    image: "images/lookbook/drop-001-set-bone.webp",
    alt: "Coordinated bone NOVA lightning hoodie and sweatpants set",
    hoodieSlug: "no-spells-given-hoodie-bone",
    pantsSlug: "nova-drop-001-sweatpants-bone",
  },
  {
    tone: "gray",
    name: "NOVA Monogram Set",
    color: "Heather Gray",
    image: "images/lookbook/nova-monogram-set-gray-studio.webp",
    alt: "Front studio view of the heather gray NOVA monogram zip hoodie and wide-leg sweatpants set",
    hoodieSlug: "nova-monogram-zip-hoodie-gray",
    pantsSlug: "nova-monogram-sweatpants-gray",
  },
] as const;
export type SetTone = (typeof outfits)[number]["tone"];

export const getProduct = (slug: string) =>
  products.find((product) => product.slug === slug);
export const familyColors = (product: Product) =>
  products.filter((item) => item.family === product.family);
export const money = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount,
  );
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export function filterProducts(
  category: Category,
  query = "",
  tone = "all",
): Product[] {
  const search = query.trim().toLowerCase();
  return products.filter(
    (product) =>
      (category === "ALL" ||
        (category === "HOODIES" && product.type === "Hoodie") ||
        (category === "SWEATPANTS" && product.type === "Sweatpants") ||
        (category === "ESSENTIALS" && product.essential)) &&
      (tone === "all" || product.tone === tone) &&
      `${product.name} ${product.color} ${product.type}`
        .toLowerCase()
        .includes(search),
  );
}
