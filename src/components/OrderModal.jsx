import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";
import { useAuth } from "../auth/AuthContext";
import Lightbox from "./Lightbox";
import { trackInitiateCheckout } from "../lib/pixel";
import { saveOrder, saveProfile, confirmOrderOnline, totalsFor, cacheLastOrder } from "../lib/orders";

export default function OrderModal({ isOpen, onClose, product, qty = 1, onToggleWishlist, wished, promo = null }) {
  const { lang, formatPrice } = useLanguage();
  const { user, setProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", size: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    if (isOpen && product) trackInitiateCheckout(product, qty);
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const name = typeof product.name === "object" ? product.name[lang] : product.name;

  const t = {
    fr: {
      title: "Finaliser la commande",
      product: "Produit",
      qty: "Quantité",
      size: "Taille de bague *",
      name: "Nom complet *",
      namePh: "Nom complet",
      phone: "Numéro de téléphone *",
      phonePh: "06 00 00 00 00",
      email: "E-mail (optionnel)",
      emailPh: "exemple@email.com",
      address: "Adresse de livraison *",
      addressPh: "Ville, quartier, rue, n°",
      cancel: "Annuler",
      submit: "Envoyer sur WhatsApp",
      required: "Ce champ est requis",
      phoneInvalid: "Numéro invalide",
      emailInvalid: "E-mail invalide",
    },
    en: {
      title: "Complete Order",
      product: "Product",
      qty: "Quantity",
      size: "Ring size *",
      name: "Full name *",
      namePh: "Full name",
      phone: "Phone number *",
      phonePh: "06 00 00 00 00",
      email: "E-mail (optional)",
      emailPh: "example@email.com",
      address: "Delivery address *",
      addressPh: "City, street, no.",
      cancel: "Cancel",
      submit: "Send on WhatsApp",
      required: "Required",
      phoneInvalid: "Invalid phone",
      emailInvalid: "Invalid email",
    },
    ar: {
      title: "إتمام الطلب",
      product: "المنتج",
      qty: "الكمية",
      size: "مقاس الخاتم *",
      name: "الاسم الكامل *",
      namePh: "الاسم الكامل",
      phone: "رقم الهاتف *",
      phonePh: "06 00 00 00 00",
      email: "البريد (اختياري)",
      emailPh: "example@email.com",
      address: "عنوان التوصيل *",
      addressPh: "المدينة، الحي، الشارع",
      cancel: "إلغاء",
      submit: "إرسال عبر واتساب",
      required: "مطلوب",
      phoneInvalid: "رقم غير صالح",
      emailInvalid: "بريد غير صالح",
    },
  }[lang];

  const validate = () => {
    const e = {};
    const nameTrim = form.name.trim();
    const phoneTrim = form.phone.replace(/\s+/g, "");
    const emailTrim = form.email.trim();
    const addressTrim = form.address.trim();
    if (!nameTrim) e.name = t.required;
    else if (nameTrim.length < 2) e.name = t.required;
    else if (nameTrim.length > 80) e.name = "80 max";
    if (!phoneTrim) e.phone = t.required;
    else if (!/^(\+?212|0)[5-7][0-9]{8}$/.test(phoneTrim)) e.phone = t.phoneInvalid;
    if (emailTrim) {
      if (emailTrim.length > 100) e.email = "100 max";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) e.email = t.emailInvalid;
    }
    if (!addressTrim) e.address = t.required;
    else if (addressTrim.length < 5) e.address = t.required;
    else if (addressTrim.length > 200) e.address = "200 max";
    if (!form.size) e.size = t.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;
    const profile = {
      name: form.name.trim().slice(0, 80),
      phone: form.phone.trim().slice(0, 20),
      email: form.email.trim().slice(0, 100),
      address: form.address.trim().slice(0, 200),
      size: form.size,
    };
    const items = [{ id: product.id, name, image: product.images?.[0] || "", price: product.price, qty, size: profile.size }];
    const { total, subtotal, shipping } = totalsFor(items, promo);
    setIsSubmitting(true);
    try {
      const { orderId, orderNumber } = await saveOrder({ user, profile, items, promo, lang });
      confirmOrderOnline({ orderId, total, qty });
      if (user) {
        await saveProfile(user.uid, { ...profile, email: profile.email || user.email || "" });
        setProfile((p) => ({ ...(p || {}), ...profile }));
      }
      cacheLastOrder({
        orderId,
        orderNumber,
        createdAt: new Date().toISOString(),
        lang,
        customer: { name: profile.name, phone: profile.phone },
        items: [{ name, image: product.images?.[0] || "", price: product.price, qty, size: profile.size, ref: "AMK-001" }],
        subtotal,
        promo,
        shipping,
        total,
      });
      onClose();
      navigate(`/merci/${orderId}`, {
        state: {
          orderId,
          orderNumber,
          createdAt: new Date().toISOString(),
          lang,
          customer: { name: profile.name, phone: profile.phone },
          items: [{ name, image: product.images?.[0] || "", price: product.price, qty, size: profile.size, ref: "AMK-001" }],
          subtotal,
          promo,
          shipping,
          total,
        },
      });
      setForm({ name: "", phone: "", email: "", address: "", size: "" });
    } catch {
      setErrors({
        address:
          lang === "ar"
            ? "خطأ في الشبكة. حاولوا مجددًا."
            : lang === "fr"
            ? "Erreur réseau. Réessayez."
            : "Network error. Try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 12, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-gray-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            <div className="p-6 md:p-7">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 text-center">
                  <h3 className="font-playfair text-xl md:text-2xl">{t.title}</h3>
                </div>
                <button onClick={onClose} className="w-8 h-8 shrink-0 rounded-full border border-gray-300 bg-gray-100 text-gray-900 flex items-center justify-center hover:bg-gray-200">
                  ✕
                </button>
              </div>

              <div className="mt-5 bg-[#FDFBF7] border border-[#E8D5B5] rounded-xl p-3 flex gap-3">
                <img src="https://i.ibb.co/PvXpdPJ9/587-B720-B-1-B7-A-4-ACF-BF04-EA2-BBD47429-C.webp" alt={name} onClick={() => setViewerOpen(true)} className="w-24 h-24 object-contain bg-white rounded-lg border border-white p-1 cursor-zoom-in" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs tracking-widest uppercase text-[#B8934A]">{product.category}</p>
                  <p className="font-medium text-sm leading-tight truncate">{name}</p>
                  <p className="text-xs text-secondary mt-1">
                    {t.qty}: {qty} • {formatPrice(product.price * qty)}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                <div>
                  <label className="text-xs font-medium tracking-wide uppercase">{t.size}</label>
                  <div className="mt-1.5 flex gap-2">
                    {["6", "7", "8", "9", "10"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm({ ...form, size: s })}
                        className={`flex-1 border rounded-xl py-2.5 text-sm font-medium transition-colors ${form.size === s ? "border-[#C9A86A] bg-[#C9A86A]/10 text-gray-900" : "border-gray-300 text-gray-500 hover:border-gray-400"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {errors.size && <p className="text-xs text-red-500 mt-1">{errors.size}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium tracking-wide uppercase">{t.name}</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t.namePh}
                    maxLength={80}
                    autoComplete="name"
                    className={`mt-1.5 w-full border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:border-primary ${errors.name ? "border-red-400" : "border-border"}`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium tracking-wide uppercase">{t.phone}</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder={t.phonePh}
                    type="tel"
                    inputMode="tel"
                    maxLength={20}
                    autoComplete="tel"
                    className={`mt-1.5 w-full border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:border-primary ${errors.phone ? "border-red-400" : "border-border"}`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium tracking-wide uppercase">{t.email}</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={t.emailPh}
                    type="email"
                    maxLength={100}
                    autoComplete="email"
                    className={`mt-1.5 w-full border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:border-primary ${errors.email ? "border-red-400" : "border-border"}`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium tracking-wide uppercase">{t.address}</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder={t.addressPh}
                    rows={3}
                    maxLength={200}
                    autoComplete="street-address"
                    className={`mt-1.5 w-full border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:border-primary resize-none ${errors.address ? "border-red-400" : "border-border"}`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 border border-border rounded-full py-3.5 text-sm font-medium hover:bg-muted disabled:opacity-50">
                    {t.cancel}
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleWishlist && onToggleWishlist(product.id)}
                    aria-label="Wishlist"
                    className={`w-12 shrink-0 border rounded-full py-3.5 text-lg leading-none flex items-center justify-center ${wished ? "border-[#C9A86A] bg-[#C9A86A]/10 text-[#C9A86A]" : "border-gray-300 text-gray-400 hover:border-gray-400"}`}
                  >
                    {wished ? "♥" : "♡"}
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 bg-black text-white rounded-full py-3.5 text-sm font-medium tracking-wide hover:bg-[#1a1a1a] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M19.05 4.91A9.9 9.9 0 0 0 12.02 2C6.54 2 2.08 6.46 2.08 11.94c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.77 1.22h.01c5.48 0 9.94-4.46 9.94-9.94 0-2.65-1.03-5.14-2.92-7.03z"/></svg>
                    {isSubmitting ? "..." : t.submit}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
      {viewerOpen && (
        <Lightbox
          items={[{ type: "image", src: "https://i.ibb.co/PvXpdPJ9/587-B720-B-1-B7-A-4-ACF-BF04-EA2-BBD47429-C.webp" }]}
          index={0}
          onNavigate={() => {}}
          onClose={() => setViewerOpen(false)}
          alt={name}
        />
      )}
    </AnimatePresence>
  );
}
