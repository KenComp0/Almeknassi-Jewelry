import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { products } from "../data/products";
import { useLanguage } from "../i18n/LanguageContext";
import MarbleBackground from "../components/MarbleBackground";
import OrderModal from "../components/OrderModal";

export default function Product() {
  const { id } = useParams();
  const { lang, formatPrice } = useLanguage();
  const product = products.find((p) => p.id === (id || "1")) || products[0];
  const name = typeof product.name === "object" ? product.name[lang] : product.name;
  const [showOrder, setShowOrder] = useState(false);

  const tFunnel = {
    fr: {
      sec1_title: "✨ Le luxe de la brillance dorée dans chaque détail",
      sec1_desc: "Un ensemble complet au design raffiné et à l'éclat doré qui attire les regards dès le premier coup d'œil.",
      sec1_list: "Collier • Bracelet • Bague • Boucles",
      sec1_box: "🎁 Avec coffret de luxe",
      sec1_price: "Offre : 279 DH seulement",
      sec1_cta: "🛍️ Commande ton ensemble maintenant",
      sec2_title: "🎁 Une expérience d'ouverture à vivre",
      sec2_desc: "Dès que tu ouvres le coffret, tu découvres un ensemble complet aux détails pensés pour se compléter.",
      sec2_cta: "Je veux cet ensemble",
      sec3_title: "✨ Des détails qui font la différence",
      sec3_desc: "Collier au design élégant et à l'éclat doré distinctif, avec des finitions fines qui lui donnent une présence autour du cou. Facile à associer au quotidien et en soirée.",
      sec4_title: "🔐 Même les petits détails sont soignés",
      sec4_desc: "Fermoir au design élégant inspiré des bijoux de luxe, pour une touche plus chic et distinctive.",
      sec5_title: "👑 Une élégance qui se voit au premier regard",
      sec5_desc: "Un ensemble coordonné collier, bracelet, bague et boucles dans un seul design, pour une présence élégante et complète.",
      sec6_title: "💍 Bague au design audacieux et élégant",
      sec6_desc: "Des détails assortis au reste de l'ensemble, pour une allure complète jusque dans les moindres détails.",
      sec6_sizes: "Tailles disponibles: 6 • 7 • 8 • 9 • 10",
      sec7_title: "✨ Légère, élégante, et conçue pour compléter l'ensemble",
      sec7_desc: "Boucles au design assorti, pour une allure complète de la tête à la main.",
      sec8_title: "🎁 Car le luxe commence par la présentation",
      sec8_desc: "Ton ensemble arrive dans un coffret luxueux et élégant, qui garde les pièces rangées et en fait un cadeau idéal pour toi ou un proche.",
      sec8_list: "Collier + Bracelet + Bague + Boucles + Coffret",
      sec9: [
        { icon: "💧", title: "Résistant à l'eau" },
        { icon: "🌸", title: "Peau sensible" },
        { icon: "✨", title: "Résistant sueur & parfum" },
        { icon: "🛡️", title: "Garantie 2 ans" },
        { icon: "🚚", title: "Livraison partout au Maroc" },
        { icon: "💵", title: "Paiement à la livraison" },
      ],
      sec10_title: "❤️ Essaie sans inquiétude",
      sec10_desc: "Tu n'as rien à payer d'avance.",
      sec10_points: ["🚚 Nous livrons jusqu'à ta porte.", "👀 Tu peux vérifier le colis avant de payer.", "💵 Tu ne paies qu'après vérification.", "Si le produit ne te convient pas, tu peux refuser le colis."],
      sec11_title: "279 DH seulement",
      sec11_sub: "✨ L'ensemble complet",
      sec11_list: "Collier + Bracelet + Bague + Boucles\n🎁 + Coffret de luxe",
      sec11_price: "279 DH seulement",
      sec11_benefits: ["🚚 Livraison gratuite", "💵 Paiement à la livraison", "👀 Vérifie avant de payer"],
      sec11_cta: "Commande maintenant",
    },
    en: {
      sec1_title: "✨ The luxury of golden shine in every detail",
      sec1_desc: "A complete set with refined design and golden shine that catches eyes at first glance.",
      sec1_list: "Necklace • Bracelet • Ring • Earrings",
      sec1_box: "🎁 With luxury box",
      sec1_price: "Offer: 279 MAD only",
      sec1_cta: "🛍️ Order your set now",
      sec2_title: "🎁 An unboxing experience worth living",
      sec2_desc: "From the moment you open the box, discover a complete set with details designed to complement each other.",
      sec2_cta: "I want this set",
      sec3_title: "✨ Details that make the difference",
      sec3_desc: "Elegant necklace with distinctive golden shine and fine details for a clear presence around the neck. Easy to style daily and for events.",
      sec4_title: "🔐 Even small details are carefully crafted",
      sec4_desc: "Elegant clasp inspired by luxury jewelry, for a more chic touch.",
      sec5_title: "👑 Elegance visible at first glance",
      sec5_desc: "Coordinated set — necklace, bracelet, ring and earrings in one design for a complete elegant look.",
      sec6_title: "💍 Bold and elegant ring design",
      sec6_desc: "Details matching the rest of the set, for a complete look down to the smallest detail.",
      sec6_sizes: "Available sizes: 6 • 7 • 8 • 9 • 10",
      sec7_title: "✨ Light, elegant, designed to complete the set",
      sec7_desc: "Matching earrings for a complete head-to-hand look.",
      sec8_title: "🎁 Because luxury starts with presentation",
      sec8_desc: "Your set comes in a luxurious elegant box, keeping pieces organized and perfect as a gift.",
      sec8_list: "Necklace + Bracelet + Ring + Earrings + Box",
      sec9: [
        { icon: "💧", title: "Water resistant" },
        { icon: "🌸", title: "Sensitive skin" },
        { icon: "✨", title: "Sweat & perfume resistant" },
        { icon: "🛡️", title: "2-year warranty" },
        { icon: "🚚", title: "Delivery all over Morocco" },
        { icon: "💵", title: "Cash on delivery" },
      ],
      sec10_title: "❤️ Try without worry",
      sec10_desc: "You pay nothing in advance.",
      sec10_points: ["🚚 We deliver to your door.", "👀 You can check the parcel before paying.", "💵 You pay only after verification.", "If not as expected, you can refuse the parcel."],
      sec11_title: "279 MAD only",
      sec11_sub: "✨ The complete set",
      sec11_list: "Necklace + Bracelet + Ring + Earrings\n🎁 + Luxury box",
      sec11_price: "279 MAD only",
      sec11_benefits: ["🚚 Free delivery", "💵 Cash on delivery", "👀 Check before paying"],
      sec11_cta: "Order now",
    },
    ar: {
      sec1_title: "✨ فخامة اللمعة الذهبية في كل تفصيلة",
      sec1_desc: "طقم متكامل بتصميم راقٍ ولمعة ذهبية تلفت الأنظار من أول نظرة.",
      sec1_list: "سلسلة • سوار • خاتم • أقراط",
      sec1_box: "🎁 مع علبة فاخرة",
      sec1_price: "العرض: 279 درهم فقط",
      sec1_cta: "🛍️ اطلبي طقمك الآن",
      sec2_title: "🎁 تجربة فتح تستحق أن تعيشيها",
      sec2_desc: "من أول لحظة تفتحين فيها العلبة، ستكتشفين طقمًا متكاملًا بتفاصيل مصممة لتكمل بعضها البعض.",
      sec2_cta: "أريد هذا الطقم",
      sec3_title: "✨ تفاصيل تصنع الفرق",
      sec3_desc: "سلسلة بتصميم أنيق ولمعة ذهبية مميزة، مع تفاصيل دقيقة تمنحها حضورًا واضحًا حول الرقبة. تصميم فاخر يمكنك تنسيقه بسهولة مع إطلالاتك اليومية والمناسبات.",
      sec4_title: "🔐 حتى التفاصيل الصغيرة صُممت بعناية",
      sec4_desc: "مشبك بتصميم أنيق ومستوحى من تفاصيل المجوهرات الفاخرة، ليمنح السلسلة لمسة أكثر أناقة وتميزًا.",
      sec5_title: "👑 أناقة تظهر من أول نظرة",
      sec5_desc: "طقم متناسق يجمع السلسلة والسوار والخاتم والأقراط في تصميم واحد، ليمنح إطلالتك حضورًا أنيقًا ومتكاملًا.",
      sec6_title: "💍 خاتم بتصميم جريء وأنيق",
      sec6_desc: "تفاصيل متناسقة مع باقي قطع الطقم، لتبقى إطلالتك متكاملة حتى في أصغر التفاصيل.",
      sec6_sizes: "متوفر بالمقاسات: 6 • 7 • 8 • 9 • 10",
      sec7_title: "✨ خفيفة، أنيقة، ومصممة لتكمّل الطقم",
      sec7_desc: "أقراط بتصميم متناسق مع باقي القطع، لإطلالة كاملة وأنيقة من الرأس إلى اليد.",
      sec8_title: "🎁 لأن الفخامة تبدأ من طريقة التقديم",
      sec8_desc: "طقمك يأتي داخل علبة فاخرة وأنيقة، تحافظ على ترتيب القطع وتجعله خيارًا مثاليًا لكِ أو كهدية لمن تحبين.",
      sec8_list: "السلسلة + السوار + الخاتم + الأقراط + العلبة",
      sec9: [
        { icon: "💧", title: "مقاوم للماء" },
        { icon: "🌸", title: "مناسب للبشرة الحساسة" },
        { icon: "✨", title: "مقاوم للعرق والعطر" },
        { icon: "🛡️", title: "ضمان لمدة سنتين" },
        { icon: "🚚", title: "التوصيل لجميع أنحاء المغرب" },
        { icon: "💵", title: "الدفع عند الاستلام" },
      ],
      sec10_title: "❤️ جربي الشراء بدون قلق",
      sec10_desc: "لا تحتاجين إلى دفع أي شيء مسبقًا.",
      sec10_points: ["🚚 نوصله حتى باب منزلك.", "👀 يمكنك فحص الطرد قبل الدفع.", "💵 تدفعين فقط بعد التأكد من طلبك.", "إذا لم يكن المنتج كما توقعتِ، يمكنك رفض الطرد."],
      sec11_title: "279 درهم فقط",
      sec11_sub: "✨ الطقم الكامل",
      sec11_list: "سلسلة + سوار + خاتم + أقراط\n🎁 + علبة فاخرة",
      sec11_price: "279 درهم فقط",
      sec11_benefits: ["🚚 التوصيل مجاني", "💵 الدفع عند الاستلام", "👀 افحصيه قبل الدفع"],
      sec11_cta: "اطلبيه الآن",
    },
  }[lang];

  // Image order per owner: 2, video, 4, 1, 7, 8, 6, 3
  const img = {
    heroFull: "/images/4-braclet.png",
    videoPoster: "/images/4-bracelet-in-the-box.png",
    chain: "/images/1-braclet.png",
    clasp: "/images/golden-bracely.png",
    bust: "/images/displayed.png",
    ring: "/images/tiny.png",
    earrings: "/images/connections-small.png",
    boxFull: "/images/4-bracelet-in-the-box.png",
  };

  return (
    <div className="bg-white">
      {/* 1️⃣ HERO - full set on satin */}
      <section className="relative bg-white">
        <div className="w-full">
          <img src={img.heroFull} alt={name} className="w-full h-auto object-cover max-h-[85vh]" width={1200} height={900} loading="eager" fetchPriority="high" decoding="async" />
        </div>
        <div className="container-luxury py-8 text-center" dir={lang === "ar" ? "rtl" : "ltr"}>
          <h1 className="font-playfair text-2xl md:text-3xl leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>{tFunnel.sec1_title}</h1>
          <p className="text-secondary mt-3 max-w-2xl mx-auto text-sm leading-relaxed">{tFunnel.sec1_desc}</p>
          <p className="mt-3 text-sm font-medium tracking-wide">{tFunnel.sec1_list}</p>
          <p className="mt-2 text-sm">{tFunnel.sec1_box}</p>
          <p className="mt-3 text-lg font-semibold">{tFunnel.sec1_price} <span className="text-sm font-normal text-secondary">({formatPrice(product.price)})</span></p>
          <button onClick={() => setShowOrder(true)} className="mt-6 w-full md:w-auto bg-black text-white px-10 py-4 rounded-full text-sm tracking-widest uppercase hover:bg-[#1a1a1a] shadow-lg">
            {tFunnel.sec1_cta}
          </button>
        </div>
      </section>

      {/* 2️⃣ VIDEO */}
      <section className="bg-[#FDFBF7] py-10">
        <div className="container-luxury max-w-3xl mx-auto text-center">
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center group cursor-pointer" onClick={() => setShowOrder(true)}>
            <img src={img.videoPoster} alt="video poster" className="w-full h-full object-cover opacity-90" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="black"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
          <h2 className="font-playfair text-xl mt-6">{tFunnel.sec2_title}</h2>
          <p className="text-secondary text-sm mt-2 max-w-xl mx-auto">{tFunnel.sec2_desc}</p>
          <button onClick={() => setShowOrder(true)} className="mt-5 bg-white border border-black text-black px-8 py-3 rounded-full text-sm hover:bg-black hover:text-white">
            {tFunnel.sec2_cta}
          </button>
        </div>
      </section>

      {/* 3️⃣ Chain alone */}
      <section className="bg-white py-10">
        <div className="container-luxury max-w-3xl mx-auto">
          <img src={img.chain} alt="chain" className="w-full h-auto rounded-2xl object-cover max-h-[70vh]" loading="lazy" decoding="async" width={900} height={900} />
          <div className="text-center mt-6">
            <h2 className="font-playfair text-xl">{tFunnel.sec3_title}</h2>
            <p className="text-secondary text-sm mt-2 max-w-xl mx-auto leading-relaxed">{tFunnel.sec3_desc}</p>
          </div>
        </div>
      </section>

      {/* 4️⃣ Clasp */}
      <section className="bg-[#FDFBF7] py-10">
        <div className="container-luxury max-w-2xl mx-auto text-center">
          <img src={img.clasp} alt="clasp" className="w-full h-auto rounded-2xl object-cover max-h-[60vh] mx-auto" loading="lazy" decoding="async" width={700} height={700} />
          <h2 className="font-playfair text-xl mt-6">{tFunnel.sec4_title}</h2>
          <p className="text-secondary text-sm mt-2">{tFunnel.sec4_desc}</p>
        </div>
      </section>

      {/* 5️⃣ Bust - large on mobile */}
      <section className="bg-white py-0">
        <img src={img.bust} alt="bust" className="w-full h-auto object-cover md:max-h-[85vh]" loading="lazy" decoding="async" width={1200} height={900} />
        <div className="container-luxury max-w-3xl mx-auto text-center py-8">
          <h2 className="font-playfair text-xl md:text-2xl">{tFunnel.sec5_title}</h2>
          <p className="text-secondary text-sm mt-2">{tFunnel.sec5_desc}</p>
        </div>
      </section>

      {/* 6️⃣ Ring */}
      <section className="bg-[#FDFBF7] py-10">
        <div className="container-luxury max-w-2xl mx-auto text-center">
          <img src={img.ring} alt="ring" className="w-full max-w-md mx-auto h-auto rounded-2xl object-cover" loading="lazy" decoding="async" width={600} height={600} />
          <h2 className="font-playfair text-xl mt-6">{tFunnel.sec6_title}</h2>
          <p className="text-secondary text-sm mt-2">{tFunnel.sec6_desc}</p>
          <p className="mt-3 text-xs tracking-widest font-medium bg-white inline-block px-4 py-2 rounded-full border">{tFunnel.sec6_sizes}</p>
        </div>
      </section>

      {/* 7️⃣ Earrings */}
      <section className="bg-white py-10">
        <div className="container-luxury max-w-xl mx-auto text-center">
          <img src={img.earrings} alt="earrings" className="w-full h-auto rounded-2xl object-cover max-h-[50vh] mx-auto" loading="lazy" decoding="async" width={700} height={500} />
          <h2 className="font-playfair text-lg mt-6">{tFunnel.sec7_title}</h2>
          <p className="text-secondary text-sm mt-2">{tFunnel.sec7_desc}</p>
        </div>
      </section>

      {/* 8️⃣ Box + full set */}
      <section className="bg-[#FDFBF7] py-10">
        <div className="container-luxury max-w-3xl mx-auto text-center">
          <img src={img.boxFull} alt="box full set" className="w-full h-auto rounded-2xl object-cover" loading="lazy" decoding="async" width={900} height={700} />
          <h2 className="font-playfair text-xl mt-6">{tFunnel.sec8_title}</h2>
          <p className="text-secondary text-sm mt-2">{tFunnel.sec8_desc}</p>
          <p className="mt-4 font-medium text-sm whitespace-pre-line">{tFunnel.sec8_list}</p>
        </div>
      </section>

      {/* 9️⃣ Quality icons */}
      <section className="bg-white py-10 border-y border-border">
        <div className="container-luxury max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
          {tFunnel.sec9.map((it) => (
            <div key={it.title} className="flex flex-col items-center gap-2 p-4">
              <span className="text-2xl">{it.icon}</span>
              <span className="text-xs font-medium tracking-wide">{it.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 🔟 COD Trust */}
      <section className="bg-[#FDFBF7] py-10">
        <div className="container-luxury max-w-2xl mx-auto bg-white border border-border rounded-2xl p-6 md:p-8 text-center">
          <h2 className="font-playfair text-xl">{tFunnel.sec10_title}</h2>
          <p className="text-secondary text-sm mt-2">{tFunnel.sec10_desc}</p>
          <ul className="mt-4 space-y-2 text-sm text-left max-w-md mx-auto">
            {tFunnel.sec10_points.map((p) => (
              <li key={p} className="flex gap-2">
                <span>{p.split(" ")[0]}</span>
                <span>{p.substring(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 1️⃣1️⃣ Price final */}
      <section className="bg-white py-12">
        <div className="container-luxury max-w-xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#B8934A]">{tFunnel.sec11_sub}</p>
          <h2 className="font-playfair text-3xl mt-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>{tFunnel.sec11_title}</h2>
          <p className="text-sm whitespace-pre-line mt-3 leading-relaxed">{tFunnel.sec11_list}</p>
          <p className="text-2xl font-semibold mt-4">{tFunnel.sec11_price}</p>
          <ul className="mt-4 space-y-1 text-sm text-secondary">
            {tFunnel.sec11_benefits.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <button onClick={() => setShowOrder(true)} className="mt-8 w-full bg-black text-white py-5 rounded-full text-lg font-medium tracking-widest uppercase hover:bg-[#1a1a1a] shadow-xl">
            {tFunnel.sec11_cta}
          </button>
          <Link to={`/product/${product.id}`} className="mt-3 inline-block text-xs underline text-secondary">
            {lang === "fr" ? "Voir détails complets" : lang === "ar" ? "عرض التفاصيل" : "View full details"}
          </Link>
        </div>
      </section>

      <OrderModal isOpen={showOrder} onClose={() => setShowOrder(false)} product={product} qty={1} />
      <MarbleBackground className="h-0" />
    </div>
  );
}

