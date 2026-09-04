import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { products } from "../data/products";
import { useLanguage } from "../i18n/LanguageContext";
import OrderModal from "../components/OrderModal";

export default function Product() {
  const { id } = useParams();
  const { lang, formatPrice } = useLanguage();
  const product = products.find((p) => p.id === (id || "1")) || products[0];
  const name = typeof product.name === "object" ? product.name[lang] : product.name;
  const [showOrder, setShowOrder] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        { Icon: DropletIcon, title: "Résistant à l'eau" },
        { Icon: LeafIcon, title: "Peau sensible" },
        { Icon: SparkleIcon, title: "Résistant sueur & parfum" },
        { Icon: ShieldIcon, title: "Garantie 2 ans" },
        { Icon: TruckIcon, title: "Livraison partout au Maroc" },
        { Icon: CashIcon, title: "Paiement à la livraison" },
      ],
      sec10_title: "Essaie sans inquiétude",
      sec10_desc: "Tu n'as rien à payer d'avance.",
      sec10_points: ["Nous livrons jusqu'à ta porte.", "Tu peux vérifier le colis avant de payer.", "Tu ne paies qu'après vérification.", "Si le produit ne te convient pas, tu peux refuser le colis."],
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
        { Icon: DropletIcon, title: "Water resistant" },
        { Icon: LeafIcon, title: "Sensitive skin" },
        { Icon: SparkleIcon, title: "Sweat & perfume resistant" },
        { Icon: ShieldIcon, title: "2-year warranty" },
        { Icon: TruckIcon, title: "Delivery all over Morocco" },
        { Icon: CashIcon, title: "Cash on delivery" },
      ],
      sec10_title: "Try without worry",
      sec10_desc: "You pay nothing in advance.",
      sec10_points: ["We deliver to your door.", "You can check the parcel before paying.", "You pay only after verification.", "If not as expected, you can refuse the parcel."],
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
        { Icon: DropletIcon, title: "مقاوم للماء" },
        { Icon: LeafIcon, title: "مناسب للبشرة الحساسة" },
        { Icon: SparkleIcon, title: "مقاوم للعرق والعطر" },
        { Icon: ShieldIcon, title: "ضمان لمدة سنتين" },
        { Icon: TruckIcon, title: "التوصيل لجميع أنحاء المغرب" },
        { Icon: CashIcon, title: "الدفع عند الاستلام" },
      ],
      sec10_title: "جربي الشراء بدون قلق",
      sec10_desc: "لا تحتاجين إلى دفع أي شيء مسبقًا.",
      sec10_points: ["نوصله حتى باب منزلك.", "يمكنك فحص الطرد قبل الدفع.", "تدفعين فقط بعد التأكد من طلبك.", "إذا لم يكن المنتج كما توقعتِ، يمكنك رفض الطرد."],
      sec11_title: "279 درهم فقط",
      sec11_sub: "الطقم الكامل",
      sec11_list: "سلسلة + سوار + خاتم + أقراط\n+ علبة فاخرة",
      sec11_price: "279 درهم فقط",
      sec11_benefits: ["التوصيل مجاني", "الدفع عند الاستلام", "افحصيه قبل الدفع"],
      sec11_cta: "اطلبيه الآن",
    },
  }[lang];

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
      {/* 1️⃣ HERO - tighter crop 4:5 */}
      <section className="relative bg-white">
        <div className="w-full max-w-5xl mx-auto">
          <div className="aspect-[4/5] md:aspect-[16/10] max-h-[75vh] overflow-hidden rounded-2xl mx-4 md:mx-0">
            <img src={img.heroFull} alt={name} className="w-full h-full object-cover object-center" width={1200} height={900} loading="eager" fetchPriority="high" decoding="async" />
          </div>
        </div>
        <div className="container-luxury py-6 text-center" dir={lang === "ar" ? "rtl" : "ltr"}>
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
      <section className="bg-[#FDFBF7] py-8">
        <div className="container-luxury max-w-3xl mx-auto text-center">
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center group cursor-pointer max-h-[60vh]" onClick={() => setShowOrder(true)}>
            <img src={img.videoPoster} alt="video poster" className="w-full h-full object-cover opacity-90" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="black"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
          <h2 className="font-playfair text-xl mt-5">{tFunnel.sec2_title}</h2>
          <p className="text-secondary text-sm mt-2 max-w-xl mx-auto">{tFunnel.sec2_desc}</p>
          <button onClick={() => setShowOrder(true)} className="mt-4 bg-white border border-black text-black px-8 py-2.5 rounded-full text-sm hover:bg-black hover:text-white">
            {tFunnel.sec2_cta}
          </button>
        </div>
      </section>

      {/* 3️⃣ Chain - tighter 4:5 */}
      <section className="bg-white py-8">
        <div className="container-luxury max-w-3xl mx-auto">
          <div className="aspect-[4/3] md:aspect-[16/9] max-h-[60vh] overflow-hidden rounded-2xl">
            <img src={img.chain} alt="chain" className="w-full h-full object-cover object-center" loading="lazy" decoding="async" width={900} height={900} />
          </div>
          <div className="text-center mt-5">
            <h2 className="font-playfair text-xl">{tFunnel.sec3_title}</h2>
            <p className="text-secondary text-sm mt-2 max-w-xl mx-auto leading-relaxed">{tFunnel.sec3_desc}</p>
          </div>
        </div>
      </section>

      {/* 4️⃣ Clasp - side layout on desktop to break monotony */}
      <section className="bg-[#FDFBF7] py-8">
        <div className="container-luxury max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="aspect-square md:aspect-[4/5] max-h-[60vh] overflow-hidden rounded-2xl">
            <img src={img.clasp} alt="clasp" className="w-full h-full object-cover object-center" loading="lazy" decoding="async" width={700} height={700} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-playfair text-xl">{tFunnel.sec4_title}</h2>
            <p className="text-secondary text-sm mt-2 leading-relaxed">{tFunnel.sec4_desc}</p>
          </div>
        </div>
      </section>

      {/* 5️⃣ Bust - full bleed but constrained */}
      <section className="bg-white py-0">
        <div className="max-w-5xl mx-auto">
          <div className="aspect-[4/5] md:aspect-[16/10] max-h-[80vh] overflow-hidden md:rounded-2xl">
            <img src={img.bust} alt="bust" className="w-full h-full object-cover object-top" loading="lazy" decoding="async" width={1200} height={900} />
          </div>
        </div>
        <div className="container-luxury max-w-3xl mx-auto text-center py-6">
          <h2 className="font-playfair text-xl md:text-2xl">{tFunnel.sec5_title}</h2>
          <p className="text-secondary text-sm mt-2">{tFunnel.sec5_desc}</p>
        </div>
      </section>

      {/* 6️⃣+7️⃣ Ring + Earrings side-by-side on desktop */}
      <section className="bg-[#FDFBF7] py-8">
        <div className="container-luxury max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="text-center bg-white rounded-2xl p-6">
            <div className="aspect-square overflow-hidden rounded-xl bg-[#FDFBF7]">
              <img src={img.ring} alt="ring" className="w-full h-full object-cover" loading="lazy" decoding="async" width={600} height={600} />
            </div>
            <h2 className="font-playfair text-lg mt-4">{tFunnel.sec6_title}</h2>
            <p className="text-secondary text-xs mt-2">{tFunnel.sec6_desc}</p>
            <p className="mt-3 text-xs tracking-widest font-medium bg-[#FDFBF7] inline-block px-4 py-2 rounded-full border">{tFunnel.sec6_sizes}</p>
          </div>
          <div className="text-center bg-white rounded-2xl p-6">
            <div className="aspect-square overflow-hidden rounded-xl bg-[#FDFBF7]">
              <img src={img.earrings} alt="earrings" className="w-full h-full object-cover" loading="lazy" decoding="async" width={700} height={500} />
            </div>
            <h2 className="font-playfair text-lg mt-4">{tFunnel.sec7_title}</h2>
            <p className="text-secondary text-xs mt-2">{tFunnel.sec7_desc}</p>
          </div>
        </div>
      </section>

      {/* 8️⃣ Box + full set */}
      <section className="bg-white py-8">
        <div className="container-luxury max-w-3xl mx-auto text-center">
          <div className="aspect-[4/3] max-h-[65vh] overflow-hidden rounded-2xl">
            <img src={img.boxFull} alt="box full set" className="w-full h-full object-cover" loading="lazy" decoding="async" width={900} height={700} />
          </div>
          <h2 className="font-playfair text-xl mt-5">{tFunnel.sec8_title}</h2>
          <p className="text-secondary text-sm mt-2">{tFunnel.sec8_desc}</p>
          <p className="mt-3 font-medium text-sm whitespace-pre-line">{tFunnel.sec8_list}</p>
        </div>
      </section>

      {/* 9️⃣ Quality icons - line icons gold */}
      <section className="bg-[#FDFBF7] py-8 border-y border-border">
        <div className="container-luxury max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
          {tFunnel.sec9.map((it) => (
            <div key={it.title} className="flex flex-col items-center gap-2 p-3">
              <span className="text-[#B8934A]"><it.Icon /></span>
              <span className="text-[11px] font-medium tracking-wide uppercase">{it.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 🔟 COD Trust */}
      <section className="bg-white py-8">
        <div className="container-luxury max-w-2xl mx-auto bg-[#FDFBF7] border border-border rounded-2xl p-6 md:p-7 text-center">
          <h2 className="font-playfair text-xl">{tFunnel.sec10_title}</h2>
          <p className="text-secondary text-sm mt-2">{tFunnel.sec10_desc}</p>
          <ul className="mt-4 space-y-2 text-sm text-left max-w-md mx-auto">
            {tFunnel.sec10_points.map((p) => (
              <li key={p} className="flex gap-2">
                <span className="text-[#B8934A]">•</span>
                <span>{p.substring(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 1️⃣1️⃣ Price final */}
      <section className="bg-[#FDFBF7] py-10">
        <div className="container-luxury max-w-xl mx-auto text-center bg-white rounded-2xl p-6 md:p-8 border border-border">
          <p className="text-xs tracking-[0.3em] uppercase text-[#B8934A]">{tFunnel.sec11_sub}</p>
          <h2 className="font-playfair text-3xl mt-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>{tFunnel.sec11_title}</h2>
          <p className="text-sm whitespace-pre-line mt-3 leading-relaxed">{tFunnel.sec11_list}</p>
          <p className="text-2xl font-semibold mt-4">{tFunnel.sec11_price}</p>
          <ul className="mt-3 space-y-1 text-sm text-secondary">
            {tFunnel.sec11_benefits.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <button onClick={() => setShowOrder(true)} className="mt-6 w-full bg-black text-white py-4 rounded-full text-base font-medium tracking-widest uppercase hover:bg-[#1a1a1a] shadow-xl">
            {tFunnel.sec11_cta}
          </button>
          <p className="text-xs text-secondary mt-3">Paiement à la livraison • Vérifie avant de payer</p>
        </div>
      </section>

      <OrderModal isOpen={showOrder} onClose={() => setShowOrder(false)} product={product} qty={1} />

      {/* Sticky bottom bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-border shadow-[0_-8px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 ${showSticky ? "translate-y-0" : "translate-y-full"}`}>
        <div className="container-luxury flex items-center justify-between gap-4 py-3">
          <div className="hidden md:flex items-center gap-3 min-w-0">
            <img src={product.images[0]} alt={name} className="w-10 h-10 object-cover rounded-lg border" />
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{name}</p>
              <p className="text-xs text-secondary">{formatPrice(product.price)}</p>
            </div>
          </div>
          <div className="flex-1 md:flex-none text-center md:text-left">
            <p className="text-xs font-medium md:hidden truncate">{name} — {formatPrice(product.price)}</p>
          </div>
          <button onClick={() => setShowOrder(true)} className="shrink-0 bg-black text-white px-6 md:px-8 py-3 rounded-full text-xs md:text-sm tracking-widest uppercase hover:bg-[#1a1a1a]">
            {lang === "fr" ? "Commander — 279 DH" : lang === "ar" ? "اطلبي الآن — 279 درهم" : "Order — 279 MAD"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DropletIcon(){return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B8934A" strokeWidth="1.2"><path d="M12 2.5 C12 2.5 6 8 6 13 C6 16.9 8.7 20 12 20 C15.3 20 18 16.9 18 13 C18 8 12 2.5 12 2.5Z"/></svg>}
function LeafIcon(){return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B8934A" strokeWidth="1.2"><path d="M12 3 C7 3 4 7 4 11 C4 16 8 20 12 20 C16 20 20 16 20 11 C20 7 17 3 12 3Z"/><path d="M12 20 V7"/></svg>}
function SparkleIcon(){return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B8934A" strokeWidth="1.2"><path d="M12 2 L13.5 8.5 L20 10 L13.5 11.5 L12 18 L10.5 11.5 L4 10 L10.5 8.5 Z"/><path d="M18 14 L18.8 16.2 L21 17 L18.8 17.8 L18 20 L17.2 17.8 L15 17 L17.2 16.2 Z"/><path d="M6 14 L6.6 15.8 L8.5 16.5 L6.6 17.2 L6 19 L5.4 17.2 L3.5 16.5 L5.4 15.8 Z"/></svg>}
function ShieldIcon(){return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B8934A" strokeWidth="1.2"><path d="M12 3 L4 7 V13 C4 16.3 6.5 19.1 12 21 C17.5 19.1 20 16.3 20 13 V7 L12 3Z"/><path d="M9 12 L11 14 L15 10"/></svg>}
function TruckIcon(){return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B8934A" strokeWidth="1.2"><path d="M1 8 H15 V16 H1 Z"/><path d="M15 10 H19 L21 13 V16 H15"/><circle cx="5.5" cy="19" r="2"/><circle cx="18.5" cy="19" r="2"/></svg>}
function CashIcon(){return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B8934A" strokeWidth="1.2"><rect x="3" y="7" width="18" height="12" rx="1.5"/><circle cx="12" cy="13" r="2.5"/><path d="M7 13 H6 M18 13 H17"/></svg>}
