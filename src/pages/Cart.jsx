import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Section from "../components/Section";
import Button from "../components/Button";
import MarbleBackground from "../components/MarbleBackground";
import { useLanguage } from "../i18n/LanguageContext";

export default function Cart({ cart, onUpdateQty, onRemove }) {
  const { t, formatPrice, lang } = useLanguage();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const isFreeShipping = subtotal > 1000;
  const total = subtotal;
  const [showOrder, setShowOrder] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWhatsAppOrder = () => setShowOrder(true);

  const validate = () => {
    const e = {};
    const txt = {
      fr: { required: "Ce champ est requis", phoneInvalid: "Numéro invalide", emailInvalid: "E-mail invalide" },
      en: { required: "Required", phoneInvalid: "Invalid phone", emailInvalid: "Invalid email" },
      ar: { required: "مطلوب", phoneInvalid: "رقم غير صالح", emailInvalid: "بريد غير صالح" },
    }[lang];
    const nameTrim = form.name.trim();
    const phoneTrim = form.phone.replace(/\s+/g, "");
    const emailTrim = form.email.trim();
    const addressTrim = form.address.trim();
    if (!nameTrim) e.name = txt.required;
    else if (nameTrim.length < 2) e.name = txt.required;
    else if (nameTrim.length > 80) e.name = "80 max";
    if (!phoneTrim) e.phone = txt.required;
    else if (!/^(\+?212|0)[5-7][0-9]{8}$/.test(phoneTrim)) e.phone = txt.phoneInvalid;
    if (emailTrim) {
      if (emailTrim.length > 100) e.email = "100 max";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) e.email = txt.emailInvalid;
    }
    if (!addressTrim) e.address = txt.required;
    else if (addressTrim.length < 5) e.address = txt.required;
    else if (addressTrim.length > 200) e.address = "200 max";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitOrder = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;
    const sanitizedName = form.name.trim().slice(0, 80);
    const sanitizedPhone = form.phone.trim().slice(0, 20);
    const sanitizedEmail = form.email.trim().slice(0, 100);
    const sanitizedAddress = form.address.trim().slice(0, 200);
    let message =
      lang === "fr"
        ? `Bonjour Al Meknassi Bijoux! 👋\n\nJe souhaite commander:\n\n`
        : lang === "ar"
        ? `مرحبا المكناسي! 👋\n\nأرغب في طلب:\n\n`
        : `Hello Al Meknassi Jewelry! 👋\n\nI would like to order:\n\n`;
    cart.forEach((item, idx) => {
      const name = typeof item.name === "object" ? item.name[lang] : item.name;
      message += `${idx + 1}. *${name}* (${item.category})\n   Qté: ${item.qty} × ${formatPrice(item.price)} = ${formatPrice(
        item.price * item.qty
      )}\n`;
    });
    message += `\n*${t("cart.subtotal")}: ${formatPrice(subtotal)}*\n`;
    message += isFreeShipping ? `✓ ${t("cart.free")}\n` : `+ ${t("cart.viaWhatsapp")}\n`;
    message += `\n*${lang === "fr" ? "Mes informations" : lang === "ar" ? "معلوماتي" : "My details"}:*\n`;
    message += `${lang === "fr" ? "Nom" : lang === "ar" ? "الاسم" : "Name"}: ${sanitizedName}\n`;
    message += `${lang === "fr" ? "Téléphone" : lang === "ar" ? "الهاتف" : "Phone"}: ${sanitizedPhone}\n`;
    if (sanitizedEmail) message += `E-mail: ${sanitizedEmail}\n`;
    message += `${lang === "fr" ? "Adresse" : lang === "ar" ? "العنوان" : "Address"}: ${sanitizedAddress}\n`;
    const encoded = encodeURIComponent(message);
    if (encoded.length > 1800) {
      setErrors({ address: "Message trop long" });
      return;
    }
    const number = (import.meta.env.VITE_WHATSAPP_NUMBER || "212664677347").replace(/\D/g, "");
    setIsSubmitting(true);
    window.open(`https://wa.me/${number}?text=${encoded}`, "_blank", "noopener,noreferrer");
    setTimeout(() => {
      setIsSubmitting(false);
      setShowOrder(false);
      setForm({ name: "", phone: "", email: "", address: "" });
    }, 800);
  };

  if (cart.length === 0) {
    return (
      <MarbleBackground>
        <div className="container-luxury pt-[96px] pb-8">
          <Section>
            <div className="text-center py-16 max-w-md mx-auto bg-white/80 backdrop-blur border border-white/50 p-8 shadow-[0_10px_40px_rgba(201,168,106,0.12)] rounded-2xl">
              <div className="w-20 h-20 mx-auto border border-border flex items-center justify-center text-secondary mb-6 bg-white rounded-full">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M6 6h15l-1.5 9h-13z" />
                  <path d="M6 6L5 2H2" />
                  <circle cx="9" cy="20" r="1.5" />
                  <circle cx="18" cy="20" r="1.5" />
                </svg>
              </div>
              <h1 className="font-playfair text-3xl">{t("cart.emptyTitle")}</h1>
              <p className="text-secondary mt-3 leading-relaxed">{t("cart.emptyDesc")}</p>
              <Link to="/" className="inline-block mt-8">
                <Button>{t("cart.shopCollection")}</Button>
              </Link>
            </div>
          </Section>
        </div>
      </MarbleBackground>
    );
  }

  return (
    <MarbleBackground>
      <div className="bg-white/70 backdrop-blur border-b border-white/50">
        <div className="container-luxury pt-[96px] pb-8">
          <h1 className="font-playfair text-3xl">{t("cart.title")}</h1>
          <p className="text-secondary text-sm mt-2">
            {cart.length} {cart.length === 1 ? "article" : "articles"} • {t("cart.subtitle")}
          </p>
        </div>
      </div>

      <Section padding="py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const name = typeof item.name === "object" ? item.name[lang] : item.name;
              return (
                <div key={item.id} className="flex gap-4 bg-white/90 backdrop-blur border border-white/50 p-4 shadow-sm">
                  <Link to={`/product/${item.id}`} className="w-24 h-24 bg-[#FDFBF7] shrink-0 overflow-hidden">
                    <img src={item.images[0]} alt={name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.id}`} className="hover:text-accent">
                      <h3 className="font-medium text-[15px] leading-tight truncate pr-2">{name}</h3>
                    </Link>
                    <p className="text-xs tracking-widest uppercase text-secondary mt-1">{item.category}</p>
                    <p className="text-sm font-semibold mt-2">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-border bg-white">
                        <button onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))} className="w-8 h-8 hover:bg-muted text-sm">
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                        <button onClick={() => onUpdateQty(item.id, item.qty + 1)} className="w-8 h-8 hover:bg-muted text-sm">
                          +
                        </button>
                      </div>
                      <button onClick={() => onRemove(item.id)} className="text-xs underline text-secondary hover:text-primary ml-2">
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur border border-white/50 p-6 sticky top-[88px] shadow-[0_10px_40px_rgba(201,168,106,0.12)]">
              <h3 className="font-playfair text-lg">{t("cart.orderSummary")}</h3>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary">{t("cart.subtotal")}</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">{t("cart.shipping")}</span>
                  <span className={`font-medium ${isFreeShipping ? "text-green-600" : ""}`}>
                    {isFreeShipping ? t("cart.free") : t("cart.viaWhatsapp")}
                  </span>
                </div>
                <div className="h-px bg-border my-4" />
                <div className="flex justify-between text-base">
                  <span className="font-semibold">{t("cart.total")}</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
                {!isFreeShipping && (
                  <p className="text-xs text-secondary bg-[#FDFBF7] border border-[#E8D5B5] p-3 mt-3">
                    {t("cart.addMore")} <span className="font-semibold text-primary">{formatPrice(1000 - subtotal)}</span> {t("cart.moreForFree")}
                  </p>
                )}
              </div>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full mt-6 bg-[#25D366] border border-[#25D366] text-white py-3.5 text-sm font-medium tracking-[0.12em] uppercase hover:bg-[#128C7E] hover:border-[#128C7E] transition-colors flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M19.05 4.91A9.9 9.9 0 0 0 12.02 2C6.54 2 2.08 6.46 2.08 11.94c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.77 1.22h.01c5.48 0 9.94-4.46 9.94-9.94 0-2.65-1.03-5.14-2.92-7.03zm-7.03 15.2h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.27 8.27 0 0 1-1.27-4.32c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.26.86 5.81 2.41a8.17 8.17 0 0 1 2.41 5.82c0 4.55-3.7 8.25-8.24 8.25zm6.74-6.19c-.37-.19-2.21-1.09-2.55-1.21-.34-.12-.59-.19-.84.19-.25.37-.97 1.21-1.19 1.46-.22.25-.45.28-.82.09-.37-.19-1.57-.58-3-1.86-1.11-.99-1.86-2.21-2.08-2.58-.22-.37-.02-.57.16-.76.16-.16.37-.42.56-.63.19-.2.25-.34.37-.57.12-.22.06-.42-.03-.6-.09-.19-.84-2.01-1.15-2.75-.3-.72-.61-.62-.84-.63l-.72-.01c-.25 0-.66.09-1 .45-.34.37-1.31 1.28-1.31 3.13s1.34 3.63 1.53 3.88c.19.25 2.65 4.05 6.42 5.68.9.39 1.6.62 2.15.79.9.29 1.72.25 2.37.15.72-.11 2.21-.9 2.53-1.78.31-.87.31-1.62.22-1.78-.09-.16-.34-.25-.71-.44z" />
                </svg>
                {t("cart.orderWhatsapp")}
              </button>

              <Link
                to="/"
                className="w-full mt-3 bg-white border border-primary text-primary py-3.5 text-sm font-medium tracking-[0.12em] uppercase hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
              >
                {t("cart.continueShopping")}
              </Link>

              <div className="mt-6 pt-6 border-t border-border space-y-2 text-xs text-secondary">
                <p className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> {t("cart.cashOnDelivery")}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> {t("cart.returns")}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> {t("cart.secure")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Order Form Modal - same as product, with cart details */}
      <AnimatePresence>
        {showOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowOrder(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 12, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              <div className="p-6 md:p-7">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-playfair text-xl">
                      {lang === "fr" ? "Finaliser la commande" : lang === "ar" ? "إتمام الطلب" : "Complete Order"}
                    </h3>
                    <p className="text-xs text-secondary mt-1">
                      {lang === "fr" ? "Remplissez vos informations, nous vous contactons sur WhatsApp" : lang === "ar" ? "املأ معلوماتك، سنتواصل معك على واتساب" : "Fill your details, we will contact you on WhatsApp"}
                    </p>
                  </div>
                  <button onClick={() => setShowOrder(false)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted">
                    ✕
                  </button>
                </div>
                <div className="mt-4 bg-[#FDFBF7] border border-[#E8D5B5] rounded-xl p-3">
                  <p className="text-xs font-medium">
                    {cart.length} {lang === "fr" ? "article(s)" : lang === "ar" ? "منتج" : "item(s)"} • {formatPrice(subtotal)}
                  </p>
                  <p className="text-xs text-secondary mt-1 truncate">
                    {cart.map((it) => (typeof it.name === "object" ? it.name[lang] : it.name)).join(", ")}
                  </p>
                </div>
                <form onSubmit={submitOrder} className="mt-6 space-y-4" noValidate>
                  <div>
                    <label className="text-xs font-medium tracking-wide uppercase">
                      {lang === "fr" ? "Nom complet *" : lang === "ar" ? "الاسم الكامل *" : "Full name *"}
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={lang === "fr" ? "Ex: Fatima Alami" : lang === "ar" ? "مثال: فاطمة العلمي" : "Ex: John Doe"}
                      maxLength={80}
                      autoComplete="name"
                      className={`mt-1.5 w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.name ? "border-red-400" : "border-border"}`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium tracking-wide uppercase">
                      {lang === "fr" ? "Numéro de téléphone *" : lang === "ar" ? "رقم الهاتف *" : "Phone number *"}
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="06 12 34 56 78"
                      type="tel"
                      inputMode="tel"
                      maxLength={20}
                      autoComplete="tel"
                      className={`mt-1.5 w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.phone ? "border-red-400" : "border-border"}`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium tracking-wide uppercase">
                      {lang === "fr" ? "E-mail (optionnel)" : lang === "ar" ? "البريد (اختياري)" : "E-mail (optional)"}
                    </label>
                    <input
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="exemple@email.com"
                      type="email"
                      maxLength={100}
                      autoComplete="email"
                      className={`mt-1.5 w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.email ? "border-red-400" : "border-border"}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium tracking-wide uppercase">
                      {lang === "fr" ? "Adresse de livraison *" : lang === "ar" ? "عنوان التوصيل *" : "Delivery address *"}
                    </label>
                    <textarea
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder={lang === "fr" ? "Ville, quartier, rue, n°" : lang === "ar" ? "المدينة، الحي، الشارع" : "City, street, no."}
                      rows={3}
                      maxLength={200}
                      autoComplete="street-address"
                      className={`mt-1.5 w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none ${errors.address ? "border-red-400" : "border-border"}`}
                    />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowOrder(false)} disabled={isSubmitting} className="flex-1 border border-border rounded-full py-3.5 text-sm font-medium hover:bg-muted disabled:opacity-50">
                      {lang === "fr" ? "Annuler" : lang === "ar" ? "إلغاء" : "Cancel"}
                    </button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-black text-white rounded-full py-3.5 text-sm font-medium tracking-wide hover:bg-[#1a1a1a] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M19.05 4.91A9.9 9.9 0 0 0 12.02 2C6.54 2 2.08 6.46 2.08 11.94c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.77 1.22h.01c5.48 0 9.94-4.46 9.94-9.94 0-2.65-1.03-5.14-2.92-7.03z"/></svg>
                      {isSubmitting ? "..." : lang === "fr" ? "Envoyer sur WhatsApp" : lang === "ar" ? "إرسال عبر واتساب" : "Send on WhatsApp"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MarbleBackground>
  );
}
