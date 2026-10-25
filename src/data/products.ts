import productHennaCone from "@/assets/product-henna-cone.jpg";
import productBeginnerKit from "@/assets/product-beginner-kit.jpg";
import productBridalStencils from "@/assets/product-bridal-stencils.jpg";
import productArabicStencils from "@/assets/product-arabic-stencils.jpg";
import productAftercareOil from "@/assets/product-aftercare-oil.jpg";
import productGiftBox from "@/assets/product-gift-box.jpg";
import productHennaPowder from "@/assets/product-henna-powder.jpg";
import productIndopakStencils from "@/assets/product-indopak-stencils.jpg";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stripePriceId: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  image: string;
  isBestseller: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Natural Henna Cone",
    slug: "natural-henna-cone",
    price: 8,
    stripePriceId: "price_benchmark",
    shortDescription: "Pure organic henna, freshly mixed. Rich dark stain, no chemicals.",
    longDescription: "Our signature Natural Henna Cone is crafted from 100% organic Rajasthani henna leaves, freshly mixed to ensure the richest, darkest stain possible. Each cone is free from chemicals, PPD, and artificial dyes — just pure, natural henna the way it was meant to be. Perfect for both beginners and professional artists.",
    category: "Cones",
    image: productHennaCone,
    isBestseller: false,
  },
  {
    id: "2",
    name: "Beginner Henna Kit",
    slug: "beginner-henna-kit",
    price: 28,
    stripePriceId: "price_benchmark",
    shortDescription: "Everything to start your henna journey. 3 cones, 10 stencils, aftercare oil.",
    longDescription: "The perfect introduction to the art of henna. This curated kit includes 3 premium natural henna cones, 10 beginner-friendly stencils with popular designs, a mini aftercare oil, and a step-by-step guide to get you started. Whether you're practicing for a special occasion or exploring a new art form, this kit has everything you need.",
    category: "Kits",
    image: productBeginnerKit,
    isBestseller: false,
  },
  {
    id: "3",
    name: "Bridal Stencil Sheet Pack",
    slug: "bridal-stencil-sheet-pack",
    price: 12,
    stripePriceId: "price_benchmark",
    shortDescription: "20 intricate bridal patterns. Reusable, adhesive-backed.",
    longDescription: "Elevate your bridal henna with our collection of 20 intricate stencil designs, inspired by traditional bridal mehndi from across South Asia and the Middle East. Each stencil is reusable, adhesive-backed for easy application, and designed to create stunning full-hand and half-hand patterns. Perfect for brides, bridal parties, and professional artists.",
    category: "Stencils",
    image: productBridalStencils,
    isBestseller: false,
  },
  {
    id: "4",
    name: "Arabic Pattern Stencil Pack",
    slug: "arabic-pattern-stencil-pack",
    price: 10,
    stripePriceId: "price_benchmark",
    shortDescription: "15 bold geometric Arabic designs for clean, modern henna.",
    longDescription: "Featuring 15 bold, geometric Arabic henna designs, this stencil pack brings the elegance of Arabic mehndi to your fingertips. Known for their flowing lines and open spaces, Arabic patterns create a striking, modern look. Each stencil is reusable and adhesive-backed for precision application.",
    category: "Stencils",
    image: productArabicStencils,
    isBestseller: false,
  },
  {
    id: "5",
    name: "Henna Aftercare Oil",
    slug: "henna-aftercare-oil",
    price: 15,
    stripePriceId: "price_benchmark",
    shortDescription: "Nourishing blend of eucalyptus and lemon to deepen your stain.",
    longDescription: "Maximize the beauty and longevity of your henna with our specially formulated Aftercare Oil. This nourishing blend of eucalyptus, lemon, and tea tree oils works to deepen your stain while keeping your skin moisturized and healthy. Apply after your henna paste has dried and flaked off for the richest, longest-lasting color.",
    category: "Aftercare",
    image: productAftercareOil,
    isBestseller: false,
  },
  {
    id: "6",
    name: "Luxury Bridal Gift Box",
    slug: "luxury-bridal-gift-box",
    price: 65,
    stripePriceId: "price_benchmark",
    shortDescription: "The perfect gift. 5 cones, bridal stencils, aftercare oil, in a gold gift box.",
    longDescription: "The ultimate gift for the bride-to-be. This luxurious gold-embossed gift box contains 5 premium natural henna cones, our bestselling Bridal Stencil Sheet Pack, a full-size Aftercare Oil, and a beautifully illustrated guide to bridal henna traditions. Presented in an exquisite gold box, it's a gift as beautiful as the art it creates.",
    category: "Gift Boxes",
    image: productGiftBox,
    isBestseller: true,
  },
  {
    id: "7",
    name: "Henna Powder 100g",
    slug: "henna-powder-100g",
    price: 18,
    stripePriceId: "price_benchmark",
    shortDescription: "Pure Rajasthani henna powder. For artists who mix their own paste.",
    longDescription: "For the discerning artist who prefers to mix their own paste, our 100g Rajasthani Henna Powder is triple-sifted for the finest consistency. Sourced directly from the henna farms of Rajasthan, India, this powder produces a rich, dark stain with excellent body art quality. Includes mixing instructions for the perfect paste consistency.",
    category: "Cones",
    image: productHennaPowder,
    isBestseller: false,
  },
  {
    id: "8",
    name: "Indo-Pak Stencil Sheet Pack",
    slug: "indo-pak-stencil-sheet-pack",
    price: 10,
    stripePriceId: "price_benchmark",
    shortDescription: "18 traditional Indo-Pak patterns from full hand to finger designs.",
    longDescription: "Celebrate the rich tradition of Indo-Pakistani mehndi with this collection of 18 authentic stencil designs. From elaborate full-hand patterns to delicate finger designs, each stencil captures the intricate beauty of traditional South Asian henna art. Reusable and adhesive-backed for effortless application.",
    category: "Stencils",
    image: productIndopakStencils,
    isBestseller: false,
  },
];

export const categories = ["All", "Cones", "Kits", "Stencils", "Aftercare", "Gift Boxes"];

export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
