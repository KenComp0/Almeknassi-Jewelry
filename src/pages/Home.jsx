import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products } from "../data/products";
import { useLanguage } from "../i18n/LanguageContext";
import MarbleBackground from "../components/MarbleBackground";
import OrderModal from "../components/OrderModal";

export default function Home() {
  const { lang, t, formatPrice } = useLanguage();
  const product = products[0];
  const name = typeof product.name === "object" ? product.name[lang] : product.name;
  const desc = typeof product.description === "object" ? product.description[lang] : product.description;
  const details = typeof product.details === "object" ? product.details[lang] : product.details;
  const badge = typeof product.badge === "object" ? product.badge[lang] : product.badge;
  const [activeImg, setActiveImg] = useState(product.images[0]);
  const [showOrder, setShowOrder] = useState(false);
  const smallImages = product.landingSmall || product.images.slice(1, 4);

  return (
    <MarbleBackground className="min-h-[calc(100vh-72px-200px)]">
      <div className="container-luxury pt-[96px] pb-12 md:pt-[112px] md:pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-5xl mx-auto text-center mb-10"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-[#B8934A]">{t("home.focusedTitle")}</p>
          <h1
            className="font-playfair mt-3 leading-[1.1] text-primary"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: 500, letterSpacing: "-0.5px" }}
          >
            {name}
          </h1>
          <p className="text-secondary mt-4 max-w-2xl mx-auto leading-relaxed text-sm">{t("home.focusedSubtitle")}</p>
        </motion.div>

        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_20px_60px_rgba(201,168,106,0.15)] overflow-hidden rounded-2xl min-h-[680px] md:min-h-[620px]" style={{ contain: "layout" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Images - 1 main + 3 small, hover WhatsApp */}
            <div className="relative bg-white p-4 md:p-6">
              <div className="aspect-square overflow-hidden bg-[#FDFBF7] rounded-2xl product-image group relative">
                <img src={activeImg} alt={name} width={800} height={800} loading="eager" fetchPriority="high" decoding="async" className="w-full h-full object-cover" />
                {/* Hover WhatsApp button */}
                <button
                  onClick={() => setShowOrder(true)}
                  className="absolute bottom-3 left-3 bg-white/95 backdrop-blur border border-black/10 text-black px-4 py-2 text-xs font-medium tracking-widest uppercase rounded-full shadow-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-2 hover:bg-black hover:text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]"><path d="M19.05 4.91A9.9 9.9 0 0 0 12.02 2C6.54 2 2.08 6.46 2.08 11.94c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.77 1.22h.01c5.48 0 9.94-4.46 9.94-9.94 0-2.65-1.03-5.14-2.92-7.03z"/></svg>
                  {t("home.orderWhatsapp")}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                {smallImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(img)}
                    className={`aspect-square overflow-hidden bg-[#FDFBF7] border rounded-xl product-image ${activeImg === img ? "border-primary" : "border-white"}`}
                  >
                    <img src={img} alt="" width={400} height={400} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              {badge && (
                <span className="absolute top-6 left-6 bg-primary text-white text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full">
                  {badge}
                </span>
              )}
            </div>

            {/* Info - 40px padding */}
            <div className="flex flex-col rounded-2xl" style={{ padding: "40px" }}>
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#B8934A]">{product.category}</p>
              <h2
                className="font-playfair mt-2 leading-[1.1] text-primary"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: 500, letterSpacing: "-0.5px" }}
              >
                {name}
              </h2>
              <div className="flex items-center gap-3 mt-3" style={{ fontSize: "12px", color: "#888" }}>
                <span className="flex text-[#C9A86A]">★★★★★</span>
                <span>(127 {t("product.reviews")})</span>
                <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[11px]">{t("product.inStock")}</span>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <span className="text-2xl font-semibold text-black">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through text-sm">{formatPrice(product.originalPrice)}</span>
                )}
              </div>

              <p className="leading-relaxed mt-5 text-[14px] whitespace-pre-line" style={{ color: "#555" }}>
                {desc}
              </p>
              <p className="text-xs mt-3 border-l-2 border-[#C9A86A] pl-3" style={{ color: "#888" }}>
                {details}
              </p>

              <div className="mt-auto pt-8 space-y-3">
                <button
                  onClick={() => setShowOrder(true)}
                  className="w-full bg-black text-white py-4 text-sm font-medium tracking-[0.14em] uppercase hover:bg-[#1a1a1a] transition-colors flex items-center justify-center gap-2 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                >
                  {lang === "fr" ? "Commander Maintenant" : lang === "ar" ? "اطلب الآن" : "Buy Now"} — {formatPrice(product.price)}
                </button>
                <button
                  onClick={() => setShowOrder(true)}
                  className="w-full bg-white border border-black text-black py-3.5 text-sm font-medium tracking-[0.12em] uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 rounded-full"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]">
                    <path d="M19.05 4.91A9.9 9.9 0 0 0 12.02 2C6.54 2 2.08 6.46 2.08 11.94c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.77 1.22h.01c5.48 0 9.94-4.46 9.94-9.94 0-2.65-1.03-5.14-2.92-7.03z" />
                  </svg>
                  {t("home.orderWhatsapp")}
                </button>
                <Link
                  to={`/product/${product.id}`}
                  className="w-full bg-[#D4AF37] text-black py-3 text-xs tracking-widest uppercase hover:bg-[#C9A86A] transition-colors flex items-center justify-center rounded-full"
                >
                  {t("home.viewProduct")} →
                </Link>
                <p className="text-xs text-center" style={{ color: "#888" }}>
                  ✓ {t("product.freeShipping")} • {t("cart.cashOnDelivery")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-secondary/60 mt-6">
          {lang === "fr" ? "Paiement à la livraison • Livraison partout au Maroc" : lang === "ar" ? "الدفع عند الاستلام • التوصيل في جميع أنحاء المغرب" : "Cash on delivery • Delivery all over Morocco"}
        </p>
      </div>
      <OrderModal isOpen={showOrder} onClose={() => setShowOrder(false)} product={product} qty={1} />
      <style>{`.product-image{transition:transform 0.4s ease}.product-image:hover{transform:scale(1.03)}`}</style>
    </MarbleBackground>
  );
}
