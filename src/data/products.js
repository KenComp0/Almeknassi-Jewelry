// Single focused mock product - MAD currency, trilingual
export const products = [
  {
    id: "1",
    name: {
      fr: "Bracelet Alhambra Doré",
      en: "Golden Alhambra Bracelet",
      ar: "سوار الحمراء الذهبي",
    },
    price: 349.0, // MAD
    originalPrice: 499.0,
    category: "bracelets",
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
      "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&q=80",
    ],
    description: {
      fr: "Bracelet iconique trèfle à quatre feuilles en plaqué or 18k. Hypoallergénique, résistant à l'eau, éclat intemporel pour tous les jours et les grandes occasions.",
      en: "Iconic four-leaf clover bracelet in 18k gold plated. Hypoallergenic, water-resistant, timeless shine for everyday and special occasions.",
      ar: "سوار أيقوني بأربع أوراق برسيم مطلي بالذهب عيار 18. مضاد للحساسية، مقاوم للماء، لمعان خالد لكل يوم والمناسبات الخاصة.",
    },
    details: {
      fr: "Plaqué or 18k • Acier inoxydable hypoallergénique • Résistant à l'eau • Longueur 17cm + 3cm extension • Fermoir signature",
      en: "18k gold plated • Hypoallergenic stainless steel • Water resistant • Length 17cm + 3cm extender • Signature clasp",
      ar: "مطلي ذهب 18 قيراط • ستانلس ستيل مضاد للحساسية • مقاوم للماء • الطول 17 سم + 3 سم تمديد • قفل مميز",
    },
    badge: { fr: "Édition Limitée", en: "Limited Edition", ar: "إصدار محدود" },
  },
];

export const categories = [
  { id: "bracelets", name: { fr: "Bracelets", en: "Bracelets", ar: "أساور" }, image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80", count: 1 },
];

export const featuredProducts = products;
