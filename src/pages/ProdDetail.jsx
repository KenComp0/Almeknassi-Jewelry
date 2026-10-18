import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import Lightbox from "../components/Lightbox";
import usePageMeta from "../hooks/usePageMeta";
import { trackViewContent } from "../lib/pixel";
import { getProductById } from "../lib/products";

export default function ProdDetail({ onBuyNow, wishlist = [], onToggleWishlist }) {
  const { id } = useParams();
  const { lang, formatPrice, t } = useLanguage();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(-1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  usePageMeta({
    title: loading ? "Loading..." : product
      ? (typeof product.name === "object" ? product.name[lang] : product.name)
      : "Product",
    description: product?.description?.[lang] || "",
    path: `/prod/${id}`,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const prod = await getProductById(id);
        setProduct(prod);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  

  useEffect(() => {
    if (product) trackViewContent(product);
  }, [product]);

  const handleBuyNow = () => {
    if (!selectedSize && sizes.length > 0) {
      // Require size selection first
      alert(lang === "fr" ? "Veuillez choisir une taille" : lang === "ar" ? "الرجاء اختيار المقاس" : "Please select a size");
      return;
    }
    // Add selected size and quantity to product for cart
    const productWithSize = { ...product, selectedSize, quantity };
    onBuyNow(productWithSize);
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="text-white min-h-[60vh] flex items-center justify-center">
        <p className="text-white/50 text-sm">…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-white min-h-[60vh] flex items-center justify-center">
        <p className="text-white/50 text-sm">
          {lang === "fr" ? "Produit introuvable" : lang === "ar" ? "المنتج غير موجود" : "Product not found"}
        </p>
      </div>
    );
  }

  const name = typeof product.name === "object" ? product.name[lang] : product.name;
  const description = typeof product.description === "object" ? product.description[lang] : product.description;
  const images = product.images || [];
  const sizes = (product.sizes || [6, 7, 8, 9, 10]).filter(s => s !== "none");

  const gallery = images.map((src) => ({ type: "image", src }));

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
        <div className="container-luxury pt-[96px] pb-16 max-w-5xl">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#C9A86A]">{lang === "fr" ? "Accueil" : lang === "ar" ? "الرئيسية" : "Home"}</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-[#C9A86A]">{t("nav.shop")}</Link>
            <span>/</span>
            <span className="text-white truncate max-w-[200px]">{name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-black cursor-zoom-in" onClick={() => setLightbox(activeImage)}>
                <img
                  src={images[activeImage] || "https://i.ibb.co/KxZfP4fv/image.webp"}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        i === activeImage ? "border-[#C9A86A]" : "border-white/10 hover:border-white/30"
                      }`}
                      aria-label={`Image ${i + 1}`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h1 className="font-playfair text-3xl md:text-4xl text-[#C9A86A]" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif Arabic', serif" }}>
                {name}
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-playfair text-2xl text-[#C9A86A]">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-lg text-white/40 line-through">{formatPrice(product.oldPrice)}</span>
                )}
                {product.oldPrice && (
                  <span className="bg-green-900/40 text-green-400 text-xs px-2 py-1 rounded-full uppercase">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                )}
              </div>

              <p className="text-white/70 leading-relaxed">{description}</p>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-sm font-medium tracking-widest uppercase text-white/60 mb-3">
                  {lang === "fr" ? "Taille" : lang === "ar" ? "المقاس" : "Size"}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-full text-white text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? "bg-[#C9A86A] border-2 border-[#C9A86A] text-black"
                          : "bg-black border border-white/15 hover:border-[#C9A86A] hover:bg-[#1a1a1a]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-white/70">
                    {lang === "fr" ? "Quantité" : lang === "ar" ? "الكمية" : "Quantity"}:
                  </label>
                  <div className="flex items-center gap-2 bg-black border border-white/15 rounded-full px-4 py-1">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="text-white font-medium w-10 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-sm font-medium tracking-widest uppercase text-white/60 mb-3">
                  {lang === "fr" ? "Ce qui est inclus" : lang === "ar" ? "ما يشمله الطقم" : "What's Included"}
                </h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex gap-2"><span className="text-[#C9A86A]">•</span> {lang === "fr" ? "Collier" : lang === "ar" ? "سلسلة" : "Necklace"}</li>
                  <li className="flex gap-2"><span className="text-[#C9A86A]">•</span> {lang === "fr" ? "Bracelet" : lang === "ar" ? "سوار" : "Bracelet"}</li>
                  <li className="flex gap-2"><span className="text-[#C9A86A]">•</span> {lang === "fr" ? "Bague" : lang === "ar" ? "خاتم" : "Ring"}</li>
                  <li className="flex gap-2"><span className="text-[#C9A86A]">•</span> {lang === "fr" ? "Boucles d'oreilles" : lang === "ar" ? "أقراط" : "Earrings"}</li>
                  <li className="flex gap-2"><span className="text-[#C9A86A]">•</span> {lang === "fr" ? "Coffret de luxe" : lang === "ar" ? "علبة فاخرة" : "Luxury box"}</li>
                </ul>
              </div>

              <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#C9A86A]">✦</span>
                  <span className="text-white/70">{lang === "fr" ? "Qualité premium - Acier inoxydable A+" : lang === "ar" ? "جودة ممتازة - ستانلس ستيل A+" : "Premium quality - Stainless steel A+"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#C9A86A]">✦</span>
                  <span className="text-white/70">{lang === "fr" ? "Garantie 2 ans - Satisfaction assurée" : lang === "ar" ? "ضمان سنتين - رضا مضمون" : "2-year warranty - Satisfaction guaranteed"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#C9A86A]">✦</span>
                  <span className="text-white/70">{lang === "fr" ? "Résiste à l'eau - Parfums & transpiration" : lang === "ar" ? "مقاوم للماء - عطور وعرق" : "Water resistant - Perfumes & sweat"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#C9A86A]">✦</span>
                  <span className="text-white/70">{lang === "fr" ? "Hypoallergénique - Pour peaux sensibles" : lang === "ar" ? "مضاد للحساسية - للبشرة الحساسة" : "Hypoallergenic - For sensitive skin"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#C9A86A]">✦</span>
                  <span className="text-white/70">{lang === "fr" ? "Coffret élégant - Prêt à offrir" : lang === "ar" ? "علبة أنيقة - جاهزة للإهداء" : "Elegant box - Ready to gift"}</span>
                </div>
              </div>

              <div className="bg-[#111] border border-white/10 rounded-2xl p-6 text-center space-y-3">
                <h3 className="font-playfair text-xl text-[#C9A86A]">
                  {lang === "fr" ? "Votre confiance, notre priorité" : lang === "ar" ? "ثقتكم أولويتنا" : "Your trust, our priority"}
                </h3>
                <p className="text-white/60 text-sm">
                  {lang === "fr" ? "Livraison à votre porte. Vérifiez avant de payer. Payez uniquement si satisfait." : lang === "ar" ? "التوصيل لباب المنزل. افحص قبل الدفع. ادفع فقط إذا كنت راضياً." : "Delivery to your door. Check before paying. Pay only when satisfied."}
                </p>
                <ul className="space-y-2 text-sm text-white/70 text-left max-w-md mx-auto">
                  <li className="flex gap-2"><span className="text-[#B8934A]">•</span> {lang === "fr" ? "Livraison gratuite" : lang === "ar" ? "التوصيل مجاني" : "Free delivery"}</li>
                  <li className="flex gap-2"><span className="text-[#B8934A]">•</span> {lang === "fr" ? "Paiement à la livraison" : lang === "ar" ? "الدفع عند الاستلام" : "Cash on delivery"}</li>
                  <li className="flex gap-2"><span className="text-[#B8934A]">•</span> {lang === "fr" ? "Vérifiez avant de payer" : lang === "ar" ? "افحص قبل الدفع" : "Check before paying"}</li>
                </ul>
                <button onClick={handleBuyNow} className="mt-4 w-full bg-[#C9A86A] text-black px-8 py-4 rounded-full text-base font-medium tracking-widest uppercase hover:bg-[#B8934A] shadow-xl">
                  {lang === "fr" ? "Commander maintenant" : lang === "ar" ? "اطلبيه الآن" : "Order Now"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-24 md:bottom-5 right-5 z-40 flex flex-col items-center gap-1.5">
          <button
            onClick={handleBuyNow}
            aria-label="Commander"
            className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform"
          >
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
        {lightbox >= 0 && (
          <Lightbox items={gallery} index={lightbox} onNavigate={setLightbox} onClose={() => setLightbox(-1)} alt={name} />
        )}
      </div>
    </div>
  );
}