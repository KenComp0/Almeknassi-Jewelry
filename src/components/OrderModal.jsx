import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";

export default function OrderModal({ isOpen, onClose, product, qty = 1 }) {
  const { lang, formatPrice } = useLanguage();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const name = typeof product.name === "object" ? product.name[lang] : product.name;

  const t = {
    fr: {
      title: "Finaliser la commande",
      subtitle: "Remplissez vos informations, nous vous contactons sur WhatsApp",
      product: "Produit",
      qty: "Quantité",
      name: "Nom complet *",
      namePh: "Ex: Fatima Alami",
      phone: "Numéro de téléphone *",
      phonePh: "06 12 34 56 78",
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
      subtitle: "Fill your details, we will contact you on WhatsApp",
      product: "Product",
      qty: "Quantity",
      name: "Full name *",
      namePh: "Ex: John Doe",
      phone: "Phone number *",
      phonePh: "06 12 34 56 78",
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
      subtitle: "املأ معلوماتك، سنتواصل معك على واتساب",
      product: "المنتج",
      qty: "الكمية",
      name: "الاسم الكامل *",
      namePh: "مثال: فاطمة العلمي",
      phone: "رقم الهاتف *",
      phonePh: "06 12 34 56 78",
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
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;
    // Prevent URL overflow (>1800 chars after encode)
    const sanitizedName = form.name.trim().slice(0, 80);
    const sanitizedPhone = form.phone.trim().slice(0, 20);
    const sanitizedEmail = form.email.trim().slice(0, 100);
    const sanitizedAddress = form.address.trim().slice(0, 200);
    const number = (import.meta.env.VITE_WHATSAPP_NUMBER || "212664677347").replace(/\D/g, "");
    const priceStr = formatPrice(product.price * qty);
    let msg = "";
    if (lang === "fr") {
      msg = `Bonjour Al Meknassi Bijoux! 👋\n\nJe souhaite commander:\n*${name}* x${qty} - ${priceStr}\n\n*Mes informations:*\nNom: ${sanitizedName}\nTéléphone: ${sanitizedPhone}\n`;
      if (sanitizedEmail) msg += `E-mail: ${sanitizedEmail}\n`;
      msg += `Adresse: ${sanitizedAddress}\n\nMerci de confirmer la disponibilité et la livraison.`;
    } else if (lang === "ar") {
      msg = `مرحبا المكناسي! 👋\n\nأرغب في طلب:\n*${name}* x${qty} - ${priceStr}\n\n*معلوماتي:*\nالاسم: ${sanitizedName}\nالهاتف: ${sanitizedPhone}\n`;
      if (sanitizedEmail) msg += `البريد: ${sanitizedEmail}\n`;
      msg += `العنوان: ${sanitizedAddress}\n\nيرجى تأكيد التوفر والتوصيل.`;
    } else {
      msg = `Hello Al Meknassi Jewelry! 👋\n\nI would like to order:\n*${name}* x${qty} - ${priceStr}\n\n*My details:*\nName: ${sanitizedName}\nPhone: ${sanitizedPhone}\n`;
      if (sanitizedEmail) msg += `E-mail: ${sanitizedEmail}\n`;
      msg += `Address: ${sanitizedAddress}\n\nPlease confirm availability and delivery.`;
    }
    const encoded = encodeURIComponent(msg);
    if (encoded.length > 1800) {
      setErrors({ address: "Message trop long" });
      return;
    }
    setIsSubmitting(true);
    window.open(`https://wa.me/${number}?text=${encoded}`, "_blank", "noopener,noreferrer");
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      setForm({ name: "", phone: "", email: "", address: "" });
    }, 800);
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
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            <div className="p-6 md:p-7">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-playfair text-xl md:text-2xl">{t.title}</h3>
                  <p className="text-xs text-secondary mt-1">{t.subtitle}</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted">
                  ✕
                </button>
              </div>

              <div className="mt-5 bg-[#FDFBF7] border border-[#E8D5B5] rounded-xl p-3 flex gap-3">
                <img src={product.images[0]} alt={name} className="w-16 h-16 object-cover rounded-lg border border-white" />
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
                  <label className="text-xs font-medium tracking-wide uppercase">{t.name}</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t.namePh}
                    maxLength={80}
                    autoComplete="name"
                    className={`mt-1.5 w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.name ? "border-red-400" : "border-border"}`}
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
                    className={`mt-1.5 w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.phone ? "border-red-400" : "border-border"}`}
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
                    className={`mt-1.5 w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.email ? "border-red-400" : "border-border"}`}
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
                    className={`mt-1.5 w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none ${errors.address ? "border-red-400" : "border-border"}`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 border border-border rounded-full py-3.5 text-sm font-medium hover:bg-muted disabled:opacity-50">
                    {t.cancel}
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
    </AnimatePresence>
  );
}
