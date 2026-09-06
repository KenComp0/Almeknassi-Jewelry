// Production images - ImgBB URLs (host-free, no Netlify bandwidth)
export const products = [
  {
    id: "1",
    name: {
      fr: "Coffret RADKO Doré",
      en: "RADKO Gold Set",
      ar: "طقم الرادكو الذهبي",
    },
    price: 279.0,
    originalPrice: 450.0,
    category: "parure",
    video: "https://res.cloudinary.com/fxsqo85y/video/upload/v1788727883/Vedio.mov",
    videoPoster: "https://res.cloudinary.com/fxsqo85y/video/upload/v1788727883/Vedio.jpg",
    images: [
      "https://i.ibb.co/xSKtkc4h/4-braclet.webp",
      "https://i.ibb.co/1JMpSQpB/1-braclet.webp",
      "https://i.ibb.co/Psc78GTf/little-one.webp",
      "https://i.ibb.co/QvQ0ScxK/connections-small.webp",
      "https://i.ibb.co/TxMBfdZr/tiny.webp",
      "https://i.ibb.co/kVxmTJbw/displayed.webp",
      "https://i.ibb.co/fY5Y9yhK/golden-bracely.webp",
    ],
    landingSmall: [
      "https://i.ibb.co/Psc78GTf/little-one.webp",
      "https://i.ibb.co/fY5Y9yhK/golden-bracely.webp",
      "https://i.ibb.co/TxMBfdZr/tiny.webp",
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
      fr: "Acier inox hypoallergénique • Résistant à l'eau • Écrin inclus",
      en: "Hypoallergenic stainless steel • Water resistant • Box included",
      ar: "ستانلس ستيل مضاد للحساسية • مقاوم للماء • العلبة متضمنة",
    },
    badge: { fr: "Nouveauté", en: "New", ar: "جديد" },
  },
];

export const categories = [
  { id: "parure", name: { fr: "Parure", en: "Set", ar: "طقم" }, image: "https://i.ibb.co/1JMpSQpB/1-braclet.webp", count: 1 },
];

export const featuredProducts = products;
