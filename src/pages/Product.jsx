import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { products } from "../data/products";
import { useLanguage } from "../i18n/LanguageContext";
import OrderModal from "../components/OrderModal";
import Lightbox from "../components/Lightbox";
import ProductSchema from "../components/ProductSchema";
import usePageMeta from "../hooks/usePageMeta";
import { trackViewContent } from "../lib/pixel";

export default function Product({ onBuyNow, wishlist = [], onToggleWishlist }) {
  const { id } = useParams();
  const { lang, formatPrice } = useLanguage();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === (id || "1")) || products[0];
  const wished = wishlist.includes(product.id);
  const name = typeof product.name === "object" ? product.name[lang] : product.name;
  const [showOrder, setShowOrder] = useState(false);
  const [lightbox, setLightbox] = useState(-1);
  const [isHeroCompact, setIsHeroCompact] = useState(false);
  useEffect(() => {
    const onScroll = () => setIsHeroCompact(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  usePageMeta({
    title:
      lang === "fr"
        ? "Coffret RADKO Doré 279 DH — Al Meknassi Bijoux"
        : lang === "ar"
        ? "طقم الرادكو الذهبي 279 درهم — المكناسي"
        : "RADKO Gold Set 279 MAD — Al Meknassi Jewelry",
    description:
      lang === "fr"
        ? "Commandez le Coffret RADKO Doré : collier, bracelet, bague, boucles + coffret de luxe, 279 DH. Paiement à la livraison, vérifiez avant de payer."
        : lang === "ar"
        ? "اطلبوا طقم الرادكو الذهبي: سلسلة، سوار، خاتم، أقراط + علبة فاخرة، 279 درهم. الدفع عند الاستلام."
        : "Order the RADKO Gold Set: necklace, bracelet, ring, earrings + luxury box, 279 MAD. Cash on delivery.",
    path: `/product/${product.id}`,
  });

  useEffect(() => {
    const open = () => setShowOrder(true);
    window.addEventListener("open-order", open);
    return () => window.removeEventListener("open-order", open);
  }, []);

  useEffect(() => {
    trackViewContent(product);
  }, []);

  // All order buttons: ensure the set is in the cart (once), then go there.
  const handleBuyNow = () => {
    if (onBuyNow) onBuyNow(product);
    navigate("/cart");
  };

  const tFunnel = {
    fr: {
      sec1_title: "Le luxe de la brillance dorée dans chaque détail",
      sec1_desc: "Un ensemble complet au design raffiné et à l'éclat doré qui attire les regards dès le premier coup d'œil.",
      sec1_list: "Collier • Bracelet • Bague • Boucles",
      sec1_box: "Avec coffret de luxe",
      sec1_price: "Offre : 279 DH seulement",
      sec1_cta: "Commande ton ensemble maintenant",
      sec2_title: "Une expérience d'ouverture à vivre",
      sec2_desc: "Dès que tu ouvres le coffret, tu découvres un ensemble complet aux détails pensés pour se compléter.",
      sec2_cta: "Je veux cet ensemble",
      sec3_title: "Des détails qui font la différence",
      sec3_desc: "Collier au design élégant et à l'éclat doré distinctif, avec des finitions fines qui lui donnent une présence autour du cou. Facile à associer au quotidien et en soirée.",
      sec4_title: "Même les petits détails sont soignés",
      sec4_desc: "Fermoir au design élégant inspiré des bijoux de luxe, pour une touche plus chic et distinctive.",
      sec4b_title: "Un bracelet délicat aux finitions soignées",
      sec4b_desc: "Un bracelet plus fin au même éclat doré, pensé pour se porter seul ou s'empiler avec le reste de l'ensemble.",
      sec5_title: "Une élégance qui se voit au premier regard",
      sec5_desc: "Un ensemble coordonné collier, bracelet, bague et boucles dans un seul design, pour une présence élégante et complète.",
      sec6_title: "Bague au design audacieux et élégant",
      sec6_desc: "Des détails assortis au reste de l'ensemble, pour une allure complète jusque dans les moindres détails.",
      sec6_sizes: "Tailles disponibles: 6 • 7 • 8 • 9 • 10",
      sec7_title: "Légère, élégante, et conçue pour compléter l'ensemble",
      sec7_desc: "Boucles au design assorti, pour une allure complète de la tête à la main.",
      sec8_title: "Car le luxe commence par la présentation",
      sec8_desc: "Ton ensemble arrive dans un coffret luxueux et élégant, qui garde les pièces rangées et en fait un cadeau idéal pour toi ou un proche.",
      sec8_list: "Collier + Bracelet + Bague + Boucles + Coffret",
      sec9: [
        { Icon: DiamondIcon, title: "Qualité premium", sub: "Acier inoxydable A+" },
        { Icon: ShieldIcon, title: "Garantie 2 ans", sub: "Satisfaction assurée" },
        { Icon: DropletIcon, title: "Résiste à l'eau", sub: "Parfums & transpiration" },
        { Icon: LeafIcon, title: "Hypoallergénique", sub: "Pour peaux sensibles" },
        { Icon: GiftIcon, title: "Coffret élégant", sub: "Prêt à offrir" },
      ],
      sec10_title: "Votre confiance, notre priorité",
      sec10_desc: "Votre satisfaction avant tout.",
      sec10_points: ["Livraison à votre porte.", "Vérifiez votre commande avant de payer.", "Payez uniquement si elle vous convient.", "Elle ne vous convient pas ? Refusez simplement le colis."],
      sec11_title: "279 DH seulement",
      sec11_sub: "L'ensemble complet",
      sec11_list: "Collier + Bracelet + Bague + Boucles\n+ Coffret de luxe",
      sec11_price: "279 DH seulement",
      sec11_benefits: ["Livraison gratuite", "Paiement à la livraison", "Vérifie avant de payer"],
      sec11_cta: "Commande maintenant",
    },
    en: {
      sec1_title: "The luxury of golden shine in every detail",
      sec1_desc: "A complete set with refined design and golden shine that catches eyes at first glance.",
      sec1_list: "Necklace • Bracelet • Ring • Earrings",
      sec1_box: "With luxury box",
      sec1_price: "Offer: 279 MAD only",
      sec1_cta: "Order your set now",
      sec2_title: "An unboxing experience worth living",
      sec2_desc: "From the moment you open the box, discover a complete set with details designed to complement each other.",
      sec2_cta: "I want this set",
      sec3_title: "Details that make the difference",
      sec3_desc: "Elegant necklace with distinctive golden shine and fine details for a clear presence around the neck. Easy to style daily and for events.",
      sec4_title: "Even small details are carefully crafted",
      sec4_desc: "Elegant clasp inspired by luxury jewelry, for a more chic touch.",
      sec4b_title: "A delicate bracelet with refined finish",
      sec4b_desc: "A finer bracelet with the same golden shine, made to wear alone or stacked with the rest of the set.",
      sec5_title: "Elegance visible at first glance",
      sec5_desc: "Coordinated set — necklace, bracelet, ring and earrings in one design for a complete elegant look.",
      sec6_title: "Bold and elegant ring design",
      sec6_desc: "Details matching the rest of the set, for a complete look down to the smallest detail.",
      sec6_sizes: "Available sizes: 6 • 7 • 8 • 9 • 10",
      sec7_title: "Light, elegant, designed to complete the set",
      sec7_desc: "Matching earrings for a complete head-to-hand look.",
      sec8_title: "Because luxury starts with presentation",
      sec8_desc: "Your set comes in a luxurious elegant box, keeping pieces organized and perfect as a gift.",
      sec8_list: "Necklace + Bracelet + Ring + Earrings + Box",
      sec9: [
        { Icon: DiamondIcon, title: "Premium quality", sub: "Stainless steel A+" },
        { Icon: ShieldIcon, title: "2-year warranty", sub: "Satisfaction guaranteed" },
        { Icon: DropletIcon, title: "Water resistant", sub: "Perfumes & sweat" },
        { Icon: LeafIcon, title: "Hypoallergenic", sub: "For sensitive skin" },
        { Icon: GiftIcon, title: "Elegant box", sub: "Ready to gift" },
      ],
      sec10_title: "Shop with Confidence",
      sec10_desc: "Your satisfaction comes first.",
      sec10_points: ["Delivered to your door.", "Take a moment to check your order.", "Pay only when you're satisfied.", "Not what you expected? You may kindly refuse the parcel."],
      sec11_title: "279 MAD only",
      sec11_sub: "The complete set",
      sec11_list: "Necklace + Bracelet + Ring + Earrings\n+ Luxury box",
      sec11_price: "279 MAD only",
      sec11_benefits: ["Free delivery", "Cash on delivery", "Check before paying"],
      sec11_cta: "Order now",
    },
    ar: {
      sec1_title: "فخامة اللمعة الذهبية في كل تفصيلة",
      sec1_desc: "طقم متكامل بتصميم راقٍ ولمعة ذهبية تلفت الأنظار من أول نظرة.",
      sec1_list: "سلسلة • سوار • خاتم • أقراط",
      sec1_box: "مع علبة فاخرة",
      sec1_price: "العرض: 279 درهم فقط",
      sec1_cta: "اطلبي طقمك الآن",
      sec2_title: "تجربة فتح تستحق أن تعيشيها",
      sec2_desc: "من أول لحظة تفتحين فيها العلبة، ستكتشفين طقمًا متكاملًا بتفاصيل مصممة لتكمل بعضها البعض.",
      sec2_cta: "أريد هذا الطقم",
      sec3_title: "تفاصيل تصنع الفرق",
      sec3_desc: "سلسلة بتصميم أنيق ولمعة ذهبية مميزة، مع تفاصيل دقيقة تمنحها حضورًا واضحًا حول الرقبة. تصميم فاخر يمكنك تنسيقه بسهولة مع إطلالاتك اليومية والمناسبات.",
      sec4_title: "حتى التفاصيل الصغيرة صُممت بعناية",
      sec4_desc: "مشبك بتصميم أنيق ومستوحى من تفاصيل المجوهرات الفاخرة، ليمنح السلسلة لمسة أكثر أناقة وتميزًا.",
      sec4b_title: "سوار ناعم بلمسات متقنة",
      sec4b_desc: "سوار أنعم بنفس اللمعة الذهبية، مصمم ليُلبس وحده أو مع باقي الطقم.",
      sec5_title: "أناقة تظهر من أول نظرة",
      sec5_desc: "طقم متناسق يجمع السلسلة والسوار والخاتم والأقراط في تصميم واحد، ليمنح إطلالتك حضورًا أنيقًا ومتكاملًا.",
      sec6_title: "خاتم بتصميم جريء وأنيق",
      sec6_desc: "تفاصيل متناسقة مع باقي قطع الطقم، لتبقى إطلالتك متكاملة حتى في أصغر التفاصيل.",
      sec6_sizes: "متوفر بالمقاسات: 6 • 7 • 8 • 9 • 10",
      sec7_title: "خفيفة، أنيقة، ومصممة لتكمّل الطقم",
      sec7_desc: "أقراط بتصميم متناسق مع باقي القطع، لإطلالة كاملة وأنيقة من الرأس إلى اليد.",
      sec8_title: "لأن الفخامة تبدأ من طريقة التقديم",
      sec8_desc: "طقمك يأتي داخل علبة فاخرة وأنيقة، تحافظ على ترتيب القطع وتجعله خيارًا مثاليًا لكِ أو كهدية لمن تحبين.",
      sec8_list: "السلسلة + السوار + الخاتم + الأقراط + العلبة",
      sec9: [
        { Icon: DiamondIcon, title: "جودة ممتازة", sub: "ستانلس ستيل A+" },
        { Icon: ShieldIcon, title: "ضمان سنتين", sub: "رضا مضمون" },
        { Icon: DropletIcon, title: "مقاوم للماء", sub: "عطور وعرق" },
        { Icon: LeafIcon, title: "مضاد للحساسية", sub: "للبشرة الحساسة" },
        { Icon: GiftIcon, title: "علبة أنيقة", sub: "جاهزة للإهداء" },
      ],
      sec10_title: "اطلبوا بثقة",
      sec10_desc: "رضاكم أولويتنا.",
      sec10_points: ["التوصيل حتى باب المنزل.", "تأكدوا من طلبكم قبل الدفع.", "الدفع بعد التأكد والرضا.", "لم يناسبكم الطلب؟ يمكنكم رفض استلامه."],
      sec11_title: "279 درهم فقط",
      sec11_sub: "الطقم الكامل",
      sec11_list: "سلسلة + سوار + خاتم + أقراط\n+ علبة فاخرة",
      sec11_price: "279 درهم فقط",
      sec11_benefits: ["التوصيل مجاني", "الدفع عند الاستلام", "افحصيه قبل الدفع"],
      sec11_cta: "اطلبيه الآن",
    },
  }[lang];

  const img = {
    heroFull: product.images[0],
    chain: product.images[1],
    littleOne: product.images[2],
    earrings: product.images[3],
    ring: product.images[4],
    bust: product.images[5],
    clasp: product.images[6],
  };

  // Viewer items in page order: video first, then the 7 photos.
  const gallery = [
    { type: "video", src: product.video, poster: product.videoPoster },
    ...[img.heroFull, img.chain, img.littleOne, img.earrings, img.ring, img.bust, img.clasp].map((src) => ({ type: "image", src })),
  ];

  return (
    <div
      className="relative text-white"
      style={{
        backgroundImage: "url('https://i.ibb.co/WvCp9WYL/Chat-GPT-Image-Sep-5-2026-09-59-51-PM.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />
      <div className="relative z-10">
      {/* 1️⃣ VIDEO - real video first, autoplay muted loop */}
      <section className="bg-transparent py-0">
        <div className="w-full">
          <div className="relative w-full overflow-hidden bg-black cursor-zoom-in" onClick={() => setLightbox(0)}>
            <video
              src={product.video}
              poster={product.videoPoster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-auto max-h-[75vh] object-contain mx-auto pointer-events-none"
            />
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full pointer-events-none">⛶</span>
          </div>
          <h2 className="font-playfair text-xl mt-5 text-[#C9A86A] text-center">{tFunnel.sec2_title}</h2>
          <p className="text-secondary text-sm mt-2 max-w-xl mx-auto text-center">{tFunnel.sec2_desc}</p>
          <div className="text-center mb-8 pb-2">
            <button onClick={handleBuyNow} className="mt-4 bg-transparent border border-[#C9A86A] text-[#C9A86A] px-8 py-2.5 rounded-full text-sm hover:bg-[#C9A86A] hover:text-black inline-block">
              {tFunnel.sec2_cta}
            </button>
          </div>
        </div>
      </section>

      {/* 2️⃣ HERO - dark, no rounded, full width */}
      <section className="relative bg-transparent">
        <div className="funnel-pad container-luxury max-w-5xl mx-auto px-4">
          <img src={img.heroFull} alt={name} onClick={() => setLightbox(1)} className="w-full h-auto object-cover cursor-zoom-in" width={1200} height={900} loading="eager" fetchPriority="high" decoding="async" />
        </div>
        <div className="container-luxury py-6 text-center" dir={lang === "ar" ? "rtl" : "ltr"}>
          <h1 className="font-playfair text-2xl md:text-3xl leading-tight text-[#C9A86A]" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif Arabic', serif", fontWeight: 500 }}>{tFunnel.sec1_title}</h1>
          <p className="text-secondary mt-3 max-w-2xl mx-auto text-sm leading-relaxed">{tFunnel.sec1_desc}</p>
          <p className="mt-3 text-sm font-medium tracking-wide">{tFunnel.sec1_list}</p>
          <p className="mt-2 text-sm">{tFunnel.sec1_box}</p>
          <p className="mt-3 text-lg font-semibold">{tFunnel.sec1_price} <span className="text-sm font-normal text-secondary">({formatPrice(product.price)})</span></p>
          <button onClick={handleBuyNow} className="mt-6 w-full md:w-auto bg-[#C9A86A] text-black px-10 py-4 rounded-full text-sm tracking-widest uppercase hover:bg-[#B8934A] shadow-lg">
            {tFunnel.sec1_cta}
          </button>
        </div>
      </section>

      {/* 3️⃣ Chain - dark, no rounded, full visible */}
      <section className="bg-transparent">
        <div className="funnel-pad container-luxury max-w-5xl mx-auto px-4">
          <img src={img.chain} alt="chain" onClick={() => setLightbox(2)} className="w-full h-auto object-cover cursor-zoom-in" loading="lazy" decoding="async" width={900} height={900} />
        </div>
        <div className="container-luxury max-w-3xl mx-auto text-center py-6 mt-6 mb-2">
          <h2 className="font-playfair text-xl text-[#C9A86A]">{tFunnel.sec3_title}</h2>
          <p className="text-secondary text-sm mt-2 max-w-xl mx-auto leading-relaxed">{tFunnel.sec3_desc}</p>
        </div>
      </section>

      {/* 4️⃣ Little one - dark, no background, no rounded, full visible */}
      <section className="bg-transparent">
        <div className="funnel-pad container-luxury max-w-5xl mx-auto px-4">
          <img src={img.littleOne} alt="little bracelet" onClick={() => setLightbox(3)} className="w-full h-auto object-cover cursor-zoom-in" loading="lazy" decoding="async" width={900} height={900} />
        </div>
        <div className="container-luxury max-w-3xl mx-auto text-center py-6 mt-6 mb-2">
          <h2 className="font-playfair text-xl text-[#C9A86A]">{tFunnel.sec4b_title}</h2>
          <p className="text-secondary text-sm mt-2 max-w-xl mx-auto leading-relaxed">{tFunnel.sec4b_desc}</p>
        </div>
      </section>

      {/* 5️⃣ Earrings - dark, no background, no rounded, full visible */}
      <section className="bg-transparent">
        <div className="funnel-pad container-luxury max-w-5xl mx-auto px-4">
          <img src={img.earrings} alt="earrings" onClick={() => setLightbox(4)} className="w-full h-auto object-cover cursor-zoom-in" loading="lazy" decoding="async" width={700} height={500} />
        </div>
        <div className="container-luxury max-w-3xl mx-auto text-center py-6 mt-6 mb-2">
          <h2 className="font-playfair text-xl text-[#C9A86A]">{tFunnel.sec7_title}</h2>
          <p className="text-secondary text-sm mt-2">{tFunnel.sec7_desc}</p>
        </div>
      </section>

      {/* 6️⃣ Ring - dark, no background, no rounded, full visible */}
      <section className="bg-transparent">
        <div className="funnel-pad container-luxury max-w-5xl mx-auto px-4">
          <img src={img.ring} alt="ring" onClick={() => setLightbox(5)} className="w-full h-auto object-cover cursor-zoom-in" loading="lazy" decoding="async" width={600} height={600} />
        </div>
        <div className="container-luxury max-w-3xl mx-auto text-center py-6 mt-6 mb-2">
          <h2 className="font-playfair text-xl text-[#C9A86A]">{tFunnel.sec6_title}</h2>
          <p className="text-secondary text-sm mt-2">{tFunnel.sec6_desc}</p>
          <p className="mt-3 text-xs tracking-widest font-medium bg-[#C9A86A] text-black inline-block px-4 py-2 rounded-full border border-[#C9A86A]">{tFunnel.sec6_sizes}</p>
        </div>
      </section>

      {/* 7️⃣ Bust - dark, no background, no rounded, full visible */}
      <section className="bg-transparent">
        <div className="funnel-pad container-luxury max-w-5xl mx-auto px-4">
          <img src={img.bust} alt="bust" onClick={() => setLightbox(6)} className="w-full h-auto object-cover cursor-zoom-in" loading="lazy" decoding="async" width={900} height={1100} />
        </div>
        <div className="container-luxury max-w-3xl mx-auto text-center py-6 mt-6 mb-2">
          <h2 className="font-playfair text-xl text-[#C9A86A]">{tFunnel.sec5_title}</h2>
          <p className="text-secondary text-sm mt-2 max-w-xl mx-auto">{tFunnel.sec5_desc}</p>
        </div>
      </section>

      {/* 8️⃣ Clasp finale - dark, no background, no rounded, full visible */}
      <section className="bg-transparent">
        <div className="funnel-pad container-luxury max-w-5xl mx-auto px-4">
          <img src={img.clasp} alt="clasp" onClick={() => setLightbox(7)} className="w-full h-auto object-cover cursor-zoom-in" loading="lazy" decoding="async" width={700} height={700} />
        </div>
        <div className="container-luxury max-w-3xl mx-auto text-center py-6 mt-6 mb-2">
          <h2 className="font-playfair text-xl text-[#C9A86A]">{tFunnel.sec4_title}</h2>
          <p className="text-secondary text-sm mt-2 max-w-xl mx-auto leading-relaxed">{tFunnel.sec4_desc}</p>
        </div>
      </section>

      {/* 🎁 Gift strip - text only, value + gift message */}
      <section className="bg-transparent">
        <div className="container-luxury max-w-3xl mx-auto text-center py-6 mt-6 mb-2">
          <h2 className="font-playfair text-xl mt-5 text-[#C9A86A]">{tFunnel.sec8_title}</h2>
          <p className="text-secondary text-sm mt-2">{tFunnel.sec8_desc}</p>
          <p className="mt-3 font-medium text-sm whitespace-pre-line">{tFunnel.sec8_list}</p>
        </div>
      </section>

      {/* 9️⃣ Quality icons - exact 5 gold icons from image, dark theme */}
      <section className="bg-black py-8 border-y border-white/10">
        <div className="container-luxury max-w-5xl mx-auto grid grid-cols-3 md:grid-cols-5 gap-6 text-center">
          {tFunnel.sec9.map((it) => (
            <div key={it.title} className="flex flex-col items-center gap-2 p-2">
              <span className="text-[#C9A86A]"><it.Icon /></span>
              <span className="text-[11px] font-medium tracking-wide uppercase text-white">{it.title}</span>
              <span className="text-[10px] text-white/60">{it.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 🔟 COD Trust - dark */}
      <section className="bg-transparent py-8">
        <div className="container-luxury max-w-2xl mx-auto bg-[#111] border border-white/10 rounded-2xl p-6 md:p-7 text-center">
          <h2 className="font-playfair text-xl text-[#C9A86A]">{tFunnel.sec10_title}</h2>
          <p className="text-secondary text-sm mt-2">{tFunnel.sec10_desc}</p>
          <ul className="mt-4 space-y-2 text-sm text-left max-w-md mx-auto">
            {tFunnel.sec10_points.map((p) => (
              <li key={p} className="flex gap-2">
                <span className="text-[#B8934A]">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 1️⃣1️⃣ Price final - dark */}
      <section className="bg-transparent py-10">
        <div className="container-luxury max-w-xl mx-auto text-center bg-[#111] rounded-2xl p-6 md:p-8 border border-white/10">
          <p className="text-xs tracking-[0.3em] uppercase text-[#B8934A]">{tFunnel.sec11_sub}</p>
          <h2 className="font-playfair text-3xl mt-2 text-[#C9A86A]" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif Arabic', serif", fontWeight: 500 }}>{tFunnel.sec11_title}</h2>
          <p className="text-sm whitespace-pre-line mt-3 leading-relaxed">{tFunnel.sec11_list}</p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <p className="text-2xl font-semibold">{tFunnel.sec11_price}</p>
            {product.originalPrice && (
              <span className="text-white/40 line-through text-sm">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <ul className="mt-3 space-y-1 text-sm text-secondary">
            {tFunnel.sec11_benefits.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <button onClick={handleBuyNow} className="mt-6 w-full bg-black text-white py-4 rounded-full text-base font-medium tracking-widest uppercase hover:bg-[#1a1a1a] shadow-xl">
            {tFunnel.sec11_cta}
          </button>
          <p className="text-xs text-secondary mt-3">Paiement à la livraison • Vérifie avant de payer</p>
        </div>
      </section>

      <ProductSchema />
      <style>{`.funnel-pad img{border-radius:1rem;display:block}`}</style>

      {/* Floating right Cart + Commander ici - hidden while the order form is open */}
      {!showOrder && (
      <div className="fixed bottom-24 md:bottom-5 right-5 z-40 flex flex-col items-center gap-1.5">
        <button
          onClick={handleBuyNow}
          aria-label="Commander"
          className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform"
        >
          {/* Cart icon - cats design (shopping bag) */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 7 L6 18 C6 19.1 6.9 20 8 20 L16 20 C17.1 20 18 19.1 18 18 L18 7 Z" />
            <path d="M9 7 V5 C9 3.3 10.3 2 12 2 C13.7 2 15 3.3 15 5 V7" />
            <circle cx="12" cy="12" r="1" fill="white" stroke="none" />
          </svg>
        </button>
        <span className="bg-[#C9A86A] border border-[#C9A86A] text-black text-[11px] font-medium tracking-wide px-3 py-1 rounded-full shadow-md whitespace-nowrap">
          {lang === "fr" ? "Commander ici" : lang === "ar" ? "اطلبي هنا" : "Order here"}
        </span>
      </div>
      )}
      {/* Overlays live at root level so header/nav never paint above them */}
      <OrderModal isOpen={showOrder} onClose={() => setShowOrder(false)} product={product} qty={1} onToggleWishlist={onToggleWishlist} wished={wished} />
      {lightbox >= 0 && (
        <Lightbox items={gallery} index={lightbox} onNavigate={setLightbox} onClose={() => setLightbox(-1)} alt={name} />
      )}
      </div>
    </div>
  );
}

function DiamondIcon(){return <img src="https://i.ibb.co/6RQVRkdn/diamond.png" alt="diamond" width="28" height="28" loading="lazy" decoding="async" className="w-7 h-7 object-contain" />;}
function DropletIcon(){return <img src="https://i.ibb.co/bjD5mQ0H/droplet.png" alt="droplet" width="28" height="28" loading="lazy" decoding="async" className="w-7 h-7 object-contain" />;}
function LeafIcon(){return <img src="https://i.ibb.co/G45vnQNn/leaf.png" alt="leaf" width="28" height="28" loading="lazy" decoding="async" className="w-7 h-7 object-contain" />;}
function ShieldIcon(){return <img src="https://i.ibb.co/qLN0cfqP/shield.png" alt="shield" width="28" height="28" loading="lazy" decoding="async" className="w-7 h-7 object-contain" />;}
function GiftIcon(){return <img src="https://i.ibb.co/zvm82b4/gift.png" alt="gift" width="28" height="28" loading="lazy" decoding="async" className="w-7 h-7 object-contain" />;}
function SparkleIcon(){return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A86A" strokeWidth="1.2"><path d="M12 2 L13.5 8.5 L20 10 L13.5 11.5 L12 18 L10.5 11.5 L4 10 L10.5 8.5 Z"/><path d="M18 14 L18.8 16.2 L21 17 L18.8 17.8 L18 20 L17.2 17.8 L15 17 L17.2 16.2 Z"/><path d="M6 14 L6.6 15.8 L8.5 16.5 L6.6 17.2 L6 19 L5.4 17.2 L3.5 16.5 L5.4 15.8 Z"/></svg>}
function TruckIcon(){return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A86A" strokeWidth="1.2"><path d="M1 8 H15 V16 H1 Z"/><path d="M15 10 H19 L21 13 V16 H15"/><circle cx="5.5" cy="19" r="2"/><circle cx="18.5" cy="19" r="2"/></svg>}
function CashIcon(){return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A86A" strokeWidth="1.2"><rect x="3" y="7" width="18" height="12" rx="1.5"/><circle cx="12" cy="13" r="2.5"/><path d="M7 13 H6 M18 13 H17"/></svg>}
