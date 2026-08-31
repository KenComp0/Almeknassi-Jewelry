import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products } from "../data/products";
import { useLanguage } from "../i18n/LanguageContext";
import MarbleBackground from "../components/MarbleBackground";

export default function Home() {
  const { lang, t, formatPrice } = useLanguage();
  const product = products[0];
  const name = typeof product.name === "object" ? product.name[lang] : product.name;
  const desc = typeof product.description === "object" ? product.description[lang] : product.description;
  const details = typeof product.details === "object" ? product.details[lang] : product.details;
  const badge = typeof product.badge === "object" ? product.badge[lang] : product.badge;

  const handleWhatsapp = () => {
    const number = import.meta.env.VITE_WHATSAPP_NUMBER || "212664677347";
    const msg =
      lang === "fr"
        ? `Bonjour Al Meknassi Bijoux! Je souhaite commander:\n\n*${name}* - ${formatPrice(product.price)}`
        : lang === "ar"
        ? `مرحبا المكناسي! أرغب في طلب:\n\n*${name}* - ${formatPrice(product.price)}`
        : `Hello Al Meknassi Jewelry! I would like to order:\n\n*${name}* - ${formatPrice(product.price)}`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <MarbleBackground className="min-h-[calc(100vh-72px-200px)]">
      <div className="container-luxury py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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

        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_20px_60px_rgba(201,168,106,0.15)] overflow-hidden rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Images - rounded, hover zoom */}
            <div className="relative bg-white p-4 md:p-6">
              <div className="aspect-square overflow-hidden bg-[#FDFBF7] rounded-2xl product-image">
                <img src={product.images[0]} alt={name} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                {product.images.slice(1, 4).map((img, i) => (
                  <div key={i} className="aspect-square overflow-hidden bg-[#FDFBF7] border border-white rounded-xl product-image">
                    <img src={img} alt="" className="w-full h-full object-cover opacity-90" />
                  </div>
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

              <p className="leading-relaxed mt-5 text-[14px]" style={{ color: "#555" }}>
                {lang === "fr"
                  ? "Bracelet trèfle élégant en plaqué or 18k. Hypoallergénique, résistant à l'eau, pour un éclat intemporel."
                  : lang === "ar"
                  ? "سوار برسيم أنيق مطلي ذهب 18. مضاد للحساسية، مقاوم للماء، لمعان خالد."
                  : "Elegant four-leaf clover bracelet in 18k gold plating. Hypoallergenic, water-resistant, designed for timeless wear."}
              </p>
              <p className="text-xs mt-3 border-l-2 border-[#C9A86A] pl-3" style={{ color: "#888" }}>
                {details}
              </p>

              <div className="mt-auto pt-8 space-y-3">
                <button
                  onClick={handleWhatsapp}
                  className="w-full bg-black text-white py-4 text-sm font-medium tracking-[0.14em] uppercase hover:bg-[#1a1a1a] transition-colors flex items-center justify-center gap-2 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                >
                  {lang === "fr" ? "Commander Maintenant" : lang === "ar" ? "اطلب الآن" : "Buy Now"} — {formatPrice(product.price)}
                </button>
                <button
                  onClick={handleWhatsapp}
                  className="w-full bg-white border border-black text-black py-3.5 text-sm font-medium tracking-[0.12em] uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 rounded-full"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]">
                    <path d="M19.05 4.91A9.9 9.9 0 0 0 12.02 2C6.54 2 2.08 6.46 2.08 11.94c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.77 1.22h.01c5.48 0 9.94-4.46 9.94-9.94 0-2.65-1.03-5.14-2.92-7.03zm-7.03 15.2h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.27 8.27 0 0 1-1.27-4.32c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.26.86 5.81 2.41a8.17 8.17 0 0 1 2.41 5.82c0 4.55-3.7 8.25-8.24 8.25zm6.74-6.19c-.37-.19-2.21-1.09-2.55-1.21-.34-.12-.59-.19-.84.19-.25.37-.97 1.21-1.19 1.46-.22.25-.45.28-.82.09-.37-.19-1.57-.58-3-1.86-1.11-.99-1.86-2.21-2.08-2.58-.22-.37-.02-.57.16-.76.16-.16.37-.42.56-.63.19-.2.25-.34.37-.57.12-.22.06-.42-.03-.6-.09-.19-.84-2.01-1.15-2.75-.3-.72-.61-.62-.84-.63l-.72-.01c-.25 0-.66.09-1 .45-.34.37-1.31 1.28-1.31 3.13s1.34 3.63 1.53 3.88c.19.25 2.65 4.05 6.42 5.68.9.39 1.6.62 2.15.79.9.29 1.72.25 2.37.15.72-.11 2.21-.9 2.53-1.78.31-.87.31-1.62.22-1.78-.09-.16-.34-.25-.71-.44z" />
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
      <style>{`.product-image{transition:transform 0.4s ease}.product-image:hover{transform:scale(1.03)}`}</style>
    </MarbleBackground>
  );
}
