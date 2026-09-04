// Production images - single focused product (Alhambra/ Cuban link set)
export const products = [
  {
    id: "1",
    name: {
      fr: "Parure Alhambra Cuban Dorée",
      en: "Golden Cuban Alhambra Set",
      ar: "طقم كوبي الحمراء الذهبي",
    },
    price: 279.0, // MAD - Owner offer: 279 DH only
    originalPrice: 450.0,
    category: "parure",
    // Order as provided: main + all gallery - local for supply-chain security
    images: [
      "/images/1-braclet.png",
      "/images/1-small-bracelet.png",
      "/images/golden-bracely.png",
      "/images/tiny.png",
      "/images/4-bracelet-in-the-box.png",
      "/images/4-braclet.png",
      "/images/displayed.png",
      "/images/connections-small.png",
      "/images/box.png",
    ],
    // Landing uses first 1 + 3 small
    landingSmall: [
      "/images/1-small-bracelet.png",
      "/images/golden-bracely.png",
      "/images/tiny.png",
    ],
    description: {
      fr: "✨ Le luxe de l'or dans chaque détail… Un coffret raffiné qui attire les regards dès le premier coup d'œil.\n\n💎 Une qualité durable, un éclat exceptionnel et un design parfaitement assorti pour une élégance inoubliable.\n\n👑 Ne vous contentez pas d'un joli bijou… Choisissez un coffret qui vous fera vous sentir vraiment unique, et commandez-le dès maintenant.",
      en: "✨ The luxury of gold in every detail… A refined set that captures attention at first glance.\n\n💎 Lasting quality, exceptional shine, and a perfectly coordinated design for unforgettable elegance.\n\n👑 Don't settle for a beautiful look… Choose a set that makes you feel truly special, and order yours now.",
      ar: "✨ فخامة الذهب في كل تفصيلة… طقم راقٍ يلفت الأنظار من أول نظرة.\n\n💎 جودة تدوم، لمعان استثنائي وتصميم متكامل يمنحك أناقة لا تُنسى.\n\n👑 لا تكتفي بمظهر جميل… اختاري طقمًا يجعلك تشعرين بأنكِ مميزة، اطلبيه الآن.",
    },
    shortDescription: {
      fr: "✨ Le luxe de l'or dans chaque détail… Un coffret raffiné qui attire les regards.",
      en: "✨ The luxury of gold in every detail… A refined set that captures attention.",
      ar: "✨ فخامة الذهب في كل تفصيلة… طقم راقٍ يلفت الأنظار.",
    },
    details: {
      fr: "Plaqué or 18k • Acier inox hypoallergénique • Résistant à l'eau • Longueur collier ~45cm + 5cm extension • Écrin inclus",
      en: "18k gold plated • Hypoallergenic stainless steel • Water resistant • Necklace ~45cm + 5cm extender • Box included",
      ar: "مطلي ذهب 18 • ستانلس ستيل مضاد للحساسية • مقاوم للماء • طول القلادة ~45 سم + 5 سم • العلبة متضمنة",
    },
    badge: { fr: "Nouveauté", en: "New", ar: "جديد" },
  },
];

export const categories = [
  { id: "parure", name: { fr: "Parure", en: "Set", ar: "طقم" }, image: "/images/1-braclet.png", count: 1 },
];

export const featuredProducts = products;
