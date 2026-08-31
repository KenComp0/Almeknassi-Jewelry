import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Section from "../components/Section";
import ImageGallery from "../components/ImageGallery";
import { products } from "../data/products";
import { useLanguage } from "../i18n/LanguageContext";
import MarbleBackground from "../components/MarbleBackground";

export default function Product() {
  const { id } = useParams();
  const { lang, t, formatPrice } = useLanguage();
  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="container-luxury py-24 text-center">
        <p className="text-secondary">{t("product.notFound")}</p>
        <Link to="/" className="inline-block mt-6 border border-primary px-8 py-3 text-sm tracking-widest uppercase hover:bg-primary hover:text-white rounded-full">
          {t("product.backToCollection")}
        </Link>
      </div>
    );
  }

  const name = typeof product.name === "object" ? product.name[lang] : product.name;
  const shortDesc =
    lang === "fr"
      ? "Bracelet trèfle élégant en plaqué or 18k. Hypoallergénique, résistant à l'eau, pour un éclat intemporel."
      : lang === "ar"
      ? "سوار برسيم أنيق مطلي ذهب 18. مضاد للحساسية، مقاوم للماء، لمعان خالد."
      : "Elegant four-leaf clover bracelet in 18k gold plating. Hypoallergenic, water-resistant, designed for timeless wear.";

  const details = typeof product.details === "object" ? product.details[lang] : product.details;

  const handleWhatsapp = () => {
    const number = import.meta.env.VITE_WHATSAPP_NUMBER || "212664677347";
    const priceStr = formatPrice(product.price * qty);
    const msg =
      lang === "fr"
        ? `Bonjour Al Meknassi Bijoux! Je souhaite commander:\n\n*${name}* x${qty} - ${priceStr}`
        : lang === "ar"
        ? `مرحبا المكناسي! أرغب في طلب:\n\n*${name}* x${qty} - ${priceStr}`
        : `Hello Al Meknassi Jewelry! I would like to order:\n\n*${name}* x${qty} - ${priceStr}`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handlePrimaryBuy = handleWhatsapp; // primary also goes to WhatsApp (no cart hesitation)

  return (
    <MarbleBackground>
      <div className="container-luxury py-6 text-xs">
        <nav className="flex gap-2 text-secondary">
          <Link to="/" className="hover:text-primary">
            {t("nav.home")}
          </Link>
          <span>/</span>
          <span className="text-primary">{name}</span>
        </nav>
      </div>

      <Section padding="py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image area - luxury rounded, hover zoom, subtle shadow */}
          <div className="bg-white/70 backdrop-blur p-3 md:p-4 border border-white/50 shadow-[0_10px_40px_rgba(201,168,106,0.12)] rounded-2xl overflow-hidden">
            <div className="rounded-xl overflow-hidden product-image">
              <ImageGallery images={product.images} alt={name} />
            </div>
          </div>

          {/* Info - luxury spacing 40px */}
          <div className="bg-white/80 backdrop-blur p-6 md:p-10 border border-white/50 shadow-[0_10px_40px_rgba(201,168,106,0.1)] rounded-2xl" style={{ padding: "40px" }}>
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#B8934A]">{product.category}</p>
            <h1
              className="font-playfair mt-2 leading-[1.1] text-primary"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: 500, letterSpacing: "-0.5px" }}
            >
              {name}
            </h1>

            {/* Rating + Stock - smaller, lighter */}
            <div className="flex items-center gap-3 mt-3 meta" style={{ fontSize: "12px", color: "#888" }}>
              <span className="flex text-[#C9A86A]">★★★★★</span>
              <span>(127 {t("product.reviews")})</span>
              <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[11px]">{t("product.inStock")}</span>
            </div>

            {/* Price - premium subtle */}
            <div className="flex items-center gap-3 mt-6">
              <span className="text-2xl font-semibold text-black">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through text-sm">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            {/* Short desc - premium */}
            <p className="text-secondary leading-relaxed mt-5 text-[14px]">{shortDesc}</p>
            <p className="text-xs text-secondary mt-3 border-l-2 border-[#C9A86A] pl-3">{details}</p>

            {/* Quantity */}
            <div className="mt-8">
              <p className="text-xs tracking-widest uppercase font-medium mb-3">{t("product.quantity")}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border bg-white rounded-full overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-11 hover:bg-[#FDFBF7] transition-colors">
                    −
                  </button>
                  <span className="w-12 text-center text-sm font-medium">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-11 h-11 hover:bg-[#FDFBF7] transition-colors">
                    +
                  </button>
                </div>
                <span className="text-xs" style={{ color: "#888" }}>
                  {qty * product.price > 1000 ? `✓ ${t("product.freeShipping")}` : `${t("product.addForFree")} ${formatPrice(1000 - qty * product.price)} ${t("product.forFreeShipping")}`}
                </span>
              </div>
            </div>

            {/* PRIMARY CTA - black luxury */}
            <button
              onClick={handlePrimaryBuy}
              className="w-full mt-8 bg-black text-white py-4 text-sm font-medium tracking-[0.14em] uppercase hover:bg-[#1a1a1a] transition-colors flex items-center justify-center gap-2 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
            >
              {lang === "fr" ? "Commander Maintenant" : lang === "ar" ? "اطلب الآن" : "Buy Now"} — {formatPrice(product.price * qty)}
            </button>

            {/* SECONDARY CTA - WhatsApp */}
            <button
              onClick={handleWhatsapp}
              className="w-full mt-3 bg-white border border-black text-black py-3.5 text-sm font-medium tracking-[0.12em] uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 rounded-full"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]">
                <path d="M19.05 4.91A9.9 9.9 0 0 0 12.02 2C6.54 2 2.08 6.46 2.08 11.94c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.77 1.22h.01c5.48 0 9.94-4.46 9.94-9.94 0-2.65-1.03-5.14-2.92-7.03zm-7.03 15.2h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.27 8.27 0 0 1-1.27-4.32c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.26.86 5.81 2.41a8.17 8.17 0 0 1 2.41 5.82c0 4.55-3.7 8.25-8.24 8.25zm6.74-6.19c-.37-.19-2.21-1.09-2.55-1.21-.34-.12-.59-.19-.84.19-.25.37-.97 1.21-1.19 1.46-.22.25-.45.28-.82.09-.37-.19-1.57-.58-3-1.86-1.11-.99-1.86-2.21-2.08-2.58-.22-.37-.02-.57.16-.76.16-.16.37-.42.56-.63.19-.2.25-.34.37-.57.12-.22.06-.42-.03-.6-.09-.19-.84-2.01-1.15-2.75-.3-.72-.61-.62-.84-.63l-.72-.01c-.25 0-.66.09-1 .45-.34.37-1.31 1.28-1.31 3.13s1.34 3.63 1.53 3.88c.19.25 2.65 4.05 6.42 5.68.9.39 1.6.62 2.15.79.9.29 1.72.25 2.37.15.72-.11 2.21-.9 2.53-1.78.31-.87.31-1.62.22-1.78-.09-.16-.34-.25-.71-.44z" />
              </svg>
              {t("product.orderWhatsapp")}
            </button>
            <p className="text-xs text-center mt-3" style={{ color: "#888" }}>
              ✓ {t("cart.cashOnDelivery")} • {t("cart.secure")}
            </p>

            {/* Accordion - only Details & Care */}
            <div className="mt-8">
              <details className="group border border-border bg-white rounded-xl overflow-hidden" open>
                <summary className="flex justify-between items-center p-4 cursor-pointer list-none text-sm font-medium">
                  {t("product.detailsCare")} <span className="group-open:rotate-180 transition-transform">⌄</span>
                </summary>
                <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: "#888" }}>
                  {details} <br />
                  {t("product.detailsText")}
                </div>
              </details>
            </div>
          </div>
        </div>
      </Section>

      <style>{`
        .product-image { transition: transform 0.4s ease; }
        .product-image:hover { transform: scale(1.03); }
      `}</style>
    </MarbleBackground>
  );
}
